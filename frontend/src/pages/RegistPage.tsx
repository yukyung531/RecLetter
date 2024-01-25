import { BaseSyntheticEvent, useState } from 'react';
import { checkId, requestEmail } from '../api/auth';
import { getUser } from '../api/user';

export default function RegistPage() {
    const [inputId, setInputId] = useState<string>('');
    const [inputEmail, setInputEmail] = useState<string>('');
    const [idCheck, setIdCheck] = useState<boolean>(false);
    const [emailCheck, setEmailCheck] = useState<boolean>(false);
    /** ID 변화 감지 */
    const changeId = (e: BaseSyntheticEvent) => {
        setInputId(e.target.value);
    };
    /** 이메일 변화 감지 */
    const changeEmail = (e: BaseSyntheticEvent) => {
        setInputEmail(e.target.value);
    };

    /** 아이디 체크 함수 */
    const checkIdAPI = async () => {
        await checkId(inputId)
            .then((res) => {
                if (res.data.isDuplicated) {
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
                if (res.data.isDuplicated) {
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
            return <div>사용 가능합니다</div>;
        } else {
            return <div>사용 할 수 없습니다</div>;
        }
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
                    <input type="text" className="border" />
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
                    <input type="text" className="border" />
                    <button className="border">인증하기</button>
                </li>
                <li className="flex my-4">
                    <p className="mx-4">비밀번호</p>
                    <input type="text" className="border" />
                </li>
                <li className="flex my-4">
                    <p className="mx-4">비밀번호 확인</p>
                    <input type="text" className="border" />
                </li>
                <li className="w-full flex my-4 justify-around">
                    <a href="/" className="border p-4 bg-slate-200">
                        회원가입
                    </a>
                    <button className="border p-4 bg-blue-100">
                        구글로 회원가입
                    </button>
                </li>
            </ul>
        </section>
    );
}
