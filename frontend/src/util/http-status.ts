// HTTP Status Code
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const httpStatusCode = {
    // 응답
    OK: 200,
    CREATE: 201,
    NOCONTENT: 204,

    // 잘못된 요청
    BADREQUEST: 400,
    // 인증받지 못한 요청
    UNAUTHORIZED: 401,
    // 권한 없음
    FORBIDDEN: 403,
    // 없음
    NOTFOUND: 404,
    NOTPROCESS: 422,
    INTERNALSERVER: 500,
};
