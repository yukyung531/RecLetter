import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { requestEmail, verifyEmail } from '../api/auth';
import { getUser, registUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { studioState } from '../util/counter-slice';

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
    const [codeCheck, setCodeCheck] = useState<boolean>(false);
    const [emailFlag, setEmailFlag] = useState<number>(0);
    const [codeFlag, setCodeFlag] = useState<boolean>(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(studioState(''));
    }, []);

    /** ID 변화 감지 */
    const changeId = (e: BaseSyntheticEvent) => {
        setInputId(e.target.value);
        setIdCheck(false);
    };
    /** 이메일 변화 감지 */
    const changeEmail = (e: BaseSyntheticEvent) => {
        setInputEmail(e.target.value);
        setEmailCheck(false);
    };
    /** 코드 변화 감지 */
    const changeCode = (e: BaseSyntheticEvent) => {
        setInputCode(e.target.value);
        setCodeCheck(false);
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

    /** 이메일 체크 함수 */
    const checkEmailAPI = async () => {
        setEmailFlag(1);
        await requestEmail({ userEmail: inputEmail })
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    console.log('이메일을 보냈습니다.');
                    setEmailFlag(2);
                    setEmailCheck(true);
                } else {
                    setEmailFlag(4);
                    setEmailCheck(false);
                }
            })
            .catch((e: Error) => {
                setEmailFlag(4);
                console.log('오류가 발생했습니다.' + e);
            });
    };
    /** 코드 체크 함수 */
    const checkCodeAPI = async () => {
        await verifyEmail({ userEmail: inputEmail, code: inputCode })
            .then(async (res) => {
                if (
                    res.status === httpStatusCode.OK &&
                    res.data.isValid === true
                ) {
                    setEmailFlag(3);
                    setCodeCheck(true);
                    console.log(res.data);
                    setCodeFlag(false);
                } else {
                    setCodeFlag(true);
                    console.log('코드확인이 실패하였습니다.');
                }
            })
            .catch((e: Error) => {
                console.log('오류가 발생했습니다.' + e);
            });
    };
    /** ID 컴포넌트 */
    const checkIdElement = () => {
        if (idCheck) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        사용 가능합니다.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        아이디 검증이 필요합니다.
                    </p>
                </div>
            );
        }
    };
    /** Email 컴포넌트 */
    const checkEmailElement = () => {
        if (emailFlag === 0) {
            return <></>;
        } else if (emailFlag === 1) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-blue2">
                        이메일을 발송중입니다.
                    </p>
                </div>
            );
        } else if (emailCheck && emailFlag === 2) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 text-green-600">
                        이메일을 보냈습니다.
                    </p>
                </div>
            );
        } else if (emailFlag === 3 && emailCheck && codeCheck) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 text-green-600">인증되었습니다.</p>
                </div>
            );
        } else if (emailFlag === 4) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        다시 시도해주시기바랍니다.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        사용 할 수 없습니다.
                    </p>
                </div>
            );
        }
    };
    /** Code 컴포넌트 */
    const checkCodeElement = () => {
        if (emailFlag === 0) {
            return <></>;
        } else if (codeFlag) {
            return (
                <li className="flex mt-4">
                    <p className="w-32 me-4"></p>
                    <div className="flex w-128">
                        <p className="w-32 rounded-md flex justify-start items-center color-text-darkgray text-2xl ">
                            인증코드
                        </p>
                        <input
                            type="text"
                            className="w-94 w-64 h-12 ps-3 text-2xl border rounded-md"
                            onChange={(e) => {
                                changeCode(e);
                            }}
                            placeholder="인증코드 입력"
                        />
                        <p
                            className="w-32 border-2 rounded-md flex justify-center items-center text-2xl color-border-main color-text-main mx-2"
                            onClick={checkCodeAPI}
                        >
                            확인
                        </p>
                    </div>
                </li>
            );
        } else if (emailCheck && emailFlag === 2) {
            return (
                <li className="flex mt-4">
                    <p className="w-32 me-4"></p>
                    <div className="flex w-128">
                        <p className="w-32 rounded-md flex justify-start items-center color-text-darkgray text-2xl ">
                            인증코드
                        </p>
                        <input
                            type="text"
                            className="w-94 w-64 h-12 ps-3 text-2xl border rounded-md"
                            onChange={(e) => {
                                changeCode(e);
                            }}
                            placeholder="인증코드 입력"
                        />
                        <p
                            className="w-32 border-2 rounded-md flex justify-center items-center text-2xl color-border-main color-text-main mx-2 cursor-pointer hover:color-bg-main hover:text-white hover:transition-all"
                            onClick={checkCodeAPI}
                        >
                            확인
                        </p>
                    </div>
                </li>
            );
        } else if (emailFlag === 2 && emailCheck && codeCheck) {
            return <></>;
        } else {
            return <></>;
        }
    };

    /** Nickname 컴포넌트 */
    const checkNicknameElement = () => {
        if (inputNickname.length < 2 || inputNickname.length > 16) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        2자 이상 16자 이하로 사용해주세요.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 text-green-600">사용 가능합니다.</p>
                </div>
            );
        }
    };
    /** Password 컴포넌트 */
    const checkPasswordElement = () => {
        if (inputPassword.length < 8 || inputPassword.length > 16) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        8자 이상 16자 이하로 사용해주세요.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 text-green-600">사용 가능합니다.</p>
                </div>
            );
        }
    };
    /** PasswordCheck 컴포넌트 */
    const checkPasswordCheckElement = () => {
        if (
            inputPassword === inputPasswordConfirm &&
            inputPassword.length >= 8 &&
            inputPassword.length <= 16
        ) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 text-green-600">확인 되었습니다.</p>
                </div>
            );
        } else if (
            inputPassword.length === 0 &&
            inputPasswordConfirm.length == 0
        ) {
            return <></>;
        } else {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        비밀번호를 확인해주세요.
                    </p>
                </div>
            );
        }
    };
    const registAccount = async () => {
        if (inputNickname.length < 2 || inputNickname.length > 16) {
            alert('이름의 길이를 맞춰주세요');
        } else if (!emailCheck) {
            alert('이메일 인증을 진행해주세요');
        } else if (!codeCheck) {
            alert('코드를 다시 확인해주세요');
        } else if (inputPassword.length < 8 || inputPassword.length > 16) {
            alert('비밀번호를 맞춰주세요');
        } else if (inputPassword !== inputPasswordConfirm) {
            alert('비밀번호가 다릅니다');
        } else {
            await registUser({
                userNickname: inputNickname,
                userPassword: inputPassword,
                userEmail: inputEmail,
            }).then((res) => {
                if (res.status === httpStatusCode.OK) {
                    alert('회원가입이 완료되었습니다');
                    navigate('/');
                }
            });
        }
    };
    return (
        <section className="section-center">
            <ul className=" flex flex-col justify-center items-center">
                <h5 className=" text-3xl mt-4 mb-12">회원가입</h5>

                <li className="flex mt-4">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4">
                        이메일
                    </p>
                    <div className="flex w-128">
                        <input
                            type="text"
                            className="w-94 h-12 ps-3 text-2xl border rounded-md"
                            onChange={(e) => {
                                changeEmail(e);
                            }}
                            placeholder="sample@naver.com"
                        />
                        <p
                            className="w-32 border-2 rounded-md flex justify-center items-center text-2xl color-border-main color-text-main mx-2 cursor-pointer hover:color-bg-main hover:text-white hover:transition-all"
                            onClick={checkEmailAPI}
                        >
                            인증하기
                        </p>
                    </div>
                </li>
                {checkEmailElement()}
                {checkCodeElement()}
                <li className="flex mt-4">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4">
                        이름
                    </p>
                    <input
                        type="text"
                        className="w-128 h-12 ps-3 text-2xl border rounded-md"
                        onChange={(e) => {
                            changeNickname(e);
                        }}
                        placeholder="닉네임 (2~16자 이내)"
                    />
                </li>
                {checkNicknameElement()}

                <li className="flex mt-4">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4">
                        비밀번호
                    </p>
                    <input
                        type="password"
                        className="w-128 h-12 ps-3 text-2xl border rounded-md"
                        onChange={(e) => {
                            changePassword(e);
                        }}
                        placeholder="비밀번호 (8~16자 이내)"
                    />
                </li>
                {checkPasswordElement()}

                <li className="flex mt-4">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4">
                        비밀번호 확인
                    </p>
                    <input
                        type="password"
                        className="w-128 h-12 ps-3 text-2xl border rounded-md"
                        onChange={(e) => {
                            changePasswordConfig(e);
                        }}
                        placeholder="비밀번호 재확인"
                    />
                </li>
                {checkPasswordCheckElement()}

                <li className="w-full flex my-8 justify-center">
                    <p
                        className="w-128 rounded-md py-2 text-2xl text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white"
                        onClick={registAccount}
                    >
                        회원가입
                    </p>
                </li>
            </ul>
        </section>
    );
}
