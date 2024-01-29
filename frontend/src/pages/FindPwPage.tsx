import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { requestPasswordEmail, verifyPassword } from '../api/auth';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginState, studioState } from '../util/counter-slice';
import { settingNewPassword } from '../api/user';
import { deleteStorageData } from '../util/initialLocalStorage';

export default function FindPwPage() {
    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const [isCodeAuth, setIsCodeAuth] = useState<boolean>(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(studioState(''));
    }, []);

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
        setPassword(e.target.value);
    };
    /** 비밀번호 확인 변화 감지 */
    const changePasswordConfirm = (e: BaseSyntheticEvent) => {
        setPasswordConfirm(e.target.value);
    };
    /** POST 비밀번호 초기화 이메일 발송 요청 */
    const sendPasswordEmail = async () => {
        await requestPasswordEmail({ userEmail: inputEmail }).then((res) => {
            if (res.status === httpStatusCode.OK) {
                console.log('이메일로 코드를 발송했습니다.');
                alert('이메일로 코드를 발송했습니다');
            }
        });
    };
    /** POST 비밀번호 초기화 인증코드 검증 */
    const checkPasswordCode = async () => {
        await verifyPassword({ userEmail: inputEmail, code: inputCode }).then(
            (res) => {
                if (res.data.isValid === true) {
                    setIsCodeAuth(true);
                } else {
                    console.log('인증코드 관련이 잘못되었습니다');
                }
            }
        );
    };
    /** POST 비밀번호 초기화 후 비밀번호 재설정 */
    const setNewPassword = async () => {
        if (password !== passwordConfirm) {
            alert('비밀번호를 다시 확인해주세요.');
        } else {
            await settingNewPassword({
                userEmail: inputEmail,
                newPassword: password,
            }).then((res) => {
                if (res.status === httpStatusCode.OK) {
                    alert('비밀번호가 재설정되었습니다.');
                    deleteStorageData();
                    navigate('/');
                } else {
                    console.log('인증코드 관련이 잘못되었습니다');
                }
            });
        }
    };
    const passwordElement = () => {
        if (isCodeAuth) {
            return (
                <div>
                    <input
                        className="w-88 py-2 px-3 my-6 mt-2 border-2 rounded text-xl"
                        type="password"
                        placeholder="새로운 비밀번호를 입력해주세요."
                        onChange={(e) => {
                            changePassword(e);
                        }}
                    />
                    <input
                        className="w-88 py-2 px-3 my-6 border-2 rounded text-xl"
                        type="password"
                        placeholder="한 번 더 입력해주세요."
                        onChange={(e) => {
                            changePasswordConfirm(e);
                        }}
                    />
                </div>
            );
        }
    };
    return (
        <section className="section-center">
            <p className="text-3xl font-bold mx-4 my-6">비밀번호 찾기</p>

            <div className="flex flex-col my-4 items-center justify-center">
                <div className="flex mt-12 mb-2 ">
                    <input
                        className="w-88 py-2 px-3 border-2 rounded text-xl"
                        type="text"
                        placeholder="이메일을 입력해주세요."
                        onChange={(e) => {
                            changeEmail(e);
                        }}
                    />
                    <div
                        className="h-12 border rounded flex items-center hover:bg-gray-200 cursor-pointer"
                        onClick={sendPasswordEmail}
                    >
                        인증요청
                    </div>
                </div>
                <div className="flex mt-12 mb-2 ">
                    <input
                        className="w-88 py-2 px-3 border-2 rounded text-xl"
                        type="text"
                        placeholder="코드를 입력해주세요."
                        onChange={(e) => {
                            changeCode(e);
                        }}
                    />
                    <div
                        className="h-12 border rounded flex items-center hover:bg-gray-200 cursor-pointer"
                        onClick={checkPasswordCode}
                    >
                        인증하기
                    </div>
                </div>
            </div>
            {passwordElement()}
            <button
                className="w-88 py-3 px-3 my-12 rounded text-xl color-bg-yellow2 text-center"
                onClick={setNewPassword}
                disabled={!isCodeAuth}
            >
                비밀번호 찾기
            </button>
        </section>
    );
}
