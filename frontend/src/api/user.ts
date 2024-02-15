import {
    NewPassword,
    PasswordChange,
    RegistUser,
    UserModify,
} from '../types/type';
import localAxios from '../util/http-commons';
import axios from "axios";

const local = localAxios();

/**  POST 회원가입 */
export async function registUser(user: RegistUser) {
    return await axios.post(`/api/user`, user, {});
}
/**  GET 유저 정보 조회 */
export async function getUser() {
    return await local.get(`/api/user`);
}

/** POST 비밀번호 초기화 후 비밀번호 재설정 */
export async function settingNewPassword(password: NewPassword) {
    return await axios.post(`/api/user/password`, password, {});
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
