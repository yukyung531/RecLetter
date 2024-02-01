import os.path

from botocore.client import BaseClient
from moviepy.video.io.VideoFileClip import VideoFileClip

from letter.dto.dto import ClipInfo


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

    client.download_file(bucket, key, file_name)
    return VideoFileClip(directory)


def letter_upload(file_name: str, key: str, bucket: str,
    client: BaseClient) -> None:
    client.upload_file(file_name, bucket, key)
