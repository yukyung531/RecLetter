import { useEffect } from 'react';
import '../assets/scss/3_components/Header.css';

export default function Header() {
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
                    <a className="flex mx-2 text-xl justify-center items-center cursor-pointer">
                        <span className="material-symbols-outlined mx-1">
                            logout
                        </span>
                        <p>로그아웃</p>
                    </a>
                </div>
            </div>
        );
}
