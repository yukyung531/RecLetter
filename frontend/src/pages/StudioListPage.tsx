import studio from '../dummy-datas/studioList.json';
import StudioCard from '../components/StudioCard';
import { useState, useEffect } from 'react';
import { StudioInfo } from '../types/type';
import { Link, useNavigate } from 'react-router-dom';
import { getStudio, studioDetail } from '../api/studio';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginState,
    studioNameState,
    studioState,
} from '../util/counter-slice';
import { httpStatusCode } from '../util/http-status';
import StudioFinishCard from '../components/StudioFinishCard';

export default function StudioListPage() {
    const [studioList, setStudioList] = useState<StudioInfo[]>([]);
    const [createStudioList, setCreateStudioList] = useState<StudioInfo[]>([]);
    const [attendStudioList, setAttendStudioList] = useState<StudioInfo[]>([]);
    const [finishStudioList, setFinishStudioList] = useState<StudioInfo[]>([]);

    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        const token = localStorage.getItem('access-token');
        if (loginValue === 'true' && isLogin) {
            if (token) {
                /** GET 스튜디오 리스트 가져오기 API */
                const makeStudioListAPI = async () => {
                    await getStudio(token)
                        .then((res) => {
                            console.log(res);
                            if (res.status === httpStatusCode.OK) {
                                setStudioList(res.data.studioInfoList);
                                setFinishStudioList([]);
                                setCreateStudioList([]);
                                setAttendStudioList([]);
                                const studioDivide = res.data.studioInfoList;
                                studioDivide.map(
                                    (studio: StudioInfo, studiokey: number) => {
                                        if (studio.isCompleted) {
                                            setFinishStudioList((prev) => [
                                                ...prev,
                                                studio,
                                            ]);
                                        } else if (studio.isStudioOwner) {
                                            setCreateStudioList((prev) => [
                                                ...prev,
                                                studio,
                                            ]);
                                        } else if (!studio.isStudioOwner) {
                                            setAttendStudioList((prev) => [
                                                ...prev,
                                                studio,
                                            ]);
                                        }
                                    }
                                );
                            }
                        })
                        .catch((e: Error) =>
                            console.log('방 조회에 오류가 생겼습니다.')
                        );
                };
                dispatch(studioState(''));
                dispatch(studioNameState(''));
                makeStudioListAPI();
            }
            dispatch(loginState(true));
        }
        if (loginValue === 'false' || !loginValue || !token) {
            navigate(`/`);
        }
    }, [isLogin]);
    /** 리덕스 설정 */

    /** 카드를 클릭 했을 때 */
    const onClickSCard = (studioId: number) => {
        // viewStudioDetailAPI(studioId);
        navigate(`/studiomain/${studioId}`);
    };

    /** 방 생성 Element. 3개 이상이면 사라지는 구문 */
    const createElement = () => {
        if (createStudioList.length >= 3) {
            return <></>;
        } else {
            return (
                <Link
                    to="/create"
                    className="border-dashed border-2 rounded-lg text-xl border-gray-600 w-30per h-32 my-2 flex items-center justify-center"
                >
                    + 방 생성
                </Link>
            );
        }
    };

    //스튜디오 정보 불러오기

    return (
        <section className="relative w-full base-height flex mt-14 ml-8">
            <ul className="w-3/5 flex flex-col items-center ">
                <li className=" w-5/6 pt-12">
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold">
                            내가 생성한 스튜디오
                        </p>
                        <div className="flex items-center">
                            <p className="mx-2 color-text-darkgray">편집</p>
                            <p className="mx-2 color-text-main">취소</p>
                        </div>
                    </div>
                    <div className="w-full h-1 color-bg-main my-2" />
                    <div className="flex my-4 flex-wrap">
                        {createElement()}
                        {createStudioList.map((studio) => {
                            return (
                                <StudioCard
                                    key={studio.studioId}
                                    props={studio}
                                    onClick={() =>
                                        onClickSCard(studio.studioId)
                                    }
                                />
                            );
                        })}
                    </div>
                </li>
                <li className=" w-5/6 pt-12">
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold">참여중인 스튜디오</p>
                    </div>
                    <div className="w-full h-1 color-bg-main my-2 color-bg-lightgray1" />
                    <div className="flex my-4 flex-wrap">
                        {attendStudioList.map((studio) => {
                            return (
                                <StudioCard
                                    key={studio.studioId}
                                    props={studio}
                                    onClick={() =>
                                        onClickSCard(studio.studioId)
                                    }
                                />
                            );
                        })}
                    </div>
                </li>
            </ul>
            <div className="w-2/5 color-bg-yellowbg">
                <div className="w-5/6 py-12 ps-4">
                    <div className="flex items-center">
                        <span className="material-symbols-outlined">mail</span>
                        <p className="mx-2 text-2xl font-bold">완성된 비디오</p>
                    </div>
                    <div className="flex my-4 flex-wrap">
                        {finishStudioList.map((studio) => {
                            return (
                                <StudioFinishCard
                                    key={studio.studioId}
                                    props={studio}
                                    onClick={() =>
                                        onClickSCard(studio.studioId)
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
