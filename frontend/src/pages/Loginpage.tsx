import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { login } from '../api/user';
import { LoginInfo, User } from '../types/type';
import loginData from '../dummy-datas/loginData.json';
import { useNavigate } from 'react-router-dom';
import { httpStatusCode } from '../util/http-status';

export default function LoginPage() {
    const [inputId, setInputId] = useState<string>('');
    const [inputPw, setInputPw] = useState<string>('');
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({
        userInfo: { userId: '', userName: '' },
        accessToken: '',
        refreshToken: '',
    });
    useEffect(() => {}, []);

    const navigate = useNavigate();

    const changeId = (e: BaseSyntheticEvent) => {
        setInputId(e.target.value);
    };
    const changePw = (e: BaseSyntheticEvent) => {
        setInputPw(e.target.value);
    };

    const onClickLogin = async () => {
        //api로 로그인
        if (inputId === '' || inputPw === '') {
            alert('정보를 정확히 입력해주세요.');
        } else {
            const user: User = {
                userId: inputId,
                userPassword: inputPw,
            };
            loginFunction(user);
        }
    };
    const loginFunction = async (user: User) => {
        await login(user)
            .then((res) => {
                console.log(res);
                if (res.status === httpStatusCode.OK) {
                    console.log('로그인이 성공했습니다.');
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
                <h5 className="m-4 text-3xl text-center p-4 font-bold">
                    Login
                </h5>
                <div className="flex flex-col justify-center items-center">
                    <input
                        className="w-88 py-2 px-3 bg-slate-100 my-2 border-2 rounded text-xl"
                        type="text"
                        placeholder="아이디"
                        value={inputId}
                        onChange={(e) => {
                            changeId(e);
                        }}
                    />
                    <input
                        className="w-88 py-2 px-3 bg-slate-100 my-2 border-2 rounded text-xl"
                        type="pasword"
                        placeholder="비밀번호"
                        value={inputPw}
                        onChange={(e) => {
                            changePw(e);
                        }}
                    />
                </div>

                <div
                    onClick={onClickLogin}
                    className=" w-88 block text-2xl color-bg-blue1 text-white border text-center p-2 rounded-md"
                >
                    로그인
                </div>
                <p className="my-4">
                    -------------------------------- 또는
                    --------------------------------
                </p>
                <div
                    onClick={onClickLogin}
                    className="block w-80 text-black border-black text-2xl border text-center py-2 rounded-md"
                >
                    Google으로 로그인하기
                </div>
                <div className="flex justify-center items-center my-2 color-text-blue1">
                    <a className="mx-4 my-2 text-2xl" href="./findid">
                        아이디 찾기
                    </a>
                    <p>/</p>
                    <a className="mx-4 my-2 text-2xl" href="./findpw">
                        비밀번호 찾기
                    </a>
                    <p>/</p>
                    <a className="mx-4 my-2 text-2xl" href="./regist">
                        회원가입
                    </a>
                </div>
            </div>
        </section>
    );
}
