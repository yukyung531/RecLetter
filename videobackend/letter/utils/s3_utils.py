import os.path

from botocore.client import BaseClient

from videobackend.letter.dto.Dto import ClipInfo


def clip_download(clip_info: ClipInfo, studio_id: str, bucket: str,
    client: BaseClient) -> None:
    directory = clip_info.get_directory(studio_id)
    key = clip_info.get_clip_key(studio_id)
    file_path = directory + "/" + key

    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print("Error: Failed to create the directory.")

    try:
        client.download_file(bucket, key, file_path)
    except Exception as e:
        print(e)


def letter_upload(file_name: str, key: str, bucket: str,
    client: BaseClient) -> None:
    client.upload_file(file_name, bucket, key)
