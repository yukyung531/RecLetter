from typing import List

from pydantic import BaseModel
from pydantic.alias_generators import to_camel

from videobackend.letter.dto.Dto import ClipInfo


class MakeLetterReq(BaseModel):
    studio_id: str
    studio_frame_id: int
    studio_bgm_id: int
    studio_volume_id: int
    studio_font_id: int
    clip_info_list: List[ClipInfo]

    class Config:
        alias_generator = to_camel
        populate_by_name = True
