import studio from '../dummy-datas/studioList.json';
import StudioCard from '../components/StudioCard';
import { useState, useEffect } from 'react';
import { StudioInfo } from '../types/type';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteStudio, getStudio, studioDetail } from '../api/studio';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginState,
    studioNameState,
    studioState,
} from '../util/counter-slice';
import { httpStatusCode } from '../util/http-status';
import StudioFinishCard from '../components/StudioFinishCard';
import { getlastPath } from '../util/get-func';
import SuccessModal from '../components/SuccessModal';
import StudioDeleteCheck from '../components/StudioDeleteCheck';

export default function StudioListPage() {
    const [studioList, setStudioList] = useState<StudioInfo[]>([]);
    const [createStudioList, setCreateStudioList] = useState<StudioInfo[]>([]);
    const [attendStudioList, setAttendStudioList] = useState<StudioInfo[]>([]);
    const [finishStudioList, setFinishStudioList] = useState<StudioInfo[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [listTab, setListTab] = useState<number>(0);
    const [deleteList, setDeleteList] = useState<string[]>([]);

    //모달창 활성화
    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    //삭제확인창 활성화
    const [isDeleteCheck, setIsDeleteCheck] = useState<boolean>(false);

    const closeDeleteCheckModal = () => {
        setIsDeleteCheck(false);
    };

    const token = localStorage.getItem('access-token');
    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //영상 완성 요청 후였을 시, 완성 탭으로
    const { state } = useLocation();

    useEffect(() => {
        if (state === 'letterCreated') {
            setListTab(1);
        }
    }, []);

    useEffect(() => {
        if (isLogin) {
            if (token) {
                dispatch(studioState([]));
                dispatch(studioNameState(''));
                makeStudioListAPI();
            }
            dispatch(loginState(true));
        }
        if (!token || !isLogin) {
            dispatch(loginState(false));
            navigate('/login');
        }
    }, [isLogin]);
    /** 리덕스 설정 */

    /** GET 스튜디오 리스트 가져오기 API */
    const makeStudioListAPI = async () => {
        if (token)
            await getStudio(token)
                .then((res) => {
                    // console.log(res);
                    if (res.status === httpStatusCode.OK) {
                        setStudioList(res.data.studioInfoList);
                        setFinishStudioList([]);
                        setCreateStudioList([]);
                        setAttendStudioList([]);
                        const studioDivide = res.data.studioInfoList;
                        //일단 정렬 먼저
                        const sortedStudioDivide = studioDivide.sort(
                            (studioA: any, studioB: any) => {
                                return (
                                    new Date(studioA.expireDate).getDate() -
                                    new Date(studioB.expireDate).getDate()
                                );
                            }
                        );
                        //그 후 분류
                        sortedStudioDivide.map(
                            (studio: StudioInfo, studiokey: number) => {
                                if (
                                    studio.studioStatus === 'COMPLETE' ||
                                    studio.studioStatus === 'ENCODING'
                                ) {
                                    setFinishStudioList((prev) => [
                                        ...prev,
                                        studio,
                                    ]);
                                } else if (studio.isStudioOwner) {
                                    setCreateStudioList((prev) => [
                                        ...prev,
                                        studio,
                                    ]);
                                }
                                if (
                                    studio.studioStatus === 'INCOMPLETE' ||
                                    studio.studioStatus === 'FAIL'
                                ) {
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

    /** 스튜디오 삭제인데 스튜디오 다수 삭제가 필요할지도 */
    const deleteStudioList = async () => {
        let deleteString = '';
        deleteList.map((item) => {
            deleteString = deleteString + item + ',';
        });
        deleteString = deleteString.slice(0, -1);
        await deleteStudio(deleteString).then((res) => {
            if (res.status === httpStatusCode.OK) {
                setEditMode(false);
                setDeleteList([]);
                makeStudioListAPI();
                setIsModalActive(true);
            }
        });
    };

    /** closeModal()
     *  모달창 닫기
     */
    const closeModal = () => {
        setIsModalActive(false);
    };

    /** 카드를 클릭 했을 때 */
    const onClickSCard = (studioId: string) => {
        if (editMode) {
            let flag = false;
            deleteList.map((item) => {
                if (item === studioId) {
                    flag = true;
                }
            });
            if (!flag) {
                setDeleteList([...deleteList, studioId]);
            } else {
                setDeleteList(deleteList.filter((item) => item !== studioId));
            }
        } else {
            navigate(`/studiomain/${studioId}`);
        }
    };
    const onMoveFinish = (
        studioId: string,
        studioTitle: string,
        studioState: string
    ) => {
        if (studioState === 'COMPLETE') {
            navigate(`/letterfinish/${studioId}`);
        } else if (studioState === 'ENCODING') {
            alert('인코딩이 진행되고있습니다. 잠시 후 다시 시작해주세요');
        } else {
            alert('오류가 발생하였습니다. 잠시 후 다시 시도해주세요');
        }
    };
    const changeListTab = (num: number) => {
        setListTab(num);
    };

    /** 방 생성 Element. 3개 이상이면 사라지는 구문 */
    const createElement = () => {
        if (createStudioList.length >= 3) {
            return (
                <div className="rounded-lg text-xl mt-2 my-6 px-4 py-1 flex items-center justify-center text-white color-bg-main">
                    방 생성은 3개까지 가능합니다
                </div>
            );
        } else {
            return (
                <Link
                    to="/create"
                    className="rounded-lg text-xl mt-2 my-6 px-4 py-1 flex items-center justify-center text-white color-bg-main btn-animation"
                >
                    + 새로운 스튜디오 생성
                </Link>
            );
        }
    };
    /** 편집 Element */
    const editElement = () => {
        if (editMode && listTab === 0) {
            return (
                <div className="flex items-center">
                    {deleteList.length > 0 && (
                        <p
                            className="mx-2 color-text-main cursor-pointer"
                            onClick={() => setIsDeleteCheck(true)}
                        >
                            삭제
                        </p>
                    )}
                    {deleteList.length === 0 && (
                        <p className="mx-2 color-text-darkgray cursor-default">
                            삭제
                        </p>
                    )}
                    <p
                        className="mx-2 color-text-main cursor-pointer hover:color-text-subbold"
                        onClick={() => {
                            setEditMode(false);
                            setDeleteList([]);
                        }}
                    >
                        취소
                    </p>
                </div>
            );
        } else if (listTab === 0) {
            return (
                <div className="flex items-center">
                    {createStudioList.length > 0 ? (
                        <p
                            className="mx-2 color-text-main cursor-pointer hover:color-text-subbold"
                            onClick={() => {
                                setEditMode(true);
                            }}
                        >
                            편집
                        </p>
                    ) : (
                        <p></p>
                    )}
                </div>
            );
        }
    };

    //스튜디오 정보 불러오기

    return (
        <section className="relative w-full items-center flex flex-col mt-14">
            {isModalActive ? (
                <SuccessModal onClick={closeModal} message="삭제되었습니다." />
            ) : (
                <></>
            )}
            {isDeleteCheck ? (
                <StudioDeleteCheck
                    onClickCancel={closeDeleteCheckModal}
                    onClickOK={() => {
                        setIsDeleteCheck(false);
                        deleteStudioList();
                    }}
                />
            ) : (
                <></>
            )}
            <div className="relative w-4/5 h-5/6 flex flex-col justify-center items-center">
                <div className="relative w-full flex justify-between mt-12">
                    <div className="flex items-center">
                        <p
                            className="text-2xl px-2 py-2 cursor-pointer"
                            style={
                                listTab === 0
                                    ? { borderBottom: '2px solid #ff4954' }
                                    : {}
                            }
                            onClick={() => {
                                changeListTab(0);
                            }}
                        >
                            영상 스튜디오
                        </p>
                        <p
                            className="text-2xl mx-4 px-2 py-2 cursor-pointer"
                            style={
                                listTab === 1
                                    ? { borderBottom: '2px solid #ff4954' }
                                    : {}
                            }
                            onClick={() => {
                                changeListTab(1);
                            }}
                        >
                            완성된 편지
                        </p>

                        <div
                            className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 mb-4 me-2 cursor-pointer btn-animation -bottom-2"
                            onClick={() => {
                                makeStudioListAPI();
                            }}
                        >
                            <img src="/src/assets/icons/reload.png" alt="" />
                        </div>
                        {editElement()}
                        <div className="absolute w-full border bottom-2 -z-10"></div>
                    </div>

                    <div className="flex items-center justify-center text-center">
                        {createElement()}
                    </div>
                </div>

                {/* 영상 스튜디오 */}
                {listTab === 0 ? (
                    <ul className="w-[98%] h-full flex flex-col items-center ">
                        {attendStudioList.length === 0 ? (
                            <div className="my-auto">
                                <img
                                    className="relative mx-auto mb-8 left-4"
                                    src="/src/assets/images/nostudio.png"
                                    alt=""
                                />
                                <div className="mx-auto mb-16 flex flex-col justify-center items-center text-2xl text-gray-400">
                                    <p className="w-fit">
                                        아직 참여 중인 스튜디오가 없습니다
                                    </p>
                                    <p className="w-fit text-center">
                                        스튜디오에서 영상 편지를 만들어 당신의
                                        마음을 전해주세요
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <li className=" w-full box-border">
                            <div className="flex w-full my-4 flex-wrap box-content">
                                {attendStudioList.map((studio) => {
                                    return (
                                        <StudioCard
                                            key={studio.studioId}
                                            props={studio}
                                            editMode={editMode}
                                            onClick={() =>
                                                onClickSCard(studio.studioId)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </li>
                    </ul>
                ) : (
                    <></>
                )}
                {listTab === 1 ? (
                    <ul className="w-full h-full flex flex-col items-center ">
                        {finishStudioList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center my-auto">
                                <img
                                    className="w-20 my-6"
                                    src="/src/assets/icons/empty-face.png"
                                    alt=""
                                />
                                <p className="text-center text-2xl text-gray-400">
                                    아직 완성된 영상이 없어요
                                </p>
                                <p className="text-center text-2xl text-gray-400">
                                    영상을 제작하면 완성된 비디오에 저장이됩니다
                                </p>
                                <p className="mb-20 text-center text-2xl text-gray-400">
                                    스튜디오에 참여하고 영상을 만들어보세요
                                </p>
                            </div>
                        ) : (
                            <li className=" w-full ">
                                <div className="flex flex-wrap">
                                    {finishStudioList.map((studio) => {
                                        return (
                                            <StudioFinishCard
                                                key={studio.studioId}
                                                props={studio}
                                                onClick={() =>
                                                    onMoveFinish(
                                                        studio.studioId,
                                                        studio.studioTitle,
                                                        studio.studioStatus
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </li>
                        )}
                    </ul>
                ) : (
                    <></>
                )}
            </div>
        </section>
    );
}
