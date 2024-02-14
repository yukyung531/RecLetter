import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    loginState,
    studioNameState,
    studioState,
} from '../util/counter-slice';
import { useEffect } from 'react';

export default function Mainpage() {
    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    useEffect(() => {
        dispatch(studioState([]));
        dispatch(studioNameState(''));
    }, []);

    useEffect(() => {
        if (isLogin) {
            navigator(`/studiolist`);
        }
    }, [isLogin]);
    /** 리덕스 설정 */

    return (
        <div className="relative h-screen color-bg-strawberry z-40 overflow-y-hidden overflow-x-hidden flex flex-col items-center justify-center">
            <div className="color-bg-black h-12 absolute top-0 w-full z-40 flex justify-around items-center text-white">
                <p className="text-2xl">RECLETTER</p>
                <p className="text-2xl">RECLETTER</p>
                <p className="text-2xl">RECLETTER</p>
            </div>
            <img
                className="h-screen absolute w-30per left-8 z-20 overflow-y-auto object-contain rotate-6"
                src="/src/assets/images/main-leftframe.png"
                alt=""
            />
            <div className="h-screen absolute w-10per color-bg-main left-36 z-10 overflow-y-auto object-contain rotate-3"></div>
            <img
                className="h-screen absolute w-40per -top-6 left-8 z-0 overflow-y-auto object-contain rotate-6"
                src="/src/assets/icons/mainpage/airplane.png"
                alt=""
            />
            <img
                className="animation-updown h-screen absolute w-2per -top-48 left-28 z-10 overflow-y-auto object-contain rotate-6"
                src="/src/assets/icons/mainpage/smile.png"
                alt=""
            />
            <img
                className="animation-shining h-screen absolute w-3per top-32 left-16 z-10 overflow-y-auto object-contain rotate-6"
                src="/src/assets/icons/mainpage/shining.png"
                alt=""
            />
            <img
                className="h-screen absolute -top-4 right-24 z-20 overflow-y-auto object-contain rotate-12"
                src="/src/assets/images/main-rightframe.png"
                alt=""
            />
            <img
                className="animation-clockRotate absolute w-7per top-30per right-16 z-20 overflow-y-auto object-contain rotate-12"
                src="/src/assets/icons/mainpage/comment-heart.png"
                alt=""
            />
            <img
                className="animation-shining h-screen absolute w-3per -top-48 right-72 z-10 overflow-y-auto object-contain rotate-6"
                src="/src/assets/icons/mainpage/shining.png"
                alt=""
            />
            <img
                className="animation-bold h-screen absolute w-1/4 -bottom-64 right-0 z-10 overflow-y-auto object-contain rotate-6"
                src="/src/assets/icons/mainpage/dot-pattern.png"
                alt=""
            />

            <section className="section-center pb-2">
                <div className="flex flex-col justify-center items-center">
                    <div className="relative">
                        <img
                            className="animation-shining-reverse absolute w-10per -left-6 -top-2 z-10 overflow-y-auto object-contain rotate-6"
                            src="/src/assets/icons/mainpage/highlight.png"
                            alt=""
                        />
                        <p className="text-3xl my-4">
                            영상으로 전하는 우리의 마음, 레크레터
                        </p>
                        <img
                            className="animation-shining-reverse absolute w-10per -right-6 -top-2 z-10 overflow-y-auto object-contain -rotate-6"
                            src="/src/assets/icons/mainpage/shining2.png"
                            alt=""
                        />
                    </div>
                    <img
                        className="w-147 h-24"
                        src="/src/assets/images/startlogo.png"
                        alt=""
                    />
                    <div className="relative">
                        <img
                            className="animation-shining absolute right-72 top-4 z-10 overflow-y-auto object-contain rotate-6 opacity-50"
                            src="/src/assets/icons/mainpage/arrow1.png"
                            alt=""
                        />
                        <img
                            className="animation-shining absolute left-80 top-16 z-10 overflow-y-auto object-contain opacity-50"
                            src="/src/assets/icons/mainpage/arrow2.png"
                            alt=""
                        />
                        <img
                            className="animation-shining absolute left-56 top-40 z-10 overflow-y-auto object-contain opacity-50"
                            src="/src/assets/icons/mainpage/arrow3.png"
                            alt=""
                        />
                        <Link
                            to="./login"
                            className=" w-72 color-bg-main cursor-pointer my-10 p-4 flex justify-center items-center border-8 color-border-sublight rounded-full btn-animation"
                        >
                            <img
                                className="w-8"
                                src="/src/assets/icons/mail.png"
                                alt=""
                            />
                            <p className="text-3xl mx-4 text-white">시작하기</p>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="color-bg-black h-12 absolute bottom-0 w-full z-40 flex justify-around items-center text-white">
                <p className="text-2xl">RECLETTER</p>
                <p className="text-2xl">RECLETTER</p>
                <p className="text-2xl">RECLETTER</p>
            </div>
        </div>
    );
}
