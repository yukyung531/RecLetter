import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/3_components/Header.css';
import { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loginState } from '../util/counter-slice';
import { deleteStorageData } from '../util/initialLocalStorage';

export default function Header() {
    /** 리덕스 함수 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        if (loginValue) {
            dispatch(loginState(true));
        } else {
            dispatch(loginState(false));
        }
    }, [isLogin]);
    /** 로그아웃 */
    const onLogout = () => {
        logoutAPI();
        //이거 한 후, main page로 이동하도록 만들어야 함.
    };
    /** 로그아웃 API */
    const logoutAPI = async () => {
        await logout()
            .then(() => {
                deleteStorageData();
                alert('로그아웃이 되었습니다.');
                dispatch(loginState(false));
                navigator('/');
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };
    /** 로그인 상태변화 Element */
    const loginStateElement = () => {
        if (isLogin) {
            return (
                <div className="flex justify-center items-center color-text-ivory">
                    <Link
                        to="/mypage"
                        className="flex mx-2 text-xl justify-center items-center"
                    >
                        <div className="flex justify-center items-center rounded-full w-6 h-6 mx-2">
                            <span className="material-symbols-outlined text-2xl">
                                account_circle
                            </span>
                        </div>
                        <p>마이페이지</p>
                    </Link>
                    <div
                        className="flex mx-2 text-xl justify-center items-center cursor-pointer color-text-ivory"
                        onClick={onLogout}
                    >
                        <div
                            className="flex justify-center items-center bg-white rounded-full mx-2"
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        >
                            <span
                                className="material-symbols-outlined color-text-main text-base"
                                style={{ padding: '1px 0 0 1px' }}
                            >
                                logout
                            </span>
                        </div>
                        <p>로그아웃</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex justify-center items-center">
                    <div className="flex mx-2 text-xl justify-center items-center cursor-pointer color-text-ivory">
                        <div className="flex justify-center items-center bg-white rounded-full w-6 h-6 mx-2">
                            <span
                                className="material-symbols-outlined color-text-main text-lg"
                                style={{ padding: '1px 2px 0 0' }}
                            >
                                login
                            </span>
                        </div>
                        <Link to="login">로그인</Link>
                    </div>
                </div>
            );
        }
    };

    /** 메인으로 갈 때 나오는 Link 변화 */
    const moveMainElement = () => {
        const loginValue = localStorage.getItem('is-login');
        if (loginValue === 'true' && isLogin) {
            return (
                <Link to="/studiolist">
                    <img
                        className="h-6"
                        src="/src/assets/images/logo.png"
                        alt=""
                    />
                </Link>
            );
        } else {
            return (
                <Link to="/">
                    <img
                        className="h-6"
                        src="/src/assets/images/logo.png"
                        alt=""
                    />
                </Link>
            );
        }
    };

    return (
        <div className="header w-full flex h-header items-center justify-between px-8 z-10 color-bg-main">
            <div className=" w-72 text cursor-pointer">{moveMainElement()}</div>
            {loginStateElement()}
        </div>
    );
}
