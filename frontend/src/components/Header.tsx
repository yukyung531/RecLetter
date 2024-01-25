import { Link } from 'react-router-dom';
import '../assets/css/3_components/Header.css';
import { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loginState } from '../util/counter-slice';

export default function Header() {
    /** 리덕스 함수 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();

    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        if (loginValue) {
            dispatch(loginState(true));
        } else {
            dispatch(loginState(false));
        }
    }, []);
    /** 로그아웃 */
    const onLogout = () => {
        logoutAPI();
        //이거 한 후, main page로 이동하도록 만들어야 함.
    };
    /** 로그아웃 API */
    const logoutAPI = async () => {
        await logout()
            .then(() => {
                if (localStorage.getItem('access-token')) {
                    localStorage.removeItem('access-token');
                }
                if (localStorage.getItem('refresh-token')) {
                    localStorage.removeItem('refresh-token');
                }
                if (localStorage.getItem('is-login')) {
                    localStorage.removeItem('is-login');
                }
                alert('로그아웃이 되었습니다.');
                dispatch(loginState(false));
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };
    const loginStateElement = () => {
        if (isLogin) {
            return (
                <div
                    className="flex mx-2 text-xl justify-center items-center cursor-pointer"
                    onClick={onLogout}
                >
                    <span className="material-symbols-outlined mx-1">
                        logout
                    </span>
                    <p>로그아웃</p>
                </div>
            );
        } else {
            return (
                <div className="flex mx-2 text-xl justify-center items-center cursor-pointer">
                    <span className="material-symbols-outlined mx-1">
                        login
                    </span>
                    <a href="login">로그인</a>
                </div>
            );
        }
    };

    if (
        window.location.pathname === '/' ||
        window.location.pathname === '/cliprecode' ||
        window.location.pathname === '/clipedit' ||
        window.location.pathname === '/lettermake'
    )
        return null;
    else
        return (
            <div className="header w-full flex h-16 items-center justify-between px-8 z-10">
                <div className=" w-72 text cursor-pointer">
                    <a href="/" className="">
                        <img
                            className="h-6"
                            src="/src/assets/images/logo.png"
                            alt=""
                        />
                    </a>
                </div>
                <div className="flex justify-center items-center">
                    <a
                        href="/mypage"
                        className="flex mx-2 text-xl justify-center items-center"
                    >
                        <span className="material-symbols-outlined mx-1">
                            account_circle
                        </span>
                        <p>마이페이지</p>
                    </a>
                    {loginStateElement()}
                </div>
            </div>
        );
}
