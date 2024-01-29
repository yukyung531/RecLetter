import studio from '../dummy-datas/studioList.json';
import StudioCard from '../components/StudioCard';
import { useState, useEffect } from 'react';
import { StudioInfo } from '../types/type';
import { Link, useNavigate } from 'react-router-dom';
import { getStudio, studioDetail } from '../api/studio';
import { useDispatch, useSelector } from 'react-redux';
import { loginState, studioState } from '../util/counter-slice';

export default function StudioListPage() {
    const [studioList, setStudioList] = useState<StudioInfo[]>([]);

    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        if (loginValue === 'true') {
            dispatch(loginState(true));
            console.log(isLogin);
        }
        if (loginValue === 'false' || !loginValue) {
            navigate(`/`);
        }
    }, [isLogin]);
    /** 리덕스 설정 */

    /** 카드를 클릭 했을 때 */
    const onClickSCard = (studioId: number) => {
        // viewStudioDetailAPI(studioId);
        navigate(`/studiomain?id=${studioId}`);
    };

    /** GET 스튜디오 리스트 조회 API */
    const makeStudioListAPI = async () => {
        await getStudio()
            .then((res) => {
                setStudioList(res.data.studioInfoList);
                console.log(studioList);
            })
            .catch((e: Error) => console.log('방 생성에 오류가 생겼습니다.'));
    };
    /** GET 스튜디오 상세 정보 조회 API */
    // const viewStudioDetailAPI = async () => {
    //     await studioDetail(studioId:string)
    //         .then(() => {
    //             navigator(`/studiomain?id=${studioId}`);
    //         })
    //         .catch((e: Error) => {
    //             console.log('오류가 발생했습니다.');
    //         });
    // };

    //스튜디오 정보 불러오기
    useEffect(() => {
        const newStudioList: StudioInfo[] = [];
        makeStudioListAPI();
        dispatch(studioState(''));
    }, []);

    return (
        <section className="relative section-top pt-20 mt-16 ml-8">
            <ul className="w-full flex flex-col">
                <li className="text-2xl">
                    <p className="font-bold">내가 생성한 스튜디오</p>
                    <div className="flex my-4">
                        <Link
                            to="/create"
                            className="border-dotted border-4 border-gray-600 image-select-size flex items-center justify-center"
                        >
                            + 방 생성
                        </Link>
                        {studioList.map((studio) => {
                            if (studio.isStudioOwner && !studio.studioStatus) {
                                return (
                                    <StudioCard
                                        key={studio.studioId}
                                        props={studio}
                                        onClick={() =>
                                            onClickSCard(studio.studioId)
                                        }
                                    />
                                );
                            }
                        })}
                    </div>
                </li>
                <li className="text-2xl">
                    <p className="font-bold">참여중인 스튜디오</p>
                    <div className="flex my-4">
                        {studioList.map((studio) => {
                            if (studio.isUpload && !studio.studioStatus) {
                                return (
                                    <StudioCard
                                        key={studio.studioId}
                                        props={studio}
                                        onClick={() =>
                                            onClickSCard(studio.studioId)
                                        }
                                    />
                                );
                            }
                        })}
                    </div>
                </li>
                <li className="text-2xl">
                    <p className="font-bold">완성된 비디오</p>
                    <div className="flex my-4">
                        {studioList.map((studio) => {
                            if (studio.studioStatus) {
                                return (
                                    <StudioCard
                                        key={studio.studioId}
                                        props={studio}
                                        onClick={() =>
                                            onClickSCard(studio.studioId)
                                        }
                                    />
                                );
                            }
                        })}
                    </div>
                </li>
            </ul>
        </section>
    );
}
