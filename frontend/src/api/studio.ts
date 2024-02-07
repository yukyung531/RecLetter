import { Letter, StudioMake } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/** GET 스튜디오 리스트 조회 */
export async function getStudio(token: string) {
    return await local.get(`/api/studio`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
/** GET 스튜디오 상세 정보 조회 */
export async function studioDetail(studioId: string) {
    return await local.get(`/api/studio/${studioId}`);
}
/** GET 스튜디오 썸네일 조회 */
export async function getStudioThumbnail(studioId: string) {
    return await local.get(`/api/studio/${studioId}/thumbnail`);
}
/** POST 스튜디오 생성 */
export async function makeStudio(studio: StudioMake) {
    return await local.post(`/api/studio`, studio, {});
}
/** DELETE 스튜디오 삭제 */
export async function deleteStudio(studioId: string) {
    return await local.delete(`/api/studio/${studioId}`);
}
/** POST 스튜디오 참가 */
export async function enterStudio(studioId: string) {
    return await local.post(`/api/studio/${studioId}`);
}
/** GET 스튜디오에 접속중인 사용자 정보 조회 */
export async function getCurrentStudioUser(studioId: string) {
    return await local.get(`/api/studio/${studioId}/active`);
}
/** PUT 스튜디오 제목 수정 */
export async function modifyStudioTitle(studioId: string, studioTitle: string) {
    return await local.put(`/api/studio/${studioId}/title`, studioTitle, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}

/** PUT 스튜디오 편집 정보 수정 */
export async function modifyStudioInfo(studioInfo: object) {
    return await local.put(`/api/studio`, studioInfo, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
