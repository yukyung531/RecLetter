import localAxios from '../util/http-commons';

const local = localAxios();

/** GET 화상 회의 참여하기 */
export async function enterMeeting(studioId: string) {
    return await local.get(`/api/meeting/${studioId}`);
}
/** POST 회상 회의 시작하기 */
export async function startMeeting(studioId: string) {
    return await local.post(`/api/meeting`, studioId);
}
