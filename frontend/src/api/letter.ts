import { ClipModify, ClipUpload, Letter } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/** PUT 영상 수정 */
export async function modifyLetter(letter: Letter) {
    return await local.put(`/api/letter`, { letter }, {});
}
/** GET 영상 수정 */
export async function encodingLetter(studioId: string) {
    return await local.get(`/api/letter/`, { params: studioId });
}
/**  영상 다운로드 */
// export async function downloadLetter(studioId: string) {
//     return await local.get(`/api/letter/`, { params: studioId });
// }
