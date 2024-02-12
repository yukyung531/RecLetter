from moviepy.audio.fx.volumex import volumex
from moviepy.editor import *
from typing import List

from videobackend.letter.dto.dto import ClipInfo


def load_clip(clip_info: ClipInfo, studio_id: str) -> VideoFileClip:
    return VideoFileClip(filename=clip_info.get_clip_file_path(studio_id))


def concat_clip(clip_list: List[VideoClip]) -> VideoClip:
    fadein_clip_list = list(map(lambda x: x.crossfadein(1), clip_list))

    return concatenate_videoclips(fadein_clip_list, method="compose")


def mirror_clip(clip: VideoClip) -> VideoClip:
    return clip.fx(vfx.mirror_x)


def resize_clip(clip: VideoClip) -> VideoClip:
    return clip.fx(vfx.resize, (1280, 720))


def encode_frame(clip: VideoClip, frame_id: int, sticker_file_path: str) -> VideoClip:
    file_route = "./assets/frames/frame" + str(frame_id) + ".png"

    frame = ImageClip(file_route, duration=clip.duration)
    sticker = ImageClip("./assets/frames/1707758060518.png", duration=clip.duration)
    return CompositeVideoClip([clip, frame])

def encode_sticker(clip: VideoClip, sticker_file_path: str) -> VideoClip:
    if os.path.exists(sticker_file_path):
        frame = ImageClip(sticker_file_path, duration=clip.duration)
        return CompositeVideoClip([clip])
    else:
        print("encode_sticker: sticker not found")
        return clip


def tune_volume(clip: VideoClip, volume_ratio: int) -> VideoClip:
    return clip.afx(volumex, volume_ratio / 100)


def make_bgm_loop():
    pass


def insert_bgm():
    pass


def change_size():
    pass
