import os
from typing import List

from pydantic import BaseModel
from pydantic.alias_generators import to_camel

from videobackend.letter.dto.dto import ClipInfo


class MakeLetterReq(BaseModel):
    studio_id: str
    studio_frame_id: int
    studio_bgm_id: int
    studio_volume: int
    clip_info_list: List[ClipInfo]

    def __init__(self, avro_dict: dict):
        self.studio_id = avro_dict['studio_id']
        self.studio_frame_id = avro_dict['studio_frame_id']
        self.studio_bgm_id = avro_dict['studio_bgm_id']
        self.studio_volume = avro_dict['studio_volume']
        self.clip_info_list = list(
            map(lambda x: ClipInfo(x), avro_dict['clip_info_list']))

    def get_assets_directory(self):
        return os.environ.get("DOWNLOAD_PATH",
                              "./download") + "/" + self.studio_id

    def get_sticker_key(self):
        return self.studio_id + ".png"

    def get_sticker_file_path(self):
        return self.get_assets_directory() + self.get_sticker_key()

    class Config:
        alias_generator = to_camel
        populate_by_name = True
