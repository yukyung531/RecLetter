import {BaseSyntheticEvent, useEffect, useState} from 'react';
import {googleLogin, login} from '../api/auth';
import {User} from '../types/type';
import {Link, useNavigate} from 'react-router-dom';
import {httpStatusCode} from '../util/http-status';
import {useDispatch, useSelector} from 'react-redux';
import {loginState, studioState} from '../util/counter-slice';

export default function LoginPage() {
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputPw, setInputPw] = useState<string>('');

    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(studioState(''));
    }, []);

    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        if (loginValue === 'true') {
            dispatch(loginState(true));
        }
        if (isLogin && loginValue) {
            navigate(`/studiolist`);
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
            alert('정보를 정확히 입력해주세요.');
        } else {
            const user: User = {
                userEmail: inputEmail,
                userPassword: inputPw,
            };
            loadLoginAPI(user);
        }
    };
    const onClickGoogleLogin = async () => {
        //api로 로그인

        loadGoogleLoginAPI();

    };

    const loadGoogleLoginAPI = async () => {
        await googleLogin().then((res)=>{
            console.log(res);
        })
    }
    const loadLoginAPI = async (user: User) => {
        await login(user)
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    console.log('로그인이 성공했습니다.');
                    localStorage.setItem('access-token', res.data.accessToken);
                    localStorage.setItem(
                        'refresh-token',
                        res.data.refreshToken
                    );
                    localStorage.setItem('is-login', 'true');
                    dispatch(loginState(true));
                    navigate(`/studiolist`);
                } else if (res.status === httpStatusCode.BADREQUEST) {
                    console.log('bad request');
                }
            })
            .catch((error) => {
                console.log('오류', error);
            });
    };

    return (
        <section className="section-center">
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
                    />
                    <input
                        className="w-105 py-2 px-6 my-2 border-2 color-border-gray rounded-md text-2xl color-text-darkgray"
                        type="password"
                        placeholder="비밀번호"
                        value={inputPw}
                        onChange={(e) => {
                            changePw(e);
                        }}
                    />
                </div>

                <div
                    onClick={onClickLogin}
                    className=" w-105 block my-7 rounded-md py-2 text-2xl text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white"
                >
                    로그인
                </div>
                <p className="mb-7 text-2xl color-text-darkgray">
                    ---------------------------- 또는
                    ----------------------------
                </p>
                <a
                    href="/api/oauth2/authorization/google"
                    className="block w-80 text-black border-black text-2xl border text-center py-2 rounded-md"
                >
                    Google로 로그인하기
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
