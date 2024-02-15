import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/3_components/Header.css';
import { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loginState } from '../util/counter-slice';
import { deleteStorageData } from '../util/initialLocalStorage';
import SuccessModal from './SuccessModal';

export default function Header() {
    /** 리덕스 함수 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    /** 모달 상태 */
    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    //로그인과 동시에 모달 뜨는 오류 해결
    useEffect(() => {
        if (isLogin) {
            setIsModalActive(false);
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
                deleteStorageData();
                // dispatch(loginState(false));
                //모달 활성화
                setIsModalActive(true);
            })
            .catch((e: Error) => {
                deleteStorageData();
                dispatch(loginState(false));
                console.log(e);
                navigator('/');
            });
    };

    /**모달 클릭 */
    const clickModal = () => {
        setIsModalActive(false);
        dispatch(loginState(false));
        navigator('/');
    };

    /** 로그인 상태변화 Element */
    const loginStateElement = () => {
        if (isLogin) {
            return (
                <div className="flex justify-center items-center color-text-ivory">
                    {isModalActive ? (
                        <SuccessModal
                            onClick={clickModal}
                            message="로그아웃 되었습니다."
                        />
                    ) : (
                        <></>
                    )}
                    <Link
                        to="/mypage"
                        className="flex mx-2 text-xl justify-center items-center"
                    >
                        <div className="flex justify-center items-center rounded-full w-5 h-5 mx-2">
                            <img src="/src/assets/icons/mypage.png" alt="" />
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
                        <div
                            className="flex justify-center items-center bg-white rounded-full w-6 h-6 mx-2"
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        >
                            <span
                                className="material-symbols-outlined color-text-main text-base"
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
        if (isLogin) {
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
        <div className="header w-full flex h-header items-center justify-between px-8 z-30 color-bg-main">
            <div className=" w-72 text cursor-pointer">{moveMainElement()}</div>
            {loginStateElement()}
        </div>
    );
}
