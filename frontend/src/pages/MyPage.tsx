import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginState } from '../util/counter-slice';
import { deleteUser, getUser, modifyPass, modifyUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { deleteStorageData } from '../util/initialLocalStorage';

export default function MyPage() {
    const [userNickname, setUserNickname] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
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

    /** GET 유저 정보 API */
    const getUserInfo = async () => {
        await getUser().then((res) => {
            if (res.status === httpStatusCode.OK) {
                setUserId(res.data.userId);
                setUserNickname(res.data.userNickname);
                setUserEmail(res.data.userEmail);
            }
        });
    };
    /** 수정사항 저장 API */
    const saveUserAPI = async () => {
        await modifyUser({
            userEmail: userEmail,
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
    /** 이메일 변환 감지 */
    const changeEmail = (e: BaseSyntheticEvent) => {
        setUserEmail(e.target.value);
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
        saveUserAPI();
    };
    /** 비밀번호 변경 함수 */
    const modifyPassword = () => {
        if (newPassword !== newPasswordConfirm) {
            alert('새 비밀번호를 확인해주세요');
        } else {
            modifyPass({
                originalPassword: oldPassword,
                newPassword: newPassword,
            })
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        alert('비밀번호가 수정되었습니다.');
                        deleteStorageData();
                        navigate('/');
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
                    value={userNickname}
                />
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">이메일</p>
                <input
                    className="w-60 py-2 px-3 border-2 rounded text-xl"
                    type="text"
                    onChange={(e) => {
                        changeEmail(e);
                    }}
                    value={userEmail}
                />
                <p className="w-24 ml-4 py-2 rounded-md text-center text-xl text-white color-bg-blue1 cursor-pointer hover:bg-sky-300">
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
                <p className="w-24 ml-4 py-2 rounded-md text-center text-xl text-white color-bg-blue1 cursor-pointer hover:bg-sky-300">
                    인증하기
                </p>
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">현재 비밀번호</p>
                <input
                    className="input-88"
                    type="password"
                    onChange={(e) => {
                        changeOldPassword(e);
                    }}
                    value={oldPassword}
                />
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">새 비밀번호</p>
                <input
                    className="input-88"
                    type="password"
                    onChange={(e) => {
                        changeNewPassword(e);
                    }}
                    value={newPassword}
                />
            </div>
            <div className="flex h-12 my-2 items-center justify-center">
                <p className="w-16 text-xl me-8 text-end">새 비밀번호 확인</p>
                <input
                    className="input-88"
                    type="password"
                    onChange={(e) => {
                        changeNewPasswordConfirm(e);
                    }}
                    value={newPasswordConfirm}
                />
            </div>
            <div
                className="w-88 py-3 px-3 my-2 rounded text-xl color-bg-blue1 text-white text-center cursor-pointer hover:bg-sky-300"
                onClick={saveUser}
            >
                변경사항 저장
            </div>
            <div
                className="w-88 py-3 px-3 my-2 rounded text-xl color-bg-yellow2 text-center cursor-pointer hover:bg-yellow-300"
                onClick={modifyPassword}
            >
                비밀번호 변경
            </div>
            <div
                className="w-88 py-3 px-3 my-2 rounded text-xl color-bg-red2 text-white text-center cursor-pointer hover:bg-red-300"
                onClick={deleteUserState}
            >
                회원 탈퇴
            </div>
        </section>
    );
}
