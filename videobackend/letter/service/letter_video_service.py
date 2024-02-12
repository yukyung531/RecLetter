# import os
# from botocore.client import BaseClient
#
# from videobackend.letter.dto.req import MakeLetterReq
# from videobackend.letter.utils.file_utils import clip_download
# from videobackend.letter.utils.video_edit_utils import resize_clip, mirror_clip, tune_volume, \
#     concat_clip, encode_frame
#
#
# def create_letter(make_letter_dto: MakeLetterReq, bucket: str,
#     client: BaseClient) -> None:
#
#     try:
#         studio_id = make_letter_dto.studio_id
#         clip_list = make_letter_dto.clip_info_list
#         # 1. 클립 다운로드
#         print("클립 다운로드")
#         raw_clip = list(map(
#             lambda x: clip_download(x, studio_id, bucket, client),
#             clip_list))
#
#         # 2. 클립 사이즈 변경
#         print("클립 사이즈 변경")
#         resized_clip = list(map(lambda x: resize_clip(x), raw_clip))
#         del raw_clip
#
#         # 2. 각 클립의 화면 반전
#         print("클립 화면 반전")
#         mirrored_clip = list(map(lambda x: mirror_clip(x), resized_clip))
#         del resized_clip
#
#         # 3. 각 클립의 볼륨 조절
#         print("볼륨 조절")
#         volume_tuned_clip = list(map(lambda x: tune_volume(x[1], clip_list[x[0]].clip_volume),
#                                 enumerate(mirrored_clip)))
#         del mirrored_clip
#
#         # 4. 각 클립 연결
#         print("클립 연결")
#         concatenated_letter = concat_clip(volume_tuned_clip)
#         del volume_tuned_clip
#
#         # 5. 연결된 영상에 프레임 인코딩
#         print("프레임 인코딩")
#         frame_added_letter = encode_frame(concatenated_letter,
#                                           make_letter_dto.studio_frame_id)
#         del concatenated_letter
#
#         # 6. 전체 영상 볼륨 조절
#         print("볼륨조절")
#         volume_tuned_letter = tune_volume(frame_added_letter,
#                                           make_letter_dto.studio_volume)
#         del frame_added_letter
#
#         # 7. letter 완성 후 저장
#         print("완성 후 저장")
#         directory = "./complete"
#         key = make_letter_dto.studio_id + ".mp4"
#         complete_file_name = directory + "/" + key
#         print(key)
#         if not os.path.exists(directory):
#             os.makedirs(directory)
#
#         volume_tuned_letter.write_videofile(complete_file_name, fps=30, codec='libx264')
#         volume_tuned_letter.close()
#
#         # 8. s3 업로드
#         print("업로드")
#         letter_upload(complete_file_name, key, bucket, client)
#
#         # 9. 완료시 spring server api 호출
#         # 성공시 api 통신
#         print("create_letter: success")
#     except Exception as e:
#         print("create_letter: fail")
#         print(e)
#         # 실패시 api 통신
