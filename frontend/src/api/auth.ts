import axios from 'axios';
import {
    EmailRequest,
    EmailSend,
    PasswordCode,
    PasswordReset,
    User,
    tokenType,
} from '../types/type';
import localAxios from '../util/http-commons';

const local = localAxios();

/** POST 로그인 */
export async function login(user: User) {
    return await axios.post(`/api/auth/login`, user, {});
}

/** POST 이메일 인증코드 요청 */
export async function requestEmail(userEmail: EmailSend) {
    return await axios.post(`/api/auth/email`, userEmail, {});
}

/** POST 이메일 인증코드 검증 */
export async function verifyEmail(email: EmailRequest) {
    return await axios.post(`/api/auth/email/code`, email, {});
}

/** POST 비밀번호 초기화 이메일 발송 요청 */
export async function requestPasswordEmail(userEmail: PasswordReset) {
    return await axios.post(`/api/auth/password`, userEmail, {});
}

/** POST 비밀번호 초기화 인증코드 검증 */
export async function verifyPassword(password: PasswordCode) {
    return await axios.post(`/api/auth/password/code`, password, {});
}

/** GET 비밀번호 초기화 */
export async function resetPasswordReq(key: string) {
    return await local.get(`/api/auth/password/${key}`);
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
