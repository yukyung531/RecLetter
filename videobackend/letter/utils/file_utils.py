import os.path
from typing import List

from botocore.client import BaseClient
from moviepy.video.io.VideoFileClip import VideoFileClip

from videobackend.letter.dto.req import MakeLetterReq


def asset_download(make_letter_req: MakeLetterReq, bucket: str,
    client: BaseClient) -> None:
    assets_directory = make_letter_req.get_assets_directory()

    # assets directory 체크 & 생성
    print("asset directory 생성")
    if not os.path.exists(assets_directory):
        os.makedirs(assets_directory)

    # sticker 다운로드
    print("sticker 다운로드")
    client.download_file(
        bucket,
        make_letter_req.studio_sticker,
        make_letter_req.get_sticker_file_path()
    )

    # clip 다운로드
    studio_id = make_letter_req.studio_id

    print("clip 다운로드")
    for clip_info in make_letter_req.clip_info_list:
        clip_directory = clip_info.get_clip_directory_path(studio_id)
        if not os.path.exists(clip_directory):
            os.makedirs(clip_info.get_clip_directory_path(studio_id))

        client.download_file(bucket, clip_info.get_clip_key(studio_id), clip_info.get_clip_file_path(studio_id))

    # BGM 다운로드


def letter_upload(file_name: str, key: str, bucket: str,
    client: BaseClient) -> None:
    client.upload_file(file_name, bucket, key)


def close_clip(clip_list: List[VideoFileClip]) -> None:
    for clip in clip_list:
        clip.close()