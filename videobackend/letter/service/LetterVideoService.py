from botocore.client import BaseClient

from letter.dto.dto import MakeLetterDto
from letter.utils.s3_utils import clip_download_and_load, letter_upload
from letter.utils.video_edit_utils import *


def create_letter(make_letter_dto: MakeLetterDto, bucket: str,
    client: BaseClient) -> None:
    try:
        studio_id = make_letter_dto.studio_id
        clip_list = make_letter_dto.clip_info_list
        # 1. 클립 다운로드
        raw_clip = map(
            lambda x: clip_download_and_load(x, studio_id, bucket, client),
            clip_list)

        # 2. 각 클립의 화면 반전
        mirrored_clip = map(lambda x: mirror_clip(x), raw_clip)
        del raw_clip

        # 3. 각 클립의 볼륨 조절
        volume_tuned_clip = map(lambda x: tune_volume(x[1], x[0].clip_volume),
                                enumerate(mirrored_clip))
        del mirrored_clip

        # 4. 각 클립 연결
        concatenated_letter = concat_clip(List(volume_tuned_clip))
        del volume_tuned_clip

        # 5. 연결된 영상에 프레임 인코딩
        frame_added_letter = encode_frame(concatenated_letter,
                                          make_letter_dto.studio_frame_id)
        del concatenated_letter

        # 6. 전체 영상 볼륨 조절
        volume_tuned_letter = tune_volume(frame_added_letter,
                                          make_letter_dto.studio_volume)
        del frame_added_letter

        # 7. letter 완성 후 저장
        directory = "./complete"
        key = make_letter_dto.studio_id + ".mp4"
        if not os.path.exists(directory):
            os.makedirs(directory)

        volume_tuned_letter.write_videofile(directory + key, codec="mpeg4")

        # 8. s3 업로드
        letter_upload(directory, key, bucket, client)

        # 9. 완료시 spring server api 호출
        # 성공시 api 통신
        print("create_letter: success")
    except Exception as e:
        print("create_letter: fail")
        # 실패시 api 통신
