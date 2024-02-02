import os
import boto3
from fastapi import APIRouter, BackgroundTasks

from letter.dto.dto import MakeLetterDto
from letter.service.LetterVideoService import create_letter

# 환경변수
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET')
REGION = os.environ.get('AWS_REGION')
BUCKET = os.environ.get('AWS_BUCKET')
SPRING_SERVER_URL = os.environ.get('SPRING_SERVER_URL')

# S3 클라이언트 설정
s3_client = boto3.client('s3', region_name=REGION,
                         aws_access_key_id=AWS_ACCESS_KEY,
                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

# router
letter_video_router = APIRouter()


@letter_video_router.post("/letter")
def make_letter(make_letter_dto: MakeLetterDto) -> None:
    # BackgroundTasks.add_task(create_letter, make_letter_dto, BUCKET, s3_client)
    create_letter(make_letter_dto, BUCKET, s3_client)
