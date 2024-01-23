import { PasswordChange, RegistUser, UserModify } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/**  POST 회원가입 */
export async function registUser(user: RegistUser) {
    return await local.post(`/api/user`, user, {});
}
/**  GET 유저 정보 조회 */
export async function getUser() {
    return await local.get(`/api/user`);
}

/**  PUT 회원 정보 수정 */
export async function modifyUser(user: UserModify) {
    return await local.put(`/api/user`, user, {});
}
/**  PUT 비밀번호 수정 */
export async function modifyPass(user: PasswordChange) {
    return await local.put(`/api/user/password`, user, {});
}
/**  Delete 회원 탈퇴 */
export async function deleteUser() {
    return await local.delete(`/api/user`);
}
