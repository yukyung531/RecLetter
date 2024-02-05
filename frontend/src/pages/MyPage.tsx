import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    loginState,
    studioNameState,
    studioState,
} from '../util/counter-slice';
import { deleteUser, getUser, modifyPass, modifyUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { deleteStorageData } from '../util/initialLocalStorage';

export default function MyPage() {
    const [userNickname, setUserNickname] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [flagPassword, setFlagPassword] = useState<boolean>(false);

    useEffect(() => {
        dispatch(studioState(''));
        dispatch(studioNameState(''));
    }, []);

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

    /** GET 유저 정보 API */
    const getUserInfo = async () => {
        await getUser().then((res) => {
            if (res.status === httpStatusCode.OK) {
                setUserNickname(res.data.userNickname);
                setUserEmail(res.data.userEmail);
            }
        });
    };
    /** 수정사항 저장 API */
    const saveUserAPI = async () => {
        await modifyUser({
            userNickname: userNickname,
        }).then((res) => {
            if (res.status === httpStatusCode.OK) {
                alert('정보가 수정되었습니다');
                navigate('/login');
            }
        });
    };
    /** 유저 삭제 API */
    const deleteUserAPI = async () => {
        await deleteUser().then((res) => {
            if (res.status === httpStatusCode.OK) {
                alert('회원 정보가 삭제되었습니다.');
                navigate('/');
                deleteStorageData();
            }
        });
    };
    /** 닉네임 변환 감지 */
    const changeNickname = (e: BaseSyntheticEvent) => {
        setUserNickname(e.target.value);
    };

    /** 전 비밀번호 변환 감지 */
    const changeOldPassword = (e: BaseSyntheticEvent) => {
        setOldPassword(e.target.value);
    };
    /** 새 비밀번호 변환 감지 */
    const changeNewPassword = (e: BaseSyntheticEvent) => {
        setNewPassword(e.target.value);
    };

    /** 새 비밀번호 확인 변환 감지 */
    const changeNewPasswordConfirm = (e: BaseSyntheticEvent) => {
        setNewPasswordConfirm(e.target.value);
    };

    /** 변경사항 저장 함수 */
    const saveUser = () => {
        if (userNickname.length < 2 || userNickname.length > 16) {
            alert('닉네임은 2~16자 사이로 사용 가능합니다');
        } else saveUserAPI();
    };
    /** 비밀번호 변경 함수 */
    const modifyPassword = () => {
        if (newPassword !== newPasswordConfirm) {
            alert('새 비밀번호를 확인해주세요');
        } else if (newPassword.length < 8 || newPassword.length > 16) {
            alert('비밀번호는 8~16자 사이로 사용 가능합니다.');
        } else {
            modifyPass({
                originalPassword: oldPassword,
                newPassword: newPassword,
            })
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        alert('비밀번호가 수정되었습니다.');
                        deleteStorageData();
                        navigate('/login');
                    }
                })
                .catch(() => {
                    alert('비밀번호를 확인해주세요.');
                });
        }
    };
    /** 회원 탈퇴 함수 */
    const deleteUserState = () => {
        deleteUserAPI();
    };
    /** 비밀번호 변경 토클 */
    const changeFlag = () => {
        setFlagPassword(!flagPassword);
    };

    const myPageElement = () => {
        if (!flagPassword) {
            return (
                <div className="flex flex-col items-center">
                    <p className="text-3xl mx-4 my-2">마이페이지</p>
                    <p className="mx-4 mb-4">내 개인 정보를 수정 가능합니다</p>
                    <div className="my-14">
                        <div className="flex h-12 my-5 items-center justify-center">
                            <p className="w-16 text-xl color-text-darkgray me-4 text-end">
                                이메일
                            </p>
                            <p className="w-105 py-2 px-3 border-2 rounded text-xl color-bg-gray">
                                {userEmail}
                            </p>
                        </div>
                        <div className="flex h-12 my-5 items-center justify-center">
                            <p className="w-16 text-xl color-text-darkgray me-4 text-end">
                                이름
                            </p>
                            <input
                                className="w-105 py-2 px-3 border-2 rounded text-xl"
                                type="text"
                                value={userNickname}
                                onChange={changeNickname}
                                placeholder="이름입니다."
                            />
                        </div>
                    </div>

                    <div
                        className="w-128 rounded-md py-2 text-2xl my-2 text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white"
                        onClick={saveUser}
                    >
                        변경사항 저장
                    </div>
                    <div
                        className="w-128 rounded-md py-2 text-2xl my-2 border-2 color-border-main text-center color-border-main color-text-main mx-2 cursor-pointer hover:color-bg-main hover:text-white hover:transition-all"
                        onClick={changeFlag}
                    >
                        비밀번호 변경
                    </div>
                    <div
                        className="w-128 rounded-md py-2 text-2xl my-2 text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white"
                        onClick={deleteUserState}
                    >
                        회원 탈퇴
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center">
                    <p className="text-3xl mx-4 my-2">비밀번호 변경</p>
                    <p className="mx-4 mb-4">새로운 비밀번호로 변경합니다</p>
                    <div className="my-8">
                        <div className="flex h-12 my-3 items-center justify-center">
                            <p className="w-32 text-xl color-text-darkgray me-4 text-end">
                                현재 비밀번호
                            </p>
                            <input
                                className="input-88"
                                type="password"
                                onChange={(e) => {
                                    changeOldPassword(e);
                                }}
                                value={oldPassword}
                            />
                        </div>
                        <div className="flex h-12 my-3 items-center justify-center">
                            <p className="w-32 text-xl color-text-darkgray me-4 text-end">
                                새 비밀번호
                            </p>
                            <input
                                className="input-88"
                                type="password"
                                onChange={(e) => {
                                    changeNewPassword(e);
                                }}
                                value={newPassword}
                                placeholder="8자~16자 사이로 입력해주세요"
                            />
                        </div>
                        <div className="flex h-12 my-3 items-center justify-center">
                            <p className="w-32 text-xl color-text-darkgray me-4 text-end">
                                새 비밀번호 확인
                            </p>
                            <input
                                className="input-88"
                                type="password"
                                onChange={(e) => {
                                    changeNewPasswordConfirm(e);
                                }}
                                value={newPasswordConfirm}
                                placeholder="8자~16자 사이로 입력해주세요"
                            />
                        </div>
                    </div>

                    <div
                        className="w-128 rounded-md py-2 text-2xl mt-12 mb-2 text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white"
                        onClick={modifyPassword}
                    >
                        비밀번호 변경
                    </div>
                    <div
                        className="w-128 rounded-md py-2 text-2xl my-3 border-2 color-border-main text-center color-border-main color-text-main mx-2 cursor-pointer hover:color-bg-main hover:text-white hover:transition-all"
                        onClick={changeFlag}
                    >
                        변경 취소
                    </div>
                </div>
            );
        }
    };
    return <section className="section-center">{myPageElement()}</section>;
}
