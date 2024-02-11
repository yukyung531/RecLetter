import os.path

from botocore.client import BaseClient

from videobackend.letter.dto.req import MakeLetterReq


def asset_download(make_letter_req: MakeLetterReq, bucket: str,
    client: BaseClient) -> None:
    assets_directory = make_letter_req.get_assets_directory()

    # assets directory 체크 & 생성
    try:
        if not os.path.exists(assets_directory):
            os.makedirs(assets_directory)
    except OSError:
        print("Error: Failed to create the directory.")

    # sticker 다운로드
    try:
        client.download_file(bucket, make_letter_req.get_frame_key(),
                             make_letter_req.get_frame_file_path())
    except Exception as e:
        print(e)

    # clip 다운로드
    studio_id = make_letter_req.studio_id

    for clip_info in make_letter_req.clip_info_list:
        try:
            client.download_file(bucket, clip_info.get_clip_key(studio_id), clip_info.get_clip_file_path(studio_id))
        except Exception as e:
            print(e)

    # BGM 다운로드


def letter_upload(file_name: str, key: str, bucket: str,
    client: BaseClient) -> None:
    client.upload_file(file_name, bucket, key)
