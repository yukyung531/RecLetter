import axios, { AxiosInstance } from 'axios';
import { httpStatusCode } from './http-status';
import { tokenType } from '../types/type';
import { token } from '../api/auth';
import { deleteStorageData } from './initialLocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { loginState } from './counter-slice';
import { useNavigate } from 'react-router-dom';

// VITE_REACT_API_URL 의 위치 : .env

const VITE_REACT_API_URL = import.meta.env.VITE_REACT_API_URL;
// api axios 환경
export default function localAxios() {
    let count = 0;
    const instance = axios.create({
        baseURL: VITE_REACT_API_URL,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            accept: 'application/json,',
        },
        withCredentials: true,
    });

    if (localStorage.getItem('access-token')) {
        instance.defaults.headers.common['Authorization'] =
            'Bearer ' + localStorage.getItem('access-token');
    }

    // Request 시 설정한 내용을 적용.
    instance.interceptors.request.use((config) => {
        if (config.url === '/api/auth/token') {
            config.headers.Authorization =
                'Bearer ' + localStorage.getItem('refresh-token');
        } else if (localStorage.getItem('access-token')) {
            config.headers.Authorization =
                'Bearer ' + localStorage.getItem('access-token');
        }
        return config;
    }),
        (error: Error) => {
            console.log('콘솔떠쪄');
            return Promise.reject(error);
        };

    // accessToken의 값이 유효하지 않은 경우,
    // refreshToken을 이용해 재발급 처리.
    // https://maruzzing.github.io/study/rnative/axios-interceptors%EB%A1%9C-%ED%86%A0%ED%81%B0-%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C-%ED%95%98%EA%B8%B0/

    let isTokenRefreshing = false;
    // Reponse 시 설정한 내용을 적용.

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error.response) {
                const {
                    config,
                    response: { status },
                } = error;
                // 페이지가 새로고침되어 저장된 accessToken이 없어진 경우.
                // 토큰 자체가 만료되어 더 이상 진행할 수 없는 경우.
                if (status === httpStatusCode.UNAUTHORIZED) {
                    // 요청 상태 저장
                    console.log('토큰이 없어 재생성합니다.');
                    const originalRequest = config;

                    // Token을 재발급하는 동안 다른 요청이 발생하는 경우 대기.
                    // 다른 요청을 진행하면, 새로 발급 받은 Token이 유효하지 않게 됨.
                    if (!isTokenRefreshing) {
                        isTokenRefreshing = true;
                        // 에러가 발생했던 컴포넌트의 axios로 이동하고자하는 경우
                        // 반드시 return을 붙여주어야한다.
                        const oldToken: tokenType = {
                            refreshToken: localStorage.getItem('refresh-token'),
                        };
                        if (oldToken.refreshToken === null) {
                            console.log(
                                'refreshToken이 없어 localhost 지우기 작동'
                            );
                            deleteStorageData();
                            window.location.href = '/login';
                            return;
                        }
                        instance.defaults.headers.common['Authorization'] =
                            oldToken.refreshToken;
                        return await token(oldToken)
                            .then((res) => {
                                // refresh token이 비어있으면 localhost 다 비우기

                                console.log('토큰생성!');
                                const newAccessToken = res.data.accessToken;
                                instance.defaults.headers.common[
                                    'Authorization'
                                ] = 'Bearer ' + newAccessToken;
                                originalRequest.headers.Authorization =
                                    'Bearer ' + newAccessToken;
                                localStorage.setItem(
                                    'access-token',
                                    newAccessToken
                                );
                                localStorage.setItem(
                                    'refresh-token',
                                    res.data.refreshToken
                                );
                                isTokenRefreshing = false;
                                // 에러가 발생했던 원래의 요청을 다시 진행.
                                count++;
                                if (count < 3) {
                                    return instance(originalRequest);
                                } else {
                                    alert(
                                        '이전 정보가 없어 로그인 페이지로 돌아갑니다.'
                                    );
                                    deleteStorageData();
                                    window.location.href = '/login';
                                }
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    }
                } else if (status === httpStatusCode.NOTPROCESS) {
                    deleteStorageData();
                    window.location.href = '/login';
                } else if (status == httpStatusCode.FORBIDDEN) {
                    alert('접근이 올바르지 않습니다.');
                    window.location.href = '/login';
                } else {
                    console.log('오류떠쎠');
                }
            } else {
                console.log('아마도 토큰 오류...');
                const { config } = error;
                const originalRequest = config;
                const oldToken: tokenType = {
                    refreshToken: localStorage.getItem('refresh-token'),
                };
                return await token(oldToken)
                    .then((res) => {
                        console.log('토큰생성!');
                        const newAccessToken = res.data.accessToken;
                        instance.defaults.headers.common['Authorization'] =
                            'Bearer ' + newAccessToken;
                        originalRequest.headers.Authorization =
                            'Bearer ' + newAccessToken;
                        localStorage.setItem('access-token', newAccessToken);
                        localStorage.setItem(
                            'refresh-token',
                            res.data.refreshToken
                        );
                        isTokenRefreshing = false;
                        // 에러가 발생했던 원래의 요청을 다시 진행.
                        return instance(originalRequest);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
            return Promise.reject(error);
        }
    );
    return instance;
}
