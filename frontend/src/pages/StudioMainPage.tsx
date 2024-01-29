import VideoCard from '../components/VideoCard';
import studioDetail from '../dummy-datas/studioDetail.json';
import { useState, useEffect, BaseSyntheticEvent } from 'react';
import { StudioDetail, ClipInfo } from '../types/type';
import { useNavigate } from 'react-router-dom';
import DeleteCheckWindow from '../components/DeleteCheckWindow';
import { connect } from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';
import { studioState } from '../util/counter-slice';

export default function StudioMainPage() {
    const navigator = useNavigate();

    //로그인 유저 정보 불러오기
    const userId: string | null = localStorage.getItem('userId');

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
        studioId: -1,
        studioTitle: '',
        studioStatus: false,
        studioOwner: '',
        clipInfoList: [],
        studioFrame: -1,
        studioFont: -1,
        studioBGM: -1,
        studioChecklist: -1,
    });

    /** 리덕스 함수 */
    // const studioCurrentId = useSelector(
    //     (state: any) => state.loginFlag.studioId
    // );
    const dispatch = useDispatch();

    //영상 서버로부터 불러오기
    useEffect(() => {
        //API 불러오는 함수로 clipInfo를 받아옴
        //우선 url query String으로부터 스튜디오 상세 정보 받아오기
        const studioId: string | null = new URLSearchParams(
            location.search
        ).get('id');
        if (studioId !== null) {
            const studioIdNum: number = Number(studioId);
            dispatch(studioState(studioId));

            for (let i = 0; i < studioDetail.length; i++) {
                if (studioDetail[i].studioId === studioIdNum) {
                    //해당되는 유저 정보 찾아 업데이트
                    setStudioDetailInfo(studioDetail[i]);
                    // setClipInfoList(studioDetail[i].clipInfoList);
                    break;
                }
            }
        }
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

    const chooseDelete = () => {
        if (
            studioDetailInfo !== null &&
            studioDetailInfo.clipInfoList !== undefined
        ) {
            setStudioDetailInfo((prevValue) => {
                const prevList: ClipInfo[] = prevValue?.clipInfoList;
                for (let i = 0; i < prevList.length; i++) {
                    if (prevList[i].clipId === deleteStateId) {
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

    const chooseNotDelete = () => {
        setDeleteStateId(-1);
        setIsDeleting(false);
    };

    //좌측 사이드바
    let leftSideBar = (
        <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
            <div className="w-full flex justify-start text-xl ">
                <p>선택된 영상</p>
            </div>
            <div className="px-6 my-2 flex items-center justify-center border-2 rounded-md color-border-blue1 cursor-pointer">
                <span className="material-symbols-outlined text-4xl color-text-blue3">
                    arrow_right
                </span>
                <p className="text-xl font-bold color-text-blue3">
                    전체 편지 자동 재생
                </p>
            </div>
            {studioDetailInfo.clipInfoList.map((clip) => {
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
                            props={clip}
                        />
                    );
                }
            })}
            <div className="w-full flex justify-start text-xl ">
                <p>선택되지 않은 영상</p>
            </div>
            {studioDetailInfo.clipInfoList.map((clip) => {
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
                            props={clip}
                        />
                    );
                }
            })}
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
        setIsEditingName(false);
    };

    const updateStudioName = (event: BaseSyntheticEvent) => {
        if (studioDetailInfo !== null) {
            const newValue = { ...studioDetailInfo };
            newValue.studioTitle = event.target.value;
            setStudioDetailInfo(newValue);
        }
    };

    /** onClickRecodePage
     * useNavigate를 이용하여 영상 녹화 화면으로 이동
     */
    const onClickRecodePage = () => {
        navigator(
            `/cliprecode?title=${studioDetailInfo.studioTitle}&id=${studioDetailInfo.studioId}`
        );
    };

    return (
        <section className="relative section-top pt-16 ">
            {isDeleting ? (
                <DeleteCheckWindow
                    onClickOK={chooseDelete}
                    onClickCancel={chooseNotDelete}
                />
            ) : (
                <></>
            )}
            <div className="h-20 w-full px-12 bg-black text-white flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    {!isEditingName ? (
                        <p className="text-3xl w-64">
                            {studioDetailInfo
                                ? studioDetailInfo.studioTitle
                                : 'new studio'}
                        </p>
                    ) : (
                        <input
                            type="text"
                            value={studioDetailInfo?.studioTitle}
                            className="text-3xl text-black w-64"
                            onChange={updateStudioName}
                        />
                    )}
                    <div className="ml-28" />

                    {!isEditingName ? (
                        <span
                            className="material-symbols-outlined mx-2 text-3xl"
                            onClick={handleStudioEditing}
                        >
                            edit
                        </span>
                    ) : (
                        <span
                            className="material-symbols-outlined mx-2 text-3xl"
                            onClick={handleStudioName}
                        >
                            check_box
                        </span>
                    )}

                    <span className="material-symbols-outlined mx-2 text-3xl">
                        group_add
                    </span>
                </div>
                <a className="btn-cover color-bg-red3">영상편지 완성하기</a>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex">
                    {/* 카테고리 */}
                    <div className="w-1/5 ">
                        <div
                            className={`h-28 bg-orange-100 flex flex-col justify-center items-center ${
                                mode === 0 ? 'categori-selected' : ''
                            }`}
                            onClick={onPressMovieEdit}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                movie_edit
                            </span>
                            <p className="font-bold">영상</p>
                        </div>
                        <div
                            className={`h-28 bg-orange-100 flex flex-col justify-center items-center ${
                                mode === 1 ? 'categori-selected' : ''
                            }`}
                            onClick={onPressChecklist}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                checklist
                            </span>
                            <p className="font-bold">관리</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    {leftSideBar}
                </div>
                ;{/* 우측부분 */}
                <div className="w-3/4 editor-height bg-gray-50 flex justify-between">
                    <div className="w-3/4 px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center">
                            <p className="text-2xl">은쮸</p>
                        </div>
                        <img
                            className="bg-white border my-2"
                            style={{ width: '720px', height: '450px' }}
                            src="/src/assets/images/nothumb.png"
                        />
                        <div className="w-full flex justify-center items-center my-4">
                            <span className="material-symbols-outlined me-1 text-4xl">
                                play_circle
                            </span>
                            <span className="material-symbols-outlined me-1 text-4xl">
                                stop_circle
                            </span>
                            <div className="w-full h-2 bg-black"></div>
                        </div>
                    </div>

                    {/* (영상 리스트, 참가자 관리) */}
                    <div className="w-1/4 bg-slate-100 p-2">
                        <div className="w-full px-2 flex flex-col justify-center items-center">
                            <div
                                className="w-full h-24 mx-4 my-2 color-bg-blue3 text-white text-xl flex flex-col justify-center items-center border rounded-md"
                                onClick={onClickRecodePage}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    photo_camera
                                </span>
                                <p>새 영상 촬영하기</p>
                            </div>
                            <a
                                href="/lettermake"
                                className="w-full h-24 mx-4 my-2 color-border-blue3 color-text-blue3 text-xl flex flex-col justify-center items-center border rounded-md"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    theaters
                                </span>
                                <p>영상편지 편집하기</p>
                            </a>
                        </div>
                        {/* 할당된 영상 리스트 */}
                        <div className="px-4">
                            <div className="w-full flex justify-start text-xl ">
                                <p>나의 영상</p>
                            </div>
                            {studioDetailInfo.clipInfoList.map((clip) => {
                                if (clip.clipOwner === userId) {
                                    return (
                                        <VideoCard
                                            key={clip.clipId}
                                            onDelete={() => {
                                                onDelete(clip.clipId);
                                            }}
                                            onClick={() => {
                                                onClickEdit(clip.clipId);
                                            }}
                                            props={clip}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
