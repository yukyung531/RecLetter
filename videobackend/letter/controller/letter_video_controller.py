import os
from json import dumps

import boto3
from dotenv.main import load_dotenv
from fastapi import APIRouter, BackgroundTasks
from kafka import KafkaProducer

from videobackend.letter.config.kafka_config import *
from videobackend.letter.dto.req import MakeLetterReq

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

# router
letter_video_router = APIRouter()


# @letter_video_router.post("/letter")
# async def make_letter(make_letter_dto: MakeLetterReq) -> None:
#     print("make letter")
#     print(make_letter_dto)
#     # BackgroundTasks.add_task(create_letter, make_letter_dto, BUCKET, s3_client)
#     # create_letter(make_letter_dto, BUCKET, s3_client)

@letter_video_router.get("/test")
async def test() -> None:
    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
        value_serializer=lambda x: dumps(x).encode('utf-8')
    )

    value = {
        "studioId": "a1d1d6a7-d605-46b5-b752-0c18b30bbde4",
        "studioFrameId": 7,
        "studioBgmId": 1,
        "bgmVolume": 100,
        "clipInfoList": [
            {
                "clipId":2,
                "clipTitle": "김연수 1",
                "clipVolume": 100
            },
            {
                "clipId": 3,
                "clipTitle": "김연수 1",
                "clipVolume": 100
            },
            {
                "clipId": 4,
                "clipTitle": "김연수 1",
                "clipVolume": 100
            },
        ]
    }

    producer.send(KAFKA_LETTER_REQUEST_TOPIC, value=value)

