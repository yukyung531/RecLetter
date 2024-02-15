import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { requestPasswordEmail, verifyPassword } from '../api/auth';
import { httpStatusCode } from '../util/http-status';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginState,
    studioNameState,
    studioState,
} from '../util/counter-slice';
import { settingNewPassword } from '../api/user';
import { deleteStorageData } from '../util/initialLocalStorage';
import axios, { AxiosError } from 'axios';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';

export default function FindPwPage() {
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [emailCheck, setEmailCheck] = useState<boolean>(false);
    const [codeCheck, setCodeCheck] = useState<boolean>(false);
    const [emailFlag, setEmailFlag] = useState<number>(0);
    const [codeFlag, setCodeFlag] = useState<boolean>(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [count, setCount] = useState<number>(600);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    //모달창
    const [isSuccessModalActive, setIsSuccessModalActive] =
        useState<boolean>(false);
    const [isErrorModalActive, setIsErrorModalActive] =
        useState<boolean>(false);

    /** closeSuccessModal()
     *  비밀번호 변경 성공창 닫기
     */
    const closeSuccessModal = () => {
        setIsSuccessModalActive(false);
        navigate('/');
    };

    /** closeErrorModal()
     *  비밀번호 변경 실패창 닫기
     */
    const closeErrorModal = () => {
        setIsErrorModalActive(false);
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
        setPassword(e.target.value);
    };
    /** 비밀번호 확인 변화 감지 */
    const changePasswordConfirm = (e: BaseSyntheticEvent) => {
        setPasswordConfirm(e.target.value);
    };

    /** 카운팅 시작 */
    const startCounting = () => {
        setCount(600); //10분
        setIsCounting(true);
    };

    /** POST 비밀번호 초기화 이메일 발송 요청 */
    const sendPasswordEmail = async () => {
        setEmailFlag(1);
        await requestPasswordEmail({ userEmail: inputEmail })
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

                console.log('오류가 발생했습니다.' + e.message);
            });
    };
    /** POST 비밀번호 초기화 인증코드 검증 */
    const checkPasswordCode = async () => {
        await verifyPassword({ userEmail: inputEmail, code: inputCode })
            .then((res) => {
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
    /** POST 비밀번호 초기화 후 비밀번호 재설정 */
    const setNewPassword = async () => {
        if (password !== passwordConfirm) {
            setIsErrorModalActive(true);
        } else {
            await settingNewPassword({
                userEmail: inputEmail,
                newPassword: password,
            }).then((res) => {
                if (res.status === httpStatusCode.OK) {
                    setIsSuccessModalActive(true);
                    deleteStorageData();
                } else {
                    // console.log('인증코드 관련이 잘못되었습니다');
                }
            });
        }
    };
    const passwordElement = () => {
        return (
            <div>
                <div className="flex h-12 my-3 items-center justify-center">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4">
                        비밀번호
                    </p>
                    <input
                        className="w-128 h-12 ps-3 text-2xl border rounded-md"
                        type="password"
                        onChange={(e) => {
                            changePassword(e);
                        }}
                        value={password}
                        placeholder="비밀번호"
                    />
                </div>
                <div className="flex h-12 my-3 items-center justify-center">
                    <p className="w-32 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4">
                        비밀번호 확인
                    </p>
                    <input
                        className="w-128 h-12 ps-3 text-2xl border rounded-md"
                        type="password"
                        onChange={(e) => {
                            changePasswordConfirm(e);
                        }}
                        value={passwordConfirm}
                        placeholder="비밀번호 확인"
                    />
                </div>
            </div>
        );
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
                    <p className="w-32 pb-4 flex flex-col justify-center text-2xl color-text-darkgray text-right me-4"></p>
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
                            className="w-94 w-64 h-12 ps-3 text-2xl border rounded-md"
                            onChange={(e) => {
                                changeCode(e);
                            }}
                            placeholder="인증코드 입력"
                        />
                        <p
                            className="w-32 border-2 rounded-md flex justify-center items-center text-2xl color-border-main color-text-main mx-2"
                            onClick={checkPasswordCode}
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
    return (
        <section className="section-center">
            {isErrorModalActive ? (
                <ErrorModal
                    onClick={closeErrorModal}
                    message="비밀번호를 다시 확인해주세요."
                />
            ) : (
                <></>
            )}
            {isSuccessModalActive ? (
                <SuccessModal
                    onClick={closeSuccessModal}
                    message="비밀번호가 재설정되었습니다."
                />
            ) : (
                <></>
            )}
            <p className="text-3xl mx-4 my-6">비밀번호 찾기</p>
            <div className="flex flex-col items-center justify-center">
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
                            onClick={sendPasswordEmail}
                        >
                            인증하기
                        </p>
                    </div>
                </li>
            </div>
            {checkEmailElement()}
            {checkCodeElement()}
            {codeWord()}
            {passwordElement()}
            <button
                className="w-88 py-1 px-1 my-5 rounded-md py-2 text-2xl text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white"
                onClick={setNewPassword}
            >
                비밀번호 재설정
            </button>
            <div className="text-xl underline my-6 text-center cursor-pointer text-gray-400">
                <Link to="/login">돌아가기</Link>
            </div>
        </section>
    );
}
