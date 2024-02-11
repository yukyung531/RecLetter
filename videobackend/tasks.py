import boto3
from celery import Celery
from dotenv.main import load_dotenv
from kafka import KafkaConsumer, KafkaProducer
from json import loads, dump

from videobackend.letter.dto.req import MakeLetterReq
from videobackend.letter.utils.file_utils import asset_download, letter_upload
from videobackend.letter.kafka_config import *
from videobackend.letter.utils.video_edit_utils import *


load_dotenv()
celery_app = Celery("tasks", broker="kafka://localhost:9093",
                    backend='rpc://')

# 환경변수
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET')
REGION = os.environ.get('AWS_REGION')
BUCKET = os.environ.get('AWS_BUCKET')

# S3 클라이언트 설정
s3_client = boto3.client('s3', region_name=REGION,
                         aws_access_key_id=AWS_ACCESS_KEY,
                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY)


@celery_app.task
def download_assets():
    # assets 다운로드
    consumer = KafkaConsumer(topics=KAFKA_LETTER_REQUEST_TOPIC,
                             bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
                             group_id=KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID,
                             value_deserializer=lambda x: loads(x.decode('utf-8'))
                             )

    for message in consumer:
        make_letter_req = MakeLetterReq(message.value)

        asset_download(make_letter_req, BUCKET, s3_client)

        consumer.commit()

        producer = KafkaProducer(
            bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
            value_serializer=lambda x: dumps(x).encode('utf-8')
        )

        producer.send(topic=KAFKA_ASSET_DOWNLOADINFO_TOPIC, value=message.value)


@celery_app.task
def encode_letter():
    consumer = KafkaConsumer(
        topic=KAFKA_ASSET_DOWNLOADINFO_TOPIC,
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        group_id=KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID,
        value_deserializer = lambda x: loads(x.decode('utf-8'))
    )

    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )

    for message in consumer:
        make_letter_req = MakeLetterReq(message.value)

        try:
            studio_id = make_letter_req.studio_id
            clip_info_list = make_letter_req.clip_info_list
            # 클립 로딩
            clip_list = list(map(lambda x: load_clip(studio_id), clip_info_list))

            # 각 클립 화면 반전
            mirrored_clip = list(map(lambda x: mirror_clip(x), clip_list))
            del clip_list

            # 각 클립의 볼륨 조절
            volume_tuned_clip = list(
                map(lambda x: tune_volume(x[1], clip_info_list[x[0]].clip_volume),
                    enumerate(mirrored_clip)))
            del mirrored_clip

            # 각 클립 연결
            concatenated_letter = concat_clip(volume_tuned_clip)
            del volume_tuned_clip

            # 연결된 영상에 프레임 인코딩
            frame_added_letter = encode_frame(concatenated_letter,
                                              make_letter_req.studio_frame_id)
            del concatenated_letter

            # 스티커 인코딩
            sticker_added_letter = encode_sticker(frame_added_letter, make_letter_req.get_sticker_file_path())
            del frame_added_letter

            # 전체 영상 볼륨 조절
            volume_tuned_letter = tune_volume(sticker_added_letter,
                                              make_letter_req.studio_volume)
            del frame_added_letter

            # letter 완성 후 저장
            directory = make_letter_req.get_assets_directory()
            key = make_letter_req.studio_id + ".mp4"
            complete_file_name = directory + "/" + key
            if not os.path.exists(directory):
                os.makedirs(directory)

            volume_tuned_letter.write_videofile(complete_file_name, fps=30,
                                                codec='libx264')
            volume_tuned_letter.close()

            # s3 업로드
            letter_upload(complete_file_name, key, BUCKET, s3_client)

            # produce
            print("create_letter: success")
            producer.send(KAFKA_LETTER_ENCODINGINFO_TOPIC, value={"result": "success"})
        except Exception as e:
            print("create_letter: fail")
            print(e)
            producer.send(KAFKA_LETTER_ENCODINGINFO_TOPIC, value={"result": "fail"})