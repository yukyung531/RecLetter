from moviepy.audio.fx.volumex import volumex
from moviepy.editor import *
from typing import List
from letter.dto.dto import ClipInfo


# 동영상 로드
# video_clip2 = VideoFileClip("6cb849f7-43ac-467e-a1b9-28a3e0620c71/1/김태운 1.mp4")
# video_clip2 = VideoFileClip(
#     "64aae064-443d-4d9a-9847-d92b9a49b0e1/1/만약 이게 간다면 뚜.mp4")
#
# # 이미지 로드
# image_clip = ImageClip("overlay_image.png")

# # 동영상의 크기에 맞게 이미지 크기 조정
# image_clip_resized = resize(image_clip, width=video_clip.size[0])

# # 이미지를 중앙에 위치시키기
# x_position = (video_clip.size[0] - image_clip_resized.size[0]) // 2
# y_position = (video_clip.size[1] - image_clip_resized.size[1]) // 2
# image_clip_positioned = image_clip_resized.set_position((x_position, y_position))

# # CompositeVideoClip을 사용하여 이미지를 동영상 위에 덮어 씌우기
# final_clip = CompositeVideoClip([video_clip, image_clip_positioned])
# final_clip = concatenate_videoclips([video_clip1, video_clip2])
# 결과 동영상 저장
# final_clip.write_videofile("output_video.mp4")


def concat_clip(clip_list: List[VideoClip]) -> VideoClip:
    fadein_clip_list = list(map(lambda x: x.crossfadein(1), clip_list))

    return concatenate_videoclips(fadein_clip_list, method="compose")


def mirror_clip(clip: VideoClip) -> VideoClip:
    return clip.fx(vfx.mirror_y)

def encode_frame(clip: VideoClip, frame_id: int) -> VideoClip:
    file_route = "./assets/frames/frame" + str(frame_id) + ".png"

    if os.path.exists(file_route):
        frame = ImageClip(file_route, duration=clip.duration)
        return CompositeVideoClip([clip, frame])
    else:
        print("encode_frame: frame not found")
        return clip


def tune_volume(clip: VideoClip, volume_ratio: int) -> VideoClip:
    return clip.afx(volumex, volume_ratio / 100)


# def make_text_img(text: str, studio_font: dict, duration) -> TextClip:
#         text_clip = TextClip(txt=text, fontsize=studio_font.get("fontSize"), color="black")
#         text_clip = text_clip.set_duration(duration)
#         text_clip = text_clip.set_position("center")
#         return text_clip
def make_bgm_loop():
    pass


def insert_bgm():
    pass


def change_size():
    pass

    # studioId
    # clipInfoList: [
    #     {
    #         clipId,
    #         clipTitle,
    #         clipVolume
    #     }
    # ]
    # studioFrameId
    # studioFont: {
    #     fontFamily
    # fontSize
    # isBold
    # fontUrl
    # }
    # studioBgmId
    # studioVolume
