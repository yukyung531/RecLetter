import localAxios from '../util/http-commons';

const local = localAxios();

/** GET 채팅방에 참여중인 사용자 조회 */
export async function enterChatting(studioId: string) {
    return await local.get(`/api/chat/${studioId}/userList`);
}
