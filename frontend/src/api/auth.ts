import { EmailRequest, PasswordReset, User, tokenType } from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/** POST 로그인 */
export async function login(user: User) {
    return await local.post(`/api/auth/login`, user, {});
}
/** POST 이메일 인증코드 요청 */
export async function requestEmail(userEmail: string) {
    return await local.post(`/api/auth/email`, userEmail, {});
}

/** POST 이메일 인증코드 검증 */
export async function verifyEmail(email: EmailRequest) {
    return await local.post(`/api/auth/email/code`, email, {});
}
/** GET 아이디 중복 검사 */
export async function checkId(userid: string) {
    return await local.get(`/api/auth/id`, { params: userid });
}

/** POST 비밀번호 초기화 요청 */
export async function resetPassword(password: PasswordReset) {
    return await local.post(`/api/auth/password`, password, {});
}

/** GET 비밀번호 초기화 */
export async function resetPasswordReq(key: string) {
    return await local.get(`/api/auth/password`, { params: key });
}

/** GET 로그아웃 */
export async function logout() {
    return await local.get(`/api/auth/logout`);
}
/** GET 사용자 토큰 검증 */
export async function validToken() {
    return await local.get(`/api/auth`);
}

/** POST 사용자 토큰 재발급 */
export async function token(token: tokenType) {
    return await local.post(`/api/auth/token`, token, {});
}