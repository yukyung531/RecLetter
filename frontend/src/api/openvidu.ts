import localAxios from '../util/http-commons';

const local = localAxios();

/** createSession(studioId : string)
 *  studioId를 이용해 세션을 생성합니다.
 * @param studioId
 * @returns
 */
export async function createSession(studioId: string) {
    return await local.post(
        `/api/meeting/${studioId}`,
        { customSessionId: studioId },
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

/** connectSession(sessionId : string)
 *  sessionId를 이용해 해당 세션에 연결한다.
 * @param sessionId
 * @returns
 */
export async function connectSession(sessionId: string) {
    return await local.post(`/api/meeting/${sessionId}/connections`);
}

/** endSession(studioId : string)
 *  studioId를 이용해 해당 세션을 종료합니다.
 * @param studioId
 * @returns
 */
export async function endSession(studioId: string) {
    return await local.delete(`/api/meeting/${studioId}`);
}
