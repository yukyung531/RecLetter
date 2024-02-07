import os

from pydantic import BaseModel


class ClipInfo(BaseModel):
    clip_id: str
    clip_title: str
    clip_volume: int

    def get_directory(self, studio_id: str) -> str:
        return os.environ.get(
            "DOWNLOAD_PATH") + "/" + studio_id + "/" + self.clip_id

    def get_clip_key(self, studio_id: str) -> str:
        return studio_id + "/" + self.clip_id + "/" + self.clip_title + ".mp4"
