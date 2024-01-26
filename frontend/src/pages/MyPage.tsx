import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginState } from '../util/counter-slice';
import { getUser } from '../api/user';

export default function MyPage() {
    const [userNickname, setUserNickname] = useState<string>('');
    let userId = '';
    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        if (loginValue === 'true') {
            dispatch(loginState(true));
            console.log(isLogin);
            getUserInfo();
        }
        if (loginValue === 'false' || !loginValue) {
            navigate(`/`);
        }
    }, [isLogin]);

    /** GET 유저 정보 */
    const getUserInfo = async () => {
        await getUser().then((res) => {
            setUserNickname(res.data.userNickname);
        });
    };
    /** 닉네임 변환 감지 */
    const changeNickname = (e: BaseSyntheticEvent) => {
        setUserNickname(e.target.value);
    };
    return (
        <section className="section-center">
            <p className="text-3xl font-bold mx-4 my-2">마이페이지</p>
            <p className="mx-4 mb-4">내 개인 정보를 수정 가능합니다.</p>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">아이디</p>
                <p className="input-88 h-12 bg-gray-200 border border-gray-300">
                    {userId}
                </p>
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">이름</p>
                <input
                    className="input-88"
                    type="text"
                    onChange={(e) => {
                        changeNickname(e);
                    }}
                />
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">이메일</p>
                <input
                    className="w-60 py-2 px-3 border-2 rounded text-xl"
                    type="text"
                />
                <p className="w-24 ml-4 py-2 rounded-md text-center text-xl text-white color-bg-blue1">
                    이메일 변경
                </p>
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">인증코드</p>
                <input
                    className="w-60 py-2 px-3 border-2 rounded text-xl"
                    type="text"
                    placeholder="인증번호 입력"
                />
                <p className="w-24 ml-4 py-2 rounded-md text-center text-xl text-white color-bg-blue1">
                    인증하기
                </p>
            </div>
            <a
                href="/studiolist"
                className="w-88 py-3 px-3 my-2 rounded text-xl color-bg-blue1 text-white text-center"
            >
                변경사항 저장
            </a>
            <a
                href="/findpw"
                className="w-88 py-3 px-3 my-2 rounded text-xl color-bg-yellow2 text-center"
            >
                비밀번호 변경
            </a>
            <a
                href="/login"
                className="w-88 py-3 px-3 my-2 rounded text-xl color-bg-red2 text-white text-center"
            >
                회원 탈퇴
            </a>
        </section>
    );
}
