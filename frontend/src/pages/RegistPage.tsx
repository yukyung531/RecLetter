import { BaseSyntheticEvent, useState } from 'react';
import { checkId, requestEmail, verifyEmail } from '../api/auth';
import { getUser, registUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';

export default function RegistPage() {
    const [inputId, setInputId] = useState<string>('');
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [inputPassword, setInputPassword] = useState<string>('');
    const [inputPasswordConfirm, setInputPasswordConfirm] =
        useState<string>('');
    const [inputNickname, setInputNickName] = useState<string>('');
    const [idCheck, setIdCheck] = useState<boolean>(false);
    const [emailCheck, setEmailCheck] = useState<boolean>(false);
    const navigate = useNavigate();
    /** ID 변화 감지 */
    const changeId = (e: BaseSyntheticEvent) => {
        setInputId(e.target.value);
    };
    /** 이메일 변화 감지 */
    const changeEmail = (e: BaseSyntheticEvent) => {
        setInputEmail(e.target.value);
    };
    /** 코드 변화 감지 */
    const changeCode = (e: BaseSyntheticEvent) => {
        setInputCode(e.target.value);
    };
    /** 비밀번호 변화 감지 */
    const changePassword = (e: BaseSyntheticEvent) => {
        setInputPassword(e.target.value);
    };
    /** 비밀번호 변화 감지2 */
    const changePasswordConfig = (e: BaseSyntheticEvent) => {
        setInputPasswordConfirm(e.target.value);
    };
    /** 비밀번호 변화 감지2 */
    const changeNickname = (e: BaseSyntheticEvent) => {
        setInputNickName(e.target.value);
    };
    /** 아이디 체크 함수 */
    const checkIdAPI = async () => {
        await checkId(inputId)
            .then((res) => {
                console.log(res);
                if (res.data) {
                    setIdCheck(true);
                } else {
                    setIdCheck(false);
                }
            })
            .catch((e: Error) => {
                console.log('오류가 발생했습니다.' + e);
            });
    };
    /** 이메일 체크 함수 */
    const checkEmailAPI = async () => {
        await requestEmail(inputEmail)
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    console.log('이메일을 보냈습니다.');
                    setEmailCheck(true);
                } else {
                    setEmailCheck(false);
                }
            })
            .catch((e: Error) => {
                console.log('오류가 발생했습니다.' + e);
            });
    };
    /** ID 컴포넌트 */
    const checkIdElement = () => {
        if (idCheck) {
            return <div>사용 가능합니다</div>;
        } else {
            return <div>사용 할 수 없습니다</div>;
        }
    };
    /** Email 컴포넌트 */
    const checkEmailElement = () => {
        if (emailCheck) {
            return <div>이메일을 보냈습니다.</div>;
        } else {
            return <div>사용 할 수 없습니다</div>;
        }
    };
    const registAccount = async () => {
        await verifyEmail({ userEmail: inputEmail, code: inputCode })
            .then(async (res) => {
                if (res.status === httpStatusCode.OK) {
                    if (inputPassword !== inputPasswordConfirm) {
                        console.log('비밀번호가 다릅니다');
                    } else if (!idCheck) {
                        console.log('아이디 중복검사를 해주세요');
                    } else if (!emailCheck) {
                        console.log('이메일을 다시 확인해주세요');
                    } else {
                        console.log('인증번호는 대따');
                        console.log(
                            inputId,
                            inputNickname,
                            inputPassword,
                            inputEmail
                        );
                        await registUser({
                            userId: inputId,
                            userNickname: inputNickname,
                            userPassword: inputPassword,
                            userEmail: inputEmail,
                        }).then((res) => {
                            if (res.status === httpStatusCode.OK) {
                                console.log('회원가입이 완료되었습니다');
                                navigate('/');
                            }
                        });
                    }
                } else {
                    console.log('회원가입에 실패하였습니다.');
                }
            })
            .catch((e: Error) => {
                console.log('오류가 발생했습니다.' + e);
            });
    };
    return (
        <section className="section-center">
            <ul className="w-1/3 flex flex-col justify-center items-center border">
                <h5 className=" text-2xl">회원가입</h5>
                <li className="flex my-4">
                    <p className="mx-4">아이디</p>
                    <input
                        type="text"
                        className="border"
                        onChange={(e) => {
                            changeId(e);
                        }}
                    />
                    <p className="border" onClick={checkIdAPI}>
                        아이디 확인
                    </p>
                    {checkIdElement()}
                </li>
                <li className="flex my-4">
                    <p className="mx-4">이름</p>
                    <input
                        type="text"
                        className="border"
                        onChange={(e) => {
                            changeNickname(e);
                        }}
                    />
                </li>
                <li className="flex my-4">
                    <p className="mx-4">이메일</p>
                    <input
                        type="text"
                        className="border"
                        onChange={(e) => {
                            changeEmail(e);
                        }}
                    />
                    <p className="border" onClick={checkEmailAPI}>
                        인증코드 전송
                    </p>
                    {checkEmailElement()}
                </li>
                <li className="flex my-4">
                    <p className="mx-4">인증코드</p>
                    <input
                        type="text"
                        className="border"
                        onChange={(e) => {
                            changeCode(e);
                        }}
                    />
                    <button className="border">인증하기</button>
                </li>
                <li className="flex my-4">
                    <p className="mx-4">비밀번호</p>
                    <input
                        type="text"
                        className="border"
                        onChange={(e) => {
                            changePassword(e);
                        }}
                    />
                </li>
                <li className="flex my-4">
                    <p className="mx-4">비밀번호 확인</p>
                    <input
                        type="text"
                        className="border"
                        onChange={(e) => {
                            changePasswordConfig(e);
                        }}
                    />
                </li>
                <li className="w-full flex my-4 justify-around">
                    <p
                        className="border p-4 bg-slate-200"
                        onClick={registAccount}
                    >
                        회원가입
                    </p>
                    <button className="border p-4 bg-blue-100">
                        구글로 회원가입
                    </button>
                </li>
            </ul>
        </section>
    );
}
