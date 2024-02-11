from pydantic import BaseModel
import os

from pydantic.alias_generators import to_camel


class ClipInfo(BaseModel):
    clip_id: str
    clip_title: str
    clip_volume: int

    def __init__(self, avro_dict: dict):
        self.clip_id = avro_dict['clip_id']
        self.clip_title = avro_dict['clip_title']
        self.clip_volume = avro_dict['clip_volume']

    def get_clip_key(self, studio_id: str) -> str:
        return studio_id + "/" + self.clip_id + "/" + self.clip_title + ".mp4"

    def get_clip_file_path(self, studio_id: str):
        return os.environ.get("DOWNLOAD_PATH",
                              default="./download") + "/" + studio_id + "/" + self.clip_id + self.clip_title + ".mp4"

    class Config:
        alias_generator = to_camel
        populate_by_name = True
