from typing import Optional
from pydantic import BaseModel
from typing import List
from pydantic.alias_generators import to_camel


class ClipInfo(BaseModel):
    clip_id: str
    clip_title: str
    clip_owner: str
    clip_order: int
    clip_volume: int
    clip_content: str

    def get_directory(self, studio_id: str) -> str:
        return "./" + studio_id + "/" + self.clip_id

    def get_clip_key(self, studio_id: str) -> str:
        return studio_id + "/" + self.clip_id + "/" + self.clip_title + ".mp4"


class MakeLetterDto(BaseModel):
    studio_id: str
    studio_frame_id: int
    studio_bgm: int
    studio_volume: int
    studio_font: int
    clip_info_list: List[ClipInfo]

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True
