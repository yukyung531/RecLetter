import { ClipModify, ClipUpload } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/** POST 촬영한 클립 업로드 */
export async function uploadClip(clipUpload: ClipUpload) {
    return await local.post(`/api/clip`, clipUpload, {});
}
/** GET 클립 상세 정보 조회 */
export async function getClip(clipId: string) {
    return await local.get(`/api/clip`, { params: clipId });
}
/** PUT 클립 수정 */
export async function modifyClip(clipId: string, clip: ClipModify) {
    return await local.put(`/api/clip/${clipId}`, clip);
}
/** GET 클립 썸네일 조회 */
export async function getClipThumb(clipId: string) {
    return await local.get(`/api/clip/${clipId}/thumbnail`);
}
