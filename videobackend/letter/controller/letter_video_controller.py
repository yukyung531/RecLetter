import os
from json import dumps

import boto3
from dotenv.main import load_dotenv
from fastapi import APIRouter, BackgroundTasks
from kafka import KafkaProducer

from videobackend.letter.config.kafka_config import *
from videobackend.letter.dto.req import MakeLetterReq

# load_dotenv()
# # 환경변수
# AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS')
# AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET')
# REGION = os.environ.get('AWS_REGION')
# BUCKET = os.environ.get('AWS_BUCKET')
#
# # S3 클라이언트 설정
# s3_client = boto3.client('s3', region_name=REGION,
#                          aws_access_key_id=AWS_ACCESS_KEY,
#                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

# router
letter_video_router = APIRouter()


# @letter_video_router.post("/letter")
# async def make_letter(make_letter_dto: MakeLetterReq) -> None:
#     print("make letter")
#     print(make_letter_dto)
#     # BackgroundTasks.add_task(create_letter, make_letter_dto, BUCKET, s3_client)
#     # create_letter(make_letter_dto, BUCKET, s3_client)

# @letter_video_router.get("/test")
# async def test() -> None:
#     producer = KafkaProducer(
#         bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
#         value_serializer=lambda x: dumps(x).encode('utf-8')
#     )
#
#     value = {
#         "studioId": "9ab5bc8c-1f13-45c5-9c7c-01ef4f54dd3c",
#         "studioFrameId": 7,
#         "studioSticker": "9ab5bc8c-1f13-45c5-9c7c-01ef4f54dd3c/1707787584517.png",
#         "studioBgmId": 1,
#         "studioBgmVolume": 100,
#         "clipInfoList": [
#             {
#                 "clipId": 4,
#                 "clipTitle": "김연수 1",
#                 "clipVolume": 100
#             }
#             # {
#             #     "clipId": 2,
#             #     "clipTitle": "김연수 2",
#             #     "clipVolume": 100
#             # },
#             # {
#             #     "clipId": 3,
#             #     "clipTitle": "영상3",
#             #     "clipVolume": 100
#             # },
#         ]
#     }
#
#     producer.send(KAFKA_LETTER_REQUEST_TOPIC, value=value)

