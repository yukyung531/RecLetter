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
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import WithdrawModal from '../components/WithdrawModal';

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

    const [isDisabled, setIsDisabled] = useState(false);

    // 에러 모달
    const [isErrorModalActive, setIsErrorModalActive] =
        useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const closeErrorModal = () => {
        setIsErrorModalActive(false);
    };

    //유저 정보 수정 완료 시 모달
    const [isSaveUserSuccess, setIsSaveUserSuccess] = useState<boolean>(false);

    const closeSaveUserModal = () => {
        setIsSaveUserSuccess(false);
        navigate('/login');
    };

    //회원 탈퇴 시 모달
    const [isUserDeleted, setIsUserDeleted] = useState<boolean>(false);

    const closeUserDeleteModal = () => {
        setIsUserDeleted(false);
        deleteStorageData();
        navigate('/');
    };

    //비밀번호 수정 시 모달
    const [isPWModified, setIsPWModified] = useState<boolean>(false);

    const closePwModifyModal = () => {
        setIsPWModified(false);
        deleteStorageData();
        navigate('/login');
    };

    //회원 탈퇴 모달
    const [isTryToWithdraw, setIsTryToWithdraw] = useState<boolean>(false);

    const confirmWithdraw = () => {
        deleteUserState();
        setIsTryToWithdraw(false);
    };

    const cancelWithdraw = () => {
        setIsTryToWithdraw(false);
    };

    // 비활성화 상태일 때의 inline 스타일
    const disabledStyle: React.CSSProperties = {
        borderColor: '#ccc', // 테두리 색상
        backgroundColor: '#ccc',
        color: 'darkgray', // 글씨 색상
    };

    useEffect(() => {
        dispatch(studioState([]));
        dispatch(studioNameState(''));
    }, []);

    useEffect(() => {
        if (isLogin) {
            // console.log(isLogin);
            getUserInfo();
        }
        if (!isLogin) {
            navigate(`/`);
        }
    }, [isLogin]);

    /** GET 유저 정보 API */
    const getUserInfo = async () => {
        await getUser().then((res) => {
            if (res.status === httpStatusCode.OK) {
                setUserNickname(res.data.userNickname);
                setUserEmail(res.data.userEmail);
                if (res.data.userRole === 'ROLE_SOCIAL') {
                    setIsDisabled(true);
                    // console.log('안댕');
                }
            }
        });
    };
    /** 수정사항 저장 API */
    const saveUserAPI = async () => {
        await modifyUser({
            userNickname: userNickname,
        }).then((res) => {
            if (res.status === httpStatusCode.OK) {
                setIsSaveUserSuccess(true);
            }
        });
    };

    /** 회원탈퇴 확인 알림창 */
    const handleWithdrawal = () => {
        setIsTryToWithdraw(true);
        // const confirmed = window.confirm('정말 탈퇴하시겠습니까?');
        // if (confirmed) {
        //     // 탈퇴 로직을 실행합니다.
        //     deleteUserState();
        //     console.log('사용자가 탈퇴했습니다.');
        // } else {
        //     console.log('사용자가 탈퇴를 취소했습니다.');
        // }
    };

    /** 유저 삭제 API */
    const deleteUserAPI = async () => {
        await deleteUser().then((res) => {
            if (res.status === httpStatusCode.OK) {
                setIsUserDeleted(true);
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
            setErrorMessage('닉네임은 2~16자 사이로 사용 가능합니다');
            setIsErrorModalActive(true);
        } else saveUserAPI();
    };
    /** 비밀번호 변경 함수 */
    const modifyPassword = () => {
        if (newPassword !== newPasswordConfirm) {
            setErrorMessage('새 비밀번호를 확인해주세요');
            setIsErrorModalActive(true);
        } else if (newPassword.length < 8 || newPassword.length > 16) {
            setErrorMessage('비밀번호는 8~16자 사이로 사용 가능합니다.');
            setIsErrorModalActive(true);
        } else {
            modifyPass({
                originalPassword: oldPassword,
                newPassword: newPassword,
            })
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        setIsPWModified(true);
                    }
                })
                .catch(() => {
                    setErrorMessage('비밀번호를 확인해주세요.');
                    setIsErrorModalActive(true);
                });
        }
    };
    /** 회원 탈퇴 함수 */
    const deleteUserState = () => {
        deleteUserAPI();
    };
    /** 비밀번호 변경 토클 */
    const changeFlag = () => {
        if (!isDisabled) {
            setFlagPassword(!flagPassword);
        }
    };

    const myPageElement = () => {
        if (!flagPassword) {
            return (
                <div className="flex flex-col items-center">
                    {isErrorModalActive ? (
                        <ErrorModal
                            onClick={closeErrorModal}
                            message={errorMessage}
                        />
                    ) : (
                        <></>
                    )}
                    {isSaveUserSuccess ? (
                        <SuccessModal
                            onClick={closeSaveUserModal}
                            message="정보가 수정되었습니다"
                        />
                    ) : (
                        <></>
                    )}
                    {isUserDeleted ? (
                        <SuccessModal
                            onClick={closeUserDeleteModal}
                            message="회원 정보가 삭제되었습니다."
                        />
                    ) : (
                        <></>
                    )}
                    {isPWModified ? (
                        <SuccessModal
                            onClick={closePwModifyModal}
                            message="비밀번호가 수정되었습니다."
                        />
                    ) : (
                        <></>
                    )}
                    {isTryToWithdraw ? (
                        <WithdrawModal
                            onClickOK={confirmWithdraw}
                            onClickCancel={cancelWithdraw}
                        />
                    ) : (
                        <></>
                    )}
                    <p className="text-3xl mx-4 my-2">마이페이지</p>
                    <p className="mx-4 mb-4">
                        내 개인 정보를 수정할 수 있습니다.
                    </p>
                    <div className="my-14">
                        <div className="flex h-12 my-5 items-center justify-center">
                            <p className="w-16 text-xl color-text-darkgray me-4 text-end">
                                이메일
                            </p>
                            <p className="w-105 py-2 px-3 border-2 rounded text-xl color-bg-gray">
                                {userEmail}
                            </p>
                        </div>
                        <div className="flex h-12 my-2 items-center justify-center">
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
                        className="w-128 rounded-md py-2 text-2xl my-2 text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white border-2 border-transparent"
                        onClick={saveUser}
                    >
                        변경사항 저장
                    </div>

                    <div
                        className={`w-128 rounded-md py-2 text-2xl my-2 border-2 text-center mx-2 ${
                            isDisabled
                                ? 'cursor-not-allowed'
                                : 'hover:color-bg-main hover:text-white hover:transition-all cursor-pointer '
                        }`}
                        style={isDisabled ? disabledStyle : {}}
                        // 버튼이 비활성화된 경우 disabled 속성을 추가
                        // React에서는 일반적으로 비활성화된 상태일 때는 onClick 이벤트를 처리하지 않으므로 disabled 속성은 선택적으로 추가할 수 있습니다.
                        // 하지만 표현력을 높이고 명시성을 유지하기 위해 포함하는 것이 좋습니다.
                        //disabled={isDisabled}
                        onClick={changeFlag}
                    >
                        비밀번호 변경
                    </div>

                    <div
                        className="text-xl underline my-6 text-center cursor-pointer text-gray-400"
                        onClick={handleWithdrawal}
                    >
                        회원 탈퇴
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center">
                    {isErrorModalActive ? (
                        <ErrorModal
                            onClick={closeErrorModal}
                            message={errorMessage}
                        />
                    ) : (
                        <></>
                    )}
                    {isSaveUserSuccess ? (
                        <SuccessModal
                            onClick={closeSaveUserModal}
                            message="정보가 수정되었습니다"
                        />
                    ) : (
                        <></>
                    )}
                    {isUserDeleted ? (
                        <SuccessModal
                            onClick={closeUserDeleteModal}
                            message="회원 정보가 삭제되었습니다."
                        />
                    ) : (
                        <></>
                    )}
                    {isPWModified ? (
                        <SuccessModal
                            onClick={closePwModifyModal}
                            message="비밀번호가 수정되었습니다."
                        />
                    ) : (
                        <></>
                    )}
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
                        <div className="flex h-12 my-2 items-center justify-center">
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
                        className="w-128 rounded-md py-2 text-2xl mt-12 mb-2 text-center color-bg-main text-white cursor-pointer hover:color-bg-subbold hover:text-white border-2 border-transparent"
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
