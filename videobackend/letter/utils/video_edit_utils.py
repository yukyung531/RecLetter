from moviepy.audio.fx.volumex import volumex
from moviepy.editor import *
from typing import List

from videobackend.letter.dto.dto import ClipInfo


def load_clip(clip_info: ClipInfo, studio_id: str) -> VideoFileClip:
    result = VideoFileClip(filename=clip_info.get_clip_file_path(studio_id))
    if result.h != 720:
        return result.fx(vfx.resize, height=720).on_color((1280, 720), color=(0, 0, 0))
    else:
        return result


def concat_clip(clip_list: List[VideoClip]) -> VideoClip:
    fadein_clip_list = list(map(lambda x: x.crossfadeout(0.5).crossfadein(0.5), clip_list))

    return concatenate_videoclips(fadein_clip_list, method="compose")


def mirror_clip(clip: VideoClip) -> VideoClip:
    return clip.fx(vfx.mirror_x)


def encode_frame(clip: VideoClip, frame_id: int, sticker_file_path: str) -> VideoClip:
    frame_file_path = "./assets/frames/frame" + str(frame_id) + ".png"

    frame = ImageClip(frame_file_path, duration=clip.duration).crossfadeout(0.5).crossfadein(0.5)
    sticker = ImageClip(sticker_file_path, duration=clip.duration).crossfadeout(0.5).crossfadein(0.5)

    return CompositeVideoClip([clip, frame, sticker])


def tune_volume(clip: VideoClip, volume_ratio: int) -> VideoClip:
    return clip.afx(volumex, volume_ratio / 100)


def insert_bgm(clip: VideoClip, volume_id: int, volume_ratio: int) -> VideoClip:
    if volume_id == 1:
        return clip

    volume_id -= 1
    bgm_file_path = "./assets/bgm/bgm" + str(volume_id) + ".mp3"
    bgm = AudioFileClip(bgm_file_path)
    bgm = afx.audio_loop(bgm, duration=clip.duration)
    bgm = volumex(bgm, volume_ratio / 100)
    original_sound = clip.audio
    composite_audio_clip = CompositeAudioClip([original_sound, bgm])

    return clip.set_audio(composite_audio_clip)
