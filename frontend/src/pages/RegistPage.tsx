import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { requestEmail, verifyEmail } from '../api/auth';
import { getUser, registUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { studioNameState, studioState } from '../util/counter-slice';
import axios, { AxiosError } from 'axios';
import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

export default function RegistPage() {
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [inputPassword, setInputPassword] = useState<string>('');
    const [inputPasswordConfirm, setInputPasswordConfirm] =
        useState<string>('');
    const [inputNickname, setInputNickName] = useState<string>('');
    const [emailCheck, setEmailCheck] = useState<boolean>(false);
    const [codeCheck, setCodeCheck] = useState<boolean>(false);
    const [emailFlag, setEmailFlag] = useState<number>(0);
    const [codeFlag, setCodeFlag] = useState<boolean>(false);
    const [count, setCount] = useState<number>(600);
    const [isCounting, setIsCounting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    //회원가입 모달
    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    //에러 모달
    const [isErrorModalActive, setIsErroModalActive] = useState<boolean>(false);
    const [modalErrorMessage, setModalErrorMessage] = useState<string>('');

    /** closeErrorModal()
     *  에러모달창 닫기
     */
    const closeErrorModal = () => {
        setIsErroModalActive(false);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(studioState([]));
        dispatch(studioNameState(''));
    }, []);

    useEffect(() => {
        let intervalId: any;

        if (isCounting) {
            intervalId = setInterval(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isCounting]);

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
    /** 이름 변화 감지 */
    const changeNickname = (e: BaseSyntheticEvent) => {
        setInputNickName(e.target.value);
    };

    /** 이메일 체크 함수 */
    const checkEmailAPI = async () => {
        setEmailFlag(1);
        await requestEmail({ userEmail: inputEmail })
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    // console.log('이메일을 보냈습니다.');
                    setEmailFlag(2);
                    setEmailCheck(true);
                    setCodeCheck(false);
                    startCounting();
                } else {
                    setEmailFlag(4);
                    setEmailCheck(false);
                }
            })
            .catch((e: Error) => {
                if (axios.isAxiosError(e)) {
                    const axiosError: any = e;
                    const originalString = axiosError.response.data;
                    const parts = originalString.split(':');
                    const firstPart = parts[1];
                    setErrorMessage(firstPart);
                }
                setEmailFlag(4);

                // console.log('오류가 발생했습니다.' + e.message);
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
                    // console.log(res.data);
                    setCodeFlag(false);
                } else {
                    setEmailFlag(3);
                    setCodeFlag(true);
                    // console.log('코드확인이 실패하였습니다.');
                }
            })
            .catch((e: Error) => {
                console.log('오류가 발생했습니다.' + e);
            });
    };
    /** 엔터키 누르면 보내는 이벤트 */
    const sendRegistEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            registAccount();
        }
    };
    const sendEmailCodeEnter = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === 'Enter') {
            checkEmailAPI();
        }
    };
    const sendCodeEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            checkCodeAPI();
        }
    };
    const checkCodeEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            checkCodeAPI();
        }
    };
    /** 카운팅 시작 */
    const startCounting = () => {
        setCount(600); //10분
        setIsCounting(true);
    };
    /** 카운팅 종료 */
    const endCounting = () => {
        setIsCounting(false);
    };

    /** 인증코드 입력 부분 워딩 */
    const codeWord = () => {
        if (emailFlag === 0) {
            return <></>;
        } else if (codeFlag && emailFlag === 3 && count > 0) {
            return (
                <div className="flex">
                    <p className="w-300 h-3 color-text-main">
                        인증에 실패했습니다.
                    </p>
                </div>
            );
        }
    };

    /** Email 컴포넌트 */
    const checkEmailElement = () => {
        if (emailFlag === 3 && emailCheck && codeCheck) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 text-green-600">인증되었습니다.</p>
                </div>
            );
        } else if (count <= 0 && emailFlag !== 1) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">
                        인증이 만료되었습니다.
                    </p>
                </div>
            );
        } else if (emailFlag === 0) {
            return <></>;
        } else if (emailFlag === 1) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-blue2">
                        이메일을 발송 중입니다.
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
        } else if (emailFlag === 4) {
            return (
                <div className="flex">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
                    <p className="w-128 h-3 color-text-main">{errorMessage}</p>
                </div>
            );
        }
    };
    /** Code 컴포넌트 */
    const checkCodeElement = () => {
        if (count <= 0) {
            checkEmailElement();
            return <></>;
        }
        if (emailFlag === 0) {
            return <></>;
        } else if (
            (emailFlag === 2 || emailFlag === 3) &&
            emailCheck &&
            codeCheck
        ) {
            return <></>;
        } else if (emailCheck && (emailFlag === 2 || emailFlag === 3)) {
            return (
                <li className="flex mt-4">
                    <p className="w-32 me-4"></p>
                    <div className="flex w-128">
                        <div>
                            <p className="w-32 rounded-md flex justify-start items-center color-text-darkgray text-2xl ">
                                인증코드
                            </p>
                            <p className="h-1">
                                {Math.floor(count / 60)}분 {count % 60}초
                            </p>
                        </div>
                        <input
                            type="text"
                            className="w-120 w-64 h-12 ps-3 text-2xl border rounded-md"
                            onChange={(e) => {
                                changeCode(e);
                            }}
                            onKeyDown={checkCodeEnter}
                            placeholder="인증코드 입력"
                        />
                        <p
                            className="w-32 border-2 h-12 rounded-md flex justify-center items-center text-2xl color-border-main color-text-main mx-2 cursor-pointer hover:color-bg-main hover:text-white btn-animation"
                            onClick={checkCodeAPI}
                        >
                            확인
                        </p>
                    </div>
                </li>
            );
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
            setModalErrorMessage('이름의 길이를 맞춰주세요');
            setIsErroModalActive(true);
        } else if (!emailCheck) {
            setModalErrorMessage('이메일 인증을 진행해주세요');
            setIsErroModalActive(true);
        } else if (!codeCheck) {
            setModalErrorMessage('코드를 다시 확인해주세요');
            setIsErroModalActive(true);
        } else if (inputPassword.length < 8 || inputPassword.length > 16) {
            setModalErrorMessage('비밀번호를 맞춰주세요');
            setIsErroModalActive(true);
        } else if (inputPassword !== inputPasswordConfirm) {
            setModalErrorMessage('비밀번호가 다릅니다');
            setIsErroModalActive(true);
        } else {
            await registUser({
                userNickname: inputNickname,
                userPassword: inputPassword,
                userEmail: inputEmail,
            }).then((res) => {
                if (res.status === httpStatusCode.OK) {
                    setIsModalActive(true);
                }
            });
        }
    };

    /** closeModal()
     *  모달창 닫기
     */
    const closeModal = () => {
        setIsModalActive(false);
        navigate('/login');
    };

    return (
        <section className="section-center">
            {isModalActive ? (
                <SuccessModal
                    onClick={closeModal}
                    message="회원가입이 완료되었습니다."
                />
            ) : (
                <></>
            )}
            {isErrorModalActive ? (
                <ErrorModal
                    onClick={closeErrorModal}
                    message={modalErrorMessage}
                />
            ) : (
                <></>
            )}
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
                            onKeyDown={sendEmailCodeEnter}
                            placeholder="sample@naver.com"
                        />
                        <p
                            className="w-32 border-2 rounded-md flex justify-center items-center text-2xl color-border-main color-text-main mx-2 cursor-pointer hover:color-bg-main hover:text-white btn-animation"
                            onClick={checkEmailAPI}
                        >
                            인증하기
                        </p>
                    </div>
                </li>
                {checkEmailElement()}
                {checkCodeElement()}
                {codeWord()}
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
                        onKeyDown={sendRegistEnter}
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
                        onKeyDown={sendRegistEnter}
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
