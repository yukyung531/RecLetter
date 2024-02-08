from pydantic import BaseModel
import os

from pydantic.alias_generators import to_camel


class ClipInfo(BaseModel):
    clip_id: str
    clip_title: str
    clip_volume: int

    def get_directory(self, studio_id: str) -> str:
        return os.environ.get("DOWNLOAD_PATH", default="./download") + "/" + studio_id + "/" + self.clip_id

    def get_clip_key(self, studio_id: str) -> str:
        return studio_id + "/" + self.clip_id + "/" + self.clip_title + ".mp4"

    class Config:
        alias_generator = to_camel
        populate_by_name = True