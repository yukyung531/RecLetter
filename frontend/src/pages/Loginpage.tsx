import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { login } from '../api/auth';
import { User } from '../types/type';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { httpStatusCode } from '../util/http-status';
import { useDispatch, useSelector } from 'react-redux';
import {
    googleLoginMain,
    loginState,
    studioNameState,
    studioState,
} from '../util/counter-slice';
import axios from 'axios';
import Image from '../assets/icons/google_icon.svg';
import ErrorModal from '../components/ErrorModal';

export default function LoginPage() {
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputPw, setInputPw] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let location: string = '';
    let position: string = '';
    // main에서 온 설정 가지고오기
    const { state } = useLocation(); // 2번 라인
    if (state) {
        location = state.location;
        position = state.position;
        dispatch(googleLoginMain(location));
    }

    /** 모달창 */
    const [isErrorModalActive, setIsErrorModalActive] =
        useState<boolean>(false);

    const logo = <img src={Image} alt="로고" width={250}></img>;

    const VITE_REACT_GOOGLE_LOGIN_URL = import.meta.env
        .VITE_REACT_GOOGLE_LOGIN_URL;

    useEffect(() => {
        dispatch(studioState([]));
        dispatch(studioNameState(''));
    }, []);

    useEffect(() => {
        if (isLogin) {
            // console.log(position);
            if (position === 'main') {
                // console.log('메인으로갑니다');
                dispatch(googleLoginMain(''));
                navigate(`/studiomain/${location}`);
            } else {
                // console.log('안ㅇ갑니다');
                navigate('/studiolist');
            }
        }
    }, [isLogin]);
    /** 리덕스 설정 */

    const changeEmail = (e: BaseSyntheticEvent) => {
        setInputEmail(e.target.value);
    };
    const changePw = (e: BaseSyntheticEvent) => {
        setInputPw(e.target.value);
    };

    const onClickLogin = async () => {
        //api로 로그인
        if (inputEmail === '' || inputPw === '') {
            setErrorMessage('정보를 정확히 입력해 주세요.');
            setIsErrorModalActive(true);
        } else {
            const user: User = {
                userEmail: inputEmail,
                userPassword: inputPw,
            };
            loadLoginAPI(user);
        }
    };
    const loginEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onClickLogin();
        }
    };
    const loadLoginAPI = async (user: User) => {
        await login(user)
            .then((res) => {
                // console.log('결과', res);
                if (res.status === httpStatusCode.OK) {
                    // console.log('로그인이 성공했습니다.');
                    localStorage.setItem('access-token', res.data.accessToken);
                    localStorage.setItem(
                        'refresh-token',
                        res.data.refreshToken
                    );
                    dispatch(loginState(true));
                    navigate(`/studiolist`);
                } else if (res.status === httpStatusCode.BADREQUEST) {
                    // console.log('bad request');
                } else if (res.status === httpStatusCode.UNAUTHORIZED) {
                    setErrorMessage('정보가 잘못되었습니다.');
                    setIsErrorModalActive(true);
                }
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === httpStatusCode.BADREQUEST) {
                        setErrorMessage(
                            '아이디 또는 비밀번호를 잘못 입력하였습니다.'
                        );
                        setIsErrorModalActive(true);
                    }
                }
            });
    };

    /** closeModal()
     *  모달창을 닫는다.
     */
    const closeModal = () => {
        setIsErrorModalActive(false);
    };

    return (
        <section className="section-center">
            {isErrorModalActive ? (
                <ErrorModal onClick={closeModal} message={errorMessage} />
            ) : (
                <></>
            )}
            <div className="w-1/3 flex flex-col justify-center items-center">
                <h5 className="mt-4 mb-8 text-4xl text-center p-4">Login</h5>
                <div className="flex flex-col justify-center items-center">
                    <input
                        className="w-105 py-2 px-6 my-2 border-2 color-border-gray rounded-md text-2xl color-text-darkgray"
                        type="text"
                        placeholder="이메일"
                        value={inputEmail}
                        onChange={(e) => {
                            changeEmail(e);
                        }}
                        onKeyDown={loginEnter}
                    />
                    <input
                        className="w-105 py-2 px-6 my-2 border-2 color-border-gray rounded-md text-2xl color-text-darkgray"
                        type="password"
                        placeholder="비밀번호"
                        value={inputPw}
                        onChange={(e) => {
                            changePw(e);
                        }}
                        onKeyDown={loginEnter}
                    />
                </div>

                <div
                    onClick={onClickLogin}
                    className=" w-105 block my-7 rounded-md py-2 text-2xl text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white btn-animation"
                >
                    로그인
                </div>

                <a
                    href={VITE_REACT_GOOGLE_LOGIN_URL}
                    className="py-4 btn-animation"
                >
                    {logo}
                </a>
                <div className="flex justify-center items-center my-2">
                    <Link
                        to="/findpw"
                        className="w-28 mx-4 my-2 text-2xl color-text-darkgray"
                    >
                        비밀번호 찾기
                    </Link>
                    <p className="mx-4 color-text-gray">|</p>
                    <a
                        className="w-28 mx-4 my-2 text-2xl color-text-main hover:color-text-subbold"
                        href="./regist"
                    >
                        회원가입
                    </a>
                </div>
            </div>
        </section>
    );
}
