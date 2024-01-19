import '../assets/css/3_components/Header.css';


export default function Header() {

    //로그아웃 함수
    const onLogout = () => {
        if(localStorage.getItem("userId")){
            localStorage.removeItem("userId");
        }
        if(localStorage.getItem("usernickname")){
            localStorage.removeItem("usernickname");
        }
        if(localStorage.getItem("accessToken")){
            localStorage.removeItem("accessToken");
        }
        if(localStorage.getItem("refreshToken")){
            localStorage.removeItem("refreshToken");
        }
        //이거 한 후, main page로 이동하도록 만들어야 함.
    }

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
                    <div className="flex mx-2 text-xl justify-center items-center cursor-pointer" onClick={onLogout}>
                        <span className="material-symbols-outlined mx-1">
                            logout
                        </span>
                        <p>로그아웃</p>
                    </div>
                </div>
            </div>
        );
}
