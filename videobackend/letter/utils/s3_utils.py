import os.path

from botocore.client import BaseClient
from moviepy.video.io.VideoFileClip import VideoFileClip

from videobackend.letter.dto.ClipInfo import ClipInfo


def clip_download_and_load(clip_info: ClipInfo, studio_id: str, bucket: str,
    client: BaseClient) -> VideoFileClip:
    directory = clip_info.get_directory(studio_id)
    key = clip_info.get_clip_key(studio_id)
    file_name = "./" + key

    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print("Error: Failed to create the directory.")

    print("다운로드 시작")
    try:
        client.download_file(bucket, key, file_name)
    except Exception as e:
        print(e)
    print("다운로드 완료")
    return VideoFileClip(file_name)


def letter_upload(file_name: str, key: str, bucket: str,
    client: BaseClient) -> None:
    client.upload_file(file_name, bucket, key)
