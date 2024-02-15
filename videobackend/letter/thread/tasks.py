import os
import shutil
import time

import boto3
from dotenv.main import load_dotenv
from kafka import KafkaConsumer, KafkaProducer
from json import loads, dumps

from videobackend.letter.dto.req import MakeLetterReq
from videobackend.letter.utils.file_utils import asset_download, letter_upload, \
    close_clip
from videobackend.letter.config.kafka_config import *
from videobackend.letter.utils.video_edit_utils import *


load_dotenv()

# 환경변수
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET')
REGION = os.environ.get('AWS_REGION')
BUCKET = os.environ.get('AWS_BUCKET')

# S3 클라이언트 설정
s3_client = boto3.client('s3', region_name=REGION,
                         aws_access_key_id=AWS_ACCESS_KEY,
                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY)


# @shared_task
def download_assets():
    # 다운로드 consunmer
    consumer = KafkaConsumer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        group_id=KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID,
        value_deserializer=lambda x: loads(x.decode('utf-8')),
        max_poll_interval_ms=30 * 60 * 1000
    )
    consumer.subscribe(topics=[KAFKA_LETTER_REQUEST_TOPIC])

    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )

    download_path = os.environ.get("DOWNLOAD_PATH", "./download")
    if not os.path.exists(download_path):
        os.makedirs(download_path)

    while True:
        # 다운로드 된 asset 수 관리
        while True:
            if len(os.listdir(download_path)) > 30:
                consumer.pause()
                time.sleep(5 * 60 * 1000)
            else:
                consumer.resume()
                break

        consumer.poll(max_records=10)
        print("download_assets poll")

        for message in consumer:
            make_letter_req = MakeLetterReq(message.value)
            try:
                print("다운로드 시작:", make_letter_req.studio_id)
                asset_download(make_letter_req, BUCKET, s3_client)

                producer.send(
                    topic=KAFKA_ASSET_DOWNLOADINFO_TOPIC,
                    value=message.value
                )

                producer.flush()
                print("다운로드 완료")
            except Exception as e:
                print(e)
                producer.send(
                    KAFKA_LETTER_RESULTINFO_TOPIC,
                    value={
                        "result": "fail",
                        "studioId": make_letter_req.studio_id
                    }
                )
                shutil.rmtree(os.environ.get("DOWNLOAD_PATH", "./download") + "/" + make_letter_req.studio_id)

    consumer.commit()
    print("영상 다운로드 commit")


# @shared_task
def encode_letter():
    # 영상 인코딩 consumer
    consumer = KafkaConsumer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        group_id=KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID,
        value_deserializer=lambda x: loads(x.decode('utf-8')),
        max_poll_interval_ms= 90 * 60 * 1000
    )
    consumer.subscribe(topics=[KAFKA_ASSET_DOWNLOADINFO_TOPIC])

    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )

    while True:
        consumer.poll(max_records=1)
        print("encode_letter poll")

        for message in consumer:
            make_letter_req = MakeLetterReq(message.value)

            try:
                print("영상 인코딩 시작:", make_letter_req.studio_id)
                studio_id = make_letter_req.studio_id
                clip_info_list = make_letter_req.clip_info_list
                # 클립 로딩
                print("클립 로딩")
                clip_list = list(
                    map(lambda x: load_clip(x, studio_id=studio_id), clip_info_list))

                # 각 클립 화면 반전
                print("화면 반전")
                mirrored_clip = list(map(lambda x: mirror_clip(x), clip_list))

                # 각 클립의 볼륨 조절
                print("볼륨 조절")
                volume_tuned_clip = list(
                    map(lambda x: tune_volume(x[1], clip_info_list[x[0]].clip_volume),
                        enumerate(mirrored_clip)))
                del mirrored_clip

                # 각 클립 연결
                print("클립 연결")
                concatenated_letter = concat_clip(volume_tuned_clip)
                del volume_tuned_clip

                # 연결된 영상에 프레임 인코딩
                print("프레임 삽입")
                frame_added_letter = encode_frame(
                    concatenated_letter,
                    make_letter_req.studio_frame_id,
                    make_letter_req.get_sticker_file_path()
                )
                del concatenated_letter

                # bgm 삽입
                print("bgm 삽입")
                bgm_inserted_letter = insert_bgm(
                    frame_added_letter,
                    make_letter_req.studio_bgm_id,
                    make_letter_req.studio_bgm_volume
                )
                del frame_added_letter

                # letter 완성 후 저장
                print("저장 시작")
                directory = make_letter_req.get_assets_directory()
                key = make_letter_req.studio_id + ".mp4"
                complete_file_name = directory + "/" + key
                if not os.path.exists(directory):
                    os.makedirs(directory)

                bgm_inserted_letter.write_videofile(
                    complete_file_name,
                    fps=30,
                    codec='libx264',
                    audio_codec='aac',
                    remove_temp=True,
                )
                print("인코딩 완료")

                bgm_inserted_letter.close()
                close_clip(clip_list)

                # produce
                print("create_letter: success")
                producer.send(
                    KAFKA_LETTER_ENCODINGINFO_TOPIC,
                    value={
                        "studioId": studio_id,
                        "filePath": complete_file_name,
                        "key": key,
                        "count": 0
                    }
                )
            except Exception as e:
                print("create_letter: fail")
                print(e)
                producer.send(
                    KAFKA_LETTER_RESULTINFO_TOPIC,
                    value={
                        "result": "fail",
                        "studioId": studio_id
                    }
                )

            producer.flush()

        consumer.commit()


def upload_letter():
    consumer = KafkaConsumer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        group_id=KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID,
        value_deserializer=lambda x: loads(x.decode('utf-8')),
        max_poll_interval_ms=30 * 60 * 1000
    )
    consumer.subscribe(topics=[KAFKA_LETTER_ENCODINGINFO_TOPIC])

    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )

    while True:
        consumer.poll(0, 10)
        print("upload_letter poll")
        for message in consumer:
            value = message.value
            count = value['count']

            if count <= 3:
                file_path = value['filePath']
                key = value['key']
                studio_id = value['studioId']
                # s3 업로드
                try:
                    letter_upload(file_path, key, BUCKET, s3_client)
                    producer.send(
                        KAFKA_LETTER_RESULTINFO_TOPIC,
                        value={"result": "success",
                               "studioId": studio_id}
                    )

                except Exception as e:
                    print(e)
                    value["count"] += 1
                    producer.send(
                        KAFKA_LETTER_ENCODINGINFO_TOPIC,
                        value=value
                    )
            else:
                print("upload retry count reach limit")
                producer.send(
                    KAFKA_LETTER_RESULTINFO_TOPIC,
                    value={"result": "fail",
                           "studioId": studio_id
                           }
                )

            producer.flush()


def delete_assets():
    consumer = KafkaConsumer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        group_id=KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID,
        value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    consumer.subscribe(topics=[KAFKA_LETTER_RESULTINFO_TOPIC])

    while True:
        consumer.poll()
        print("delete_assets poll")

        for message in consumer:
            value = message.value
            result = value['result']

            try:
                if result == "success":
                    shutil.rmtree(os.environ.get("DOWNLOAD_PATH", "./download") + "/" + value["studioId"])
            except Exception as e:
                print(e)
