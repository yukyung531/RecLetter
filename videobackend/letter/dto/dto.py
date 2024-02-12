import os


class ClipInfo:
    clip_id: int
    clip_title: str
    clip_volume: int

    def __init__(self, value: dict):
        self.clip_id = value['clipId']
        self.clip_title = value['clipTitle']
        self.clip_volume = value['clipVolume']

    def get_clip_key(self, studio_id: str):
        return studio_id + "/" + str(self.clip_id) + "/" + self.clip_title + ".mp4"

    def get_clip_directory_path(self, studio_id: str):
        return os.environ.get("DOWNLOAD_PATH","./download") + "/" + studio_id + "/" + str(self.clip_id)

    def get_clip_file_path(self, studio_id: str):
        return self.get_clip_directory_path(studio_id) + "/" + self.clip_title + ".mp4"
