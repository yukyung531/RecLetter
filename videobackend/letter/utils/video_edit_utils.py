from moviepy.audio.fx.volumex import volumex
from moviepy.editor import *
from typing import List

from videobackend.letter.dto.dto import ClipInfo


def load_clip(clip_info: ClipInfo, studio_id: str) -> VideoFileClip:
    return VideoFileClip(filename=clip_info.get_clip_file_path(studio_id))


def concat_clip(clip_list: List[VideoClip]) -> VideoClip:
    fadein_clip_list = list(map(lambda x: x.crossfadeout(0.5).crossfadein(0.5), clip_list))

    return concatenate_videoclips(fadein_clip_list, method="compose")


def mirror_clip(clip: VideoClip) -> VideoClip:
    return clip.fx(vfx.mirror_x)


def resize_clip(clip: VideoClip) -> VideoClip:
    return clip.fx(vfx.resize, (1280, 720))


def encode_frame(clip: VideoClip, frame_id: int, sticker_file_path: str) -> VideoClip:
    frame_file_path = "./assets/frames/frame" + str(frame_id) + ".png"

    frame = ImageClip(frame_file_path, duration=clip.duration)
    sticker = ImageClip(sticker_file_path, duration=clip.duration)

    return CompositeVideoClip([clip, frame, sticker])


def tune_volume(clip: VideoClip, volume_ratio: int) -> VideoClip:
    return clip.afx(volumex, volume_ratio / 100)


def insert_bgm(clip: VideoClip, volume_id: int, volume_ratio: int) -> VideoClip:
    bgm_file_path = "./assets/bgm/bgm" + str(volume_id) + ".mp3"
    bgm = AudioFileClip(bgm_file_path)
    bgm = afx.audio_loop(bgm, duration=clip.duration)
    bgm = volumex(bgm, volume_ratio / 100)
    original_sound = clip.audio
    composite_audio_clip = CompositeAudioClip([original_sound, bgm])

    return clip.set_audio(composite_audio_clip)
