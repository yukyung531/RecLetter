import axios from 'axios';
import { ClipModify, ClipUpload, Letter } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/** GET 영상 수정 */
export async function encodingLetter(studioId: string) {
    return await local.get(`/api/studio/${studioId}/letter`);
}
/**  영상 다운로드 */
export async function downloadLetter(studioId: string) {
    return await axios.get(`/api/studio/${studioId}/download`);
}
