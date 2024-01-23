import localAxios from '../util/http-commons';

const local = localAxios();

/**  GET 프레임 템플릿 리스트 조회 */
export async function getTemplate() {
    return await local.get(`/api/template/frame`);
}
/**  GET 폰트 리스트 조회 */
export async function getFont() {
    return await local.get(`/api/template/font`);
}
/**  GET BGM 리스트 조회 */
export async function getBgm() {
    return await local.get(`/api/template/bgm`);
}
/**  GET 스크립트 리스트 조회 */
export async function getScript() {
    return await local.get(`/api/template/script`);
}
