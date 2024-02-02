import localAxios from '../util/http-commons';

const local = localAxios();

/** createSession(studioId : string)
 *  studioId를 이용해 세션을 생성합니다.
 * @param studioId
 * @returns
 */
export async function createSessionAPI(studioId: string) {
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
export async function connectSessionAPI(sessionId: string) {
    return await local.post(`/api/meeting/${sessionId}/connections`, {
        headers: { 'Content-Type': 'application/json' },
    });
}

/** endSession(studioId : string)
 *  studioId를 이용해 해당 세션을 종료합니다.
 * @param studioId
 * @returns
 */
export async function endSessionAPI(studioId: string) {
    return await local.delete(`/api/meeting/${studioId}`, {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function isSessionExistAPI(studioId: string) {
    return await local.get(`/api/meeting/${studioId}/exists`, {
        headers: { 'Content-Type': 'application/json' },
    });
}
