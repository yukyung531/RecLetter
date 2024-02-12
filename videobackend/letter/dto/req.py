import os
from typing import List

from pydantic import BaseModel
from pydantic.alias_generators import to_camel

from videobackend.letter.dto.dto import ClipInfo


class MakeLetterReq:
    studio_id: str
    studio_frame_id: int
    studio_sticker: str
    studio_bgm_id: int
    studio_bgm_volume: int
    clip_info_list: List[ClipInfo]

    def __init__(self, value: dict):
        self.studio_id = value['studioId']
        self.studio_frame_id = value['studioFrameId']
        self.studio_sticker = value['studioSticker']
        self.studio_bgm_id = value['studioBgmId']
        self.studio_bgm_volume = value['studioBgmVolume']
        self.clip_info_list = list(
            map(lambda x: ClipInfo(x), value['clipInfoList']))

    def get_assets_directory(self):
        return os.environ.get("DOWNLOAD_PATH", "./download") + "/" + self.studio_id

    def get_sticker_file_path(self):
        return os.environ.get("DOWNLOAD_PATH", "./download") + "/" + self.studio_sticker

    class Config:
        alias_generator = to_camel
        populate_by_name = True
