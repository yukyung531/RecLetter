import VideoCard from '../components/VideoCard';
import { useState, useEffect, BaseSyntheticEvent } from 'react';
import { StudioDetail, ClipInfo, UserInfo } from '../types/type';
import { useNavigate, Link } from 'react-router-dom';
import DeleteCheckWindow from '../components/DeleteCheckWindow';
import { connect, disconnect, unSubscribe } from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';
import { studioNameState, studioState } from '../util/counter-slice';
import { enterStudio, modifyStudioTitle, studioDetail } from '../api/studio';
import { getUser } from '../api/user';
import { deleteClip } from '../api/clip';
import { httpStatusCode } from '../util/http-status';

export default function StudioMainPage() {
    //mode 0: 영상, 1: 관리
    const [mode, setMode] = useState<number>(0);

    //영상 편집 여부
    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    //영상 삭제 여부
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteStateId, setDeleteStateId] = useState<number>(-1);

    //영상 정보 불러오기
    // const [clipInfoList, setClipInfoList] = useState<ClipInfo[]>([]);
    const [studioDetailInfo, setStudioDetailInfo] = useState<StudioDetail>({
        studioId: '',
        studioTitle: '',
        isCompleted: false,
        studioOwner: '',
        clipInfoList: [],
        studioFrameId: -1,
        studioFontId: -1,
        studioBGMId: -1,
    });

    //유저 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userId: '',
        userNickname: '',
        userEmail: '',
    });

    //현재 선택한 비디오(비디오 미리보기)
    const [selectedVideo, setSelectedVideo] = useState<ClipInfo>({
        clipId: -1,
        clipTitle: '',
        clipOwner: '',
        clipLength: -1,
        clipThumbnail: '',
        clipUrl: '',
        clipOrder: -1,
        clipVolume: -1,
        clipContent: '',
    });

    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    //영상 서버로부터 불러오기
    useEffect(() => {
        const loginValue = localStorage.getItem('is-login');
        const token = localStorage.getItem('access-token');
        if (loginValue === 'true' && isLogin) {
            //API 불러오는 함수로 clipInfo를 받아옴
            //우선 url query String으로부터 스튜디오 상세 정보 받아오기
            const splitUrl = document.location.href.split('/');
            const studioId = splitUrl[splitUrl.length - 1];
            if (studioId !== null) {
                const getDetail = async (studioId: string) => {
                    await studioDetail(studioId).then((res) => {
                        if (res.status === httpStatusCode.OK) {
                            dispatch(studioState(studioId));
                            dispatch(studioNameState(res.data.studioTitle));
                            console.log(res.data);
                            setStudioDetailInfo(res.data);
                        }
                    });
                    return;
                };

                const enterStudioAPI = async (studioId: string) => {
                    await enterStudio(studioId)
                        .then((res) => {
                            console.log(res);
                            getDetail(studioId);
                        })
                        .catch(() => {
                            console.log('오류떠서 재실행');
                            getDetail(studioId);
                        });
                };
                enterStudioAPI(studioId);
            }

            //유저정보 불러오기
            const getUserInfo = async () => {
                const resuser = await getUser();
                const tempObj = { ...resuser.data };
                // console.log(tempObj);
                setUserInfo({
                    userId: tempObj.userId,
                    userNickname: tempObj.userNickname,
                    userEmail: tempObj.userEmail,
                });
            };
            getUserInfo();
        }
        if (loginValue === 'false' || !loginValue || !token) {
            navigator(`/login`);
        }

        /** 페이지 새로고침 전에 실행 할 함수 */
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            disconnect();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            disconnect();
        };
    }, []);

    //편집창으로 이동
    const onClickEdit = (clipId: number) => {
        navigator(`/clipedit?id=${clipId}`);
    };

    //요소 삭제
    const onDelete = (clipId: number) => {
        setIsDeleting(true);
        setDeleteStateId(clipId);
    };

    /** chooseDelete()
     * 삭제창에서 삭제를 선택한 경우
     * 삭제를 하도록 한다.
     */
    const chooseDelete = () => {
        if (
            studioDetailInfo !== null &&
            studioDetailInfo.clipInfoList !== undefined
        ) {
            setStudioDetailInfo((prevValue) => {
                const prevList: ClipInfo[] = prevValue?.clipInfoList;
                //탐색 시작
                for (let i = 0; i < prevList.length; i++) {
                    if (prevList[i].clipId === deleteStateId) {
                        //발견하면, axios 삭제 요청 보낸 후 삭제
                        deleteClip(prevList[i].clipId)
                            .then((res) => {
                                if (res.status === httpStatusCode.OK) {
                                    console.log('삭제 완료');
                                } else {
                                    console.log('오류');
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        prevList.splice(i, 1);
                        break;
                    }
                }
                const newList: ClipInfo[] = [...prevList];
                const newValue = { ...prevValue };
                newValue.clipInfoList = newList;
                return newValue;
            });
        }

        setDeleteStateId(-1);
        setIsDeleting(false);
    };

    /** chooseNotDelete()
     * 삭제 확인 창에서 취소를 선택할 경우
     * 삭제창을 닫기만 한다.
     */
    const chooseNotDelete = () => {
        setDeleteStateId(-1);
        setIsDeleting(false);
    };

    /**selectVideo(clipId : number)
     * 비디오 카드를 눌렀을 때, 해당 비디오가 미리보기로 보여지도록 합니다.
     * @param clipId
     * @returns
     */
    const selectVideo = (clipId: number) => {
        console.log(clipId);
        for (let i = 0; i < studioDetailInfo.clipInfoList.length; i++) {
            if (studioDetailInfo.clipInfoList[i].clipId === clipId) {
                setSelectedVideo(studioDetailInfo.clipInfoList[i]);
                return;
            }
        }
    };

    //좌측 사이드바
    let leftSideBar = (
        <div className="w-4/5 h-full flex flex-col items-center px-4 py-4 overflow-y-scroll ">
            <div className="w-full flex justify-start text-xl ">
                <p>선택된 영상</p>
            </div>

            {studioDetailInfo.clipInfoList ? (
                studioDetailInfo.clipInfoList.map((clip) => {
                    if (clip.clipOrder != -1) {
                        return (
                            <VideoCard
                                key={clip.clipId}
                                onDelete={() => {
                                    onDelete(clip.clipId);
                                }}
                                onClick={() => {
                                    onClickEdit(clip.clipId);
                                }}
                                selectVideo={() => {
                                    selectVideo(clip.clipId);
                                }}
                                props={clip}
                                presentUser={userInfo.userId}
                            />
                        );
                    }
                })
            ) : (
                <></>
            )}
            <div className="w-full flex justify-start text-xl ">
                <p>선택되지 않은 영상</p>
            </div>
            {studioDetailInfo ? (
                studioDetailInfo.clipInfoList.map((clip) => {
                    if (clip.clipOrder == -1) {
                        return (
                            <VideoCard
                                key={clip.clipId}
                                onDelete={() => {
                                    onDelete(clip.clipId);
                                }}
                                onClick={() => {
                                    onClickEdit(clip.clipId);
                                }}
                                selectVideo={() => {
                                    selectVideo(clip.clipId);
                                }}
                                props={clip}
                                presentUser={userInfo.userId}
                            />
                        );
                    }
                })
            ) : (
                <></>
            )}
        </div>
    );
    if (mode == 1) {
        leftSideBar = (
            <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                <div className="w-full flex justify-start text-xl ">
                    <p>참여자 관리 창입니다.</p>
                </div>
            </div>
        );
    }

    //event handling(메뉴 누르기)
    const onPressMovieEdit = () => {
        setMode(0);
    };

    const onPressChecklist = () => {
        setMode(1);
    };

    //스튜디오 이름 변경
    const handleStudioEditing = () => {
        setIsEditingName(true);
    };

    const handleStudioName = () => {
        //DB에 변경 요청
        putStudiotitleAPI();
        setIsEditingName(false);
    };

    const updateStudioName = (event: BaseSyntheticEvent) => {
        if (studioDetailInfo !== null) {
            const newValue = { ...studioDetailInfo };
            newValue.studioTitle = event.target.value;
            setStudioDetailInfo(newValue);
        }
    };

    /** 스튜디오 제목 수정 API */
    const putStudiotitleAPI = async () => {
        const id = studioDetailInfo.studioId;
        const title = studioDetailInfo.studioTitle;
        console.log(id);
        await modifyStudioTitle(id, title).then((res) => {
            if (res.status === httpStatusCode.OK) {
                console.log('제목이 수정되었습니닷!!!!');
            }
        });
    };

    /** onClickRecodePage
     * useNavigate를 이용하여 영상 녹화 화면으로 이동
     */
    const onClickRecodePage = () => {
        navigator(`/cliprecode/${studioDetailInfo.studioId}`);
    };

    /** 리스트로 이동 */
    const moveStudioList = () => {
        navigator(`/studiolist`);
    };

    return (
        <section className="relative section-top pt-14 ">
            {isDeleting ? (
                <DeleteCheckWindow
                    onClickOK={chooseDelete}
                    onClickCancel={chooseNotDelete}
                />
            ) : (
                <></>
            )}

            {/* 중앙 섹션 */}
            <div className="flex w-full h-full">
                {/* 좌측부분 */}
                <div className="w-1/4 h-full flex border border-r-2">
                    {/* 카테고리 */}
                    <div className="relative w-1/6 color-text-main color-bg-lightgray1">
                        <div
                            className={`w-full h-16  flex flex-col justify-center items-center cursor-pointer `}
                            onClick={onPressMovieEdit}
                        >
                            <div
                                className={`${
                                    mode === 0 ? 'h-16 categori-selected' : ''
                                }`}
                            ></div>
                            <span className="material-symbols-outlined text-3xl">
                                movie_edit
                            </span>
                            <p className="font-bold">영상</p>
                        </div>
                        <div
                            className={`h-16 flex flex-col justify-center items-center cursor-pointer `}
                            onClick={onPressChecklist}
                        >
                            <div
                                className={`${
                                    mode === 1 ? 'h-16 categori-selected ' : ''
                                }`}
                            ></div>
                            <span className="material-symbols-outlined text-3xl">
                                checklist
                            </span>
                            <p className="font-bold">관리</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    {leftSideBar}
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 h-full flex justify-between">
                    <div className="w-3/4">
                        <div className="h-16 w-full px-6  color-bg-sublight text-black flex justify-between items-center">
                            <div className="w-full flex justify-between items-center">
                                <div className="flex w-fit">
                                    {/* <span
                                        className="flex items-center text-2xl material-symbols-outlined cursor-pointer"
                                        onClick={moveStudioList}
                                    >
                                        arrow_back_ios
                                    </span> */}
                                    <input
                                        type="text"
                                        value={studioDetailInfo?.studioTitle}
                                        className="w-36 border-b-2 color-bg-sublight flex items-center text-2xl text-white ms-2"
                                        onChange={updateStudioName}
                                    />
                                    <span
                                        className="material-symbols-outlined mx-2 text-2xl text-white cursor-pointer"
                                        onClick={handleStudioName}
                                    >
                                        edit
                                    </span>
                                </div>

                                <div className="relative right-24 px-6 my-2 flex items-center justify-center bg-white border-2 rounded-md color-text-main color-border-main cursor-pointer hover:color-bg-sublight hover:text-white hover:border-white">
                                    <span className="material-symbols-outlined text-4xl">
                                        arrow_right
                                    </span>
                                    <p className="text-xl font-bold">
                                        전체 편지 자동 재생
                                    </p>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className=" flex flex-col justify-center items-center">
                            <div className="w-full  flex justify-start items-center">
                                <p className="mt-8 ms-12 mb-4 text-2xl">
                                    {selectedVideo.clipTitle}
                                </p>
                            </div>
                            <video
                                src={selectedVideo.clipUrl}
                                crossOrigin="anonymous"
                                controls
                                style={{ width: '800px', height: '480px' }}
                            />
                            <div className="w-full flex justify-center items-center my-4 px-12">
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    play_circle
                                </span>
                                <div className="w-full h-2 bg-black"></div>
                            </div>
                        </div>
                    </div>

                    {/* (영상 리스트, 참가자 관리) */}
                    <div className="w-1/4 p-2 border border-l-2">
                        <div className="w-full px-2 flex flex-col justify-center items-center">
                            <a className=" w-52 text-center my-2 p-1 rounded-lg text-xl color-bg-yellow2 text-black border border-black">
                                영상편지 완성하기
                            </a>
                            <div
                                className="w-full h-24 mx-4 my-2 color-bg-main text-white text-xl flex flex-col justify-center items-center border rounded-md cursor-pointer hover:color-bg-subbold"
                                onClick={onClickRecodePage}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    photo_camera
                                </span>
                                <p>새 영상 촬영하기</p>
                            </div>
                            <Link
                                to={`/lettermake/${studioDetailInfo.studioId}`}
                                className="w-full h-24 mx-4 my-2 color-border-main color-text-main text-xl flex flex-col justify-center items-center border rounded-md hover:color-bg-sublight hover:color-border-sublight hover:text-white"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    theaters
                                </span>
                                <p>영상편지 편집하기</p>
                            </Link>
                        </div>
                        {/* 할당된 영상 리스트 */}
                        <div className="px-4 mt-16">
                            <div className="w-full flex justify-start text-xl ">
                                <p>나의 영상</p>
                            </div>
                            {studioDetailInfo.clipInfoList ? (
                                studioDetailInfo.clipInfoList.map((clip) => {
                                    if (clip.clipOwner === userInfo.userId) {
                                        return (
                                            <VideoCard
                                                key={clip.clipId}
                                                onDelete={() => {
                                                    onDelete(clip.clipId);
                                                }}
                                                onClick={() => {
                                                    onClickEdit(clip.clipId);
                                                }}
                                                selectVideo={() => {
                                                    selectVideo(clip.clipId);
                                                }}
                                                props={clip}
                                                presentUser={userInfo.userId}
                                            />
                                        );
                                    }
                                })
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
