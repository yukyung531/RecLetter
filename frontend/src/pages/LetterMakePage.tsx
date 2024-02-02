import {
    useEffect,
    useState,
    useRef,
    useCallback,
    BaseSyntheticEvent,
} from 'react';
import {
    FrameType,
    Letter,
    StudioDetail,
    fontTemplate,
    UserInfo,
    ClipInfo,
    BGMTemplate,
} from '../types/type';
import { getTemplate, getFont, getBgm } from '../api/template';
import { httpStatusCode } from '../util/http-status';
import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
// import { connectSession, createSession, endSession } from '../api/openvidu';
import { getUser } from '../api/user';
// import { connect } from '../util/chat';
import ParticipantAlertWindow from '../components/ParticipantAlertWindow';
import OpenViduVideoCard from '../components/OpenViduVideoCard';
import {
    connectSessionAPI,
    createSessionAPI,
    endSessionAPI,
    isSessionExistAPI,
} from '../api/openvidu';
import { useNavigate } from 'react-router-dom';
import { getStudio, studioDetail } from '../api/studio';
import VideoCard from '../components/VideoCard';
import SelectedVideoCard from '../components/SelectedVideoCard';
import BGMCard from '../components/BGMCard';

export default function LetterMakePage() {
    const navigate = useNavigate();

    //mode - 0:영상리스트, 1:프레임, 2:텍스트, 3:오디오
    const [mode, setMode] = useState<number>(0);

    ///////////////////////////////////////////////초기 설정////////////////////////////////////////////////////////

    // //영상리스트 with 스튜디오 정보
    const [studioDetailInfo, setStudioDetailInfo] = useState<StudioDetail>({
        studioId: '',
        studioTitle: '',
        studioOwner: '',
        isCompleted: false,
        clipInfoList: [],
        studioFrameId: -1,
        studioFontId: -1,
        studioBGMId: -1,
    });

    //나중 결과물 산출용 상태 관리

    //사용 영상, 사용하지 않은 영상
    const [usedClipList, setUsedClipList] = useState<ClipInfo[]>([]);
    const [notUsedClipList, setNotUsedClipList] = useState<ClipInfo[]>([]);
    //선택된 정보들
    const [selectedBGM, setSelectedBGM] = useState<number>(1);

    // // 수정 정보
    // const [studioModify, setStudioModify] = useState<Letter>({
    //     studioId: '',
    //     usedClipList: [
    //         {
    //             clipId: '',
    //             clipVolume: 0,
    //         },
    //     ],
    //     unusedClipList: [''],
    //     studioFrameId: '',
    //     studioFont: {
    //         fontId: '',
    //         fontSize: 10,
    //         isBold: false,
    //     },
    //     studioBGM: '',
    //     studioVolume: 50,
    // });

    //프레임 리스트
    const [frameList, setFrameList] = useState<FrameType[]>([]);

    //폰트 리스트
    const [fontList, setFontList] = useState<fontTemplate[]>([]);

    //BGM 리스트
    const [bgmList, setBGMList] = useState<BGMTemplate[]>([]); //추후 구현

    // 선택한 프레임
    const [selectImgUrl, setSelectImgUrl] = useState<string>(
        '/src/assets/frames/frame1.png'
    );

    //유저 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userId: '',
        userEmail: '',
        userNickname: '',
    });

    /** 선택한 프레임 적용 */
    const selectImg = (source: string) => {
        setSelectImgUrl(source);
    };

    useEffect(() => {
        /**initSetting()
         * 초기 설정
         */
        const initSetting = async () => {
            //스튜디오 상세 정보 받아오기
            studioDetail(studioId)
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        //저장
                        setStudioDetailInfo({ ...res.data });
                        //사용 영상, 사용하지 않은 영상 리스트 출력
                        const clipList = res.data.clipInfoList;
                        const initialUsedVideo = [];
                        const nonInitialUsedVideo = [];
                        for (let i = 0; i < clipList.length; i++) {
                            if (clipList[i].clipOrder === -1) {
                                nonInitialUsedVideo.push(clipList[i]);
                            } else {
                                initialUsedVideo.push(clipList[i]);
                            }
                        }
                        setUsedClipList(initialUsedVideo);
                        setNotUsedClipList(nonInitialUsedVideo);
                    } else {
                        console.log('Network Error');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            //프레임 리스트 받아오기
            getTemplate()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        setFrameList([...res.data.frameTemplate]);
                    } else {
                        console.log('Network Error');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            //폰트 리스트 받아오기
            getFont()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        setFontList([...res.data.fontTemplate]);
                    } else {
                        console.log('Network Error!');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            //bgm 리스트 받아오기
            getBgm()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        setBGMList([...res.data.bgmTemplate]);
                    } else {
                        console.log('Network Error');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            // openvidu 화면 공유 시작
            //현재 주석 처리. 주석 풀것!!! (주석해제위치)
            // startScreenShare();
        };
        initSetting();

        //+유저 정보 불러오기
        const getUserInfo = async () => {
            const resuser = await getUser();
            const tempObj = { ...resuser.data };
            setUserInfo({
                userId: tempObj.userId,
                userEmail: tempObj.userEmail,
                userNickname: tempObj.userNickname,
            });
        };
        getUserInfo();
    }, []);

    ////////////////////////////////////////영상 순서 결정////////////////////////////////////////////////////////////
    const selectVideo = (clipId: number) => {
        //클립 제거
        const newNotSelected = notUsedClipList.filter(
            (clip) => clip.clipId !== clipId
        );
        //clip 탐색 후 사용 클립에 추가
        let selectedClip: ClipInfo = studioDetailInfo.clipInfoList[0];
        for (let i = 0; i < notUsedClipList.length; i++) {
            if (notUsedClipList[i].clipId === clipId) {
                selectedClip = notUsedClipList[i];
                break;
            }
        }
        const newSelected = [...usedClipList, selectedClip];

        //결과 반영
        setNotUsedClipList(newNotSelected);
        setUsedClipList(newSelected);
    };

    //클립 선택 취소
    const unselectClip = (clipId: number) => {
        //클립 제거
        const newSelected = usedClipList.filter(
            (clip) => clip.clipId !== clipId
        );
        //clip 탐색 후 미사용 클립에 추가
        let notSelectedClip: ClipInfo = studioDetailInfo.clipInfoList[0];
        for (let i = 0; i < usedClipList.length; i++) {
            if (usedClipList[i].clipId === clipId) {
                notSelectedClip = usedClipList[i];
                break;
            }
        }
        const newNotSelected = [...notUsedClipList, notSelectedClip];

        //결과 반영
        setNotUsedClipList(newNotSelected);
        setUsedClipList(newSelected);
    };

    //클립 볼륨 조절
    const changeVolume = (clipId: number, event: BaseSyntheticEvent) => {
        for (let i = 0; i < usedClipList.length; i++) {
            if (usedClipList[i].clipId === clipId) {
                usedClipList[i].clipVolume = event.target.value;
                break;
            }
        }
    };

    ////////////////////////////////////////BGM 결정////////////////////////////////////////////////////////////////
    const selectBGM = (bgmId: number) => {
        setSelectedBGM(bgmId);
    };

    /////////////////////////////////////mode에 따른 사이드바 추가////////////////////////////////////////////////////
    let sideBar = <></>;

    switch (mode) {
        case 0:
            sideBar = (
                <div className="w-full flex flex-col justify-start text-xl ">
                    <p>선택하지 않은 영상</p>
                    {notUsedClipList.map((clip) => {
                        return (
                            <VideoCard
                                key={clip.clipId}
                                props={clip}
                                presentUser={userInfo.userId}
                                selectVideo={() => selectVideo(clip.clipId)}
                            />
                        );
                    })}
                </div>
            );
            break;
        case 1:
            sideBar = (
                <div className="w-full flex flex-col justify-start text-xl ">
                    <p>프레임</p>
                    <div className="flex flex-wrap text-center cursor-pointer">
                        {frameList.map((frame) => {
                            const source = `/src/assets/frames/frame${frame.frameId}.png`;
                            return (
                                <div
                                    className="px-1 py-2 hover:bg-gray-100"
                                    key={frame.frameId}
                                    onClick={() => {
                                        selectImg(source);
                                    }}
                                >
                                    <img
                                        className="w-24 h-14 border rounded-md"
                                        src={source}
                                        alt=""
                                    />
                                    {/* <p>{frame.frameTitle}</p> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
            break;
        case 2:
            sideBar = (
                <div className="w-full text-xl ">
                    <div className="w-full text-2xl">글꼴</div>
                    <p className="text-sm">글꼴 스타일</p>
                    <select name="font" className="w-full">
                        {fontList.map((font) => {
                            return (
                                <option
                                    key={font.fontId}
                                    value={font.fontFamily}
                                >
                                    {font.fontTitle}
                                </option>
                            );
                        })}
                        ;
                    </select>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm">글꼴 크기</p>
                            <div>
                                <button>-</button>
                                <input
                                    type="number"
                                    defaultValue={32}
                                    className="w-10"
                                ></input>
                                <button>+</button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm">글꼴 꾸미기</p>
                            <div>
                                <button className="font-bold">B</button>
                                <button className="italic">I</button>
                                <button>
                                    <u>U</u>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
            break;
        case 3:
            sideBar = (
                <div className="w-full flex flex-col justify-start text-xl ">
                    <p>BGM</p>
                    {bgmList.map((bgm) => {
                        return (
                            <BGMCard
                                key={bgm.bgmId}
                                bgm={bgm}
                                selectBGM={() => selectBGM(bgm.bgmId)}
                            />
                        );
                    })}
                </div>
            );
            break;
    }

    /////////////////////////////////////////////openvidu이용 화상 공유/////////////////////////////////////////////
    //studioId 가져오기
    const splitUrl = document.location.href.split('/');
    const studioId = splitUrl[splitUrl.length - 1];

    const [session, setSession] = useState<Session>();
    const [mainStreamManager, setMainStreamManager] = useState<Publisher>();
    const [publisher, setPublisher] = useState<Publisher>(); //이게 스크린
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

    const OV = useRef(new OpenVidu());

    // const APPLICATION_SERVER_URL = 'https://demos.openvidu.io/';

    /** deleteSubscriber(deletedsub)
     * 연결이 끊긴 구독자를 삭제한다.
     */
    const deleteSubscriber = useCallback((deletedsub: Subscriber) => {
        setSubscribers((prev) => {
            return prev.filter((subscriber) => subscriber !== deletedsub);
        });
    }, []);

    /** startScreenShare
     *  화면 공유 버튼을 누르면 나오는 함수(원래는 시작과 동시에 진행)
     *  현재 세션을 초기화하고, stream을 생성한 후, 비디오를 보낸다.
     */
    const startScreenShare = useCallback(async () => {
        const newSession = OV.current.initSession();

        //동영상이 들어오고 있다.
        newSession.on('streamCreated', (event) => {
            //DOM 추가 없으니 두번째 인자는 undefined
            const subscriber = newSession.subscribe(event.stream, undefined);
            console.log('subcriber - ', subscriber);
            //subscribers 리스트에 추가
            setSubscribers((prevSubscribers) => [
                ...prevSubscribers,
                subscriber,
            ]);
        });

        //화면 공유 종료 시
        newSession.on('streamDestroyed', (event) => {
            console.log(event);
            deleteSubscriber(event.streamManager);
        });

        //에러 발생 시
        newSession.on('exception', (exception) => {
            console.warn(exception);
        });

        // 세션 연결
        const token = await getToken(studioId); //토큰 받아오기

        // 세션 연결 시작
        newSession
            .connect(token, { clientData: userInfo.userId })
            .then(async () => {
                console.log('Connected');
                //publisher 초기화(videoSource = screen)
                const publisher = await OV.current.initPublisherAsync(
                    undefined,
                    {
                        audioSource: undefined,
                        videoSource: 'screen',
                        publishAudio: true,
                        publishVideo: true,
                        resolution: '640x480',
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: false,
                    }
                );
                //퍼블리시
                newSession.publish(publisher);
                console.log(publisher);
                //메인 화면, publisher에 현재 publisher 선정
                setMainStreamManager(publisher);
                setPublisher(publisher);
            })
            .catch((error) => {
                //connect에 에러
                console.log(
                    'There was an error connecting to the session:',
                    error.code,
                    error.message
                );
            });

        //세션 설정
        setSession(newSession);
    }, []);

    const endScreenShare = useCallback(() => {
        //OV 초기화
        OV.current = new OpenVidu();
        setSession(undefined);
        setSubscribers([]);
        setMainStreamManager(undefined);
        setPublisher(undefined);

        //세션 삭제
        endSessionAPI(studioId);

        navigate(`/studiomain/${studioId}`);
    }, [session, studioId]);

    /** getToken()
     * 세션을 생성하고 접속을 위한 토큰을 가져옵니다.
     */
    const getToken = async (studioId: string) => {
        //우선은 세션 활성화 여부 조회
        const isExistSession = await isSessionExistAPI(studioId);

        //이미 있는 세션이면 navigate
        if (isExistSession.data) {
            navigate(`/letterview/${studioId}`);
        }

        //studioId가 세션 id가 된다.
        const sessionId = await createSession(studioId);
        //세션 아이디로 토큰을 만든다.
        return await createToken(sessionId);
    };

    /**createSession(sessionId), 세션 정보를 받아오거나 생성한다. */
    const createSession = async (studioId: string) => {
        const response = await createSessionAPI(studioId);
        console.log('session -', response);
        return response.data.sessionId; // The session
    };

    /** createToken(sessionId)
     * 토큰을 생성한다.
     * @param sessionId
     * @returns
     */
    const createToken = async (sessionId: string) => {
        const response = await connectSessionAPI(sessionId);
        return response.data.token; // The token
    };

    //윈도우창 강제 종료 시 처리
    useEffect(() => {
        const handleBeforeUnload = () => endScreenShare();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [endScreenShare]);

    //////////////////////////////////////////유저 신규 참가 알림창//////////////////////////////////////////////////
    // const allowAccess = () => {
    //     console.log('참가를 수락했습니다.');
    //     setIsParticipantAlertActive(false);
    // };

    // const denyAccess = () => {
    //     console.log('참가를 거절했습니다.');
    //     setIsParticipantAlertActive(false);
    // };

    ///////////////////////////////////////////////렌더링///////////////////////////////////////////////////////////
    return (
        <section className="relative section-top pt-16">
            {/* {isParticipantAlertActive ? (
                <ParticipantAlertWindow
                    onClickOK={allowAccess}
                    onClickCancel={denyAccess}
                />
            ) : (
                <></>
            )} */}
            <div className="h-20 w-full px-12 color-text-black flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    <p className="text-3xl">studio1</p>
                    <div className="ml-20" />
                    <p>2024-01-14-02:12AM</p>
                </div>
                {/* 테스트용 화상 공유 버튼 */}
                <button
                    className="btn-cover color-bg-blue3 text-white"
                    onClick={endScreenShare}
                >
                    편집 종료, 홈페이지로
                </button>
                <a
                    href="/studiomain"
                    className="btn-cover color-bg-blue3 text-white"
                >
                    편집하기
                </a>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full editor-height">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex">
                    {/* 카테고리 */}
                    <div className="w-1/5 ">
                        <div
                            className={`h-28 bg-orange-100 flex flex-col justify-center items-center cursor-pointer hover:bg-orange-200 ${
                                mode === 0 ? 'categori-selected' : ''
                            }`}
                            onClick={() => setMode(0)}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                movie_edit
                            </span>
                            <p className="font-bold">영상</p>
                        </div>
                        <div
                            className={`h-28 bg-orange-100 flex flex-col justify-center items-center cursor-pointer hover:bg-orange-200 ${
                                mode === 1 ? 'categori-selected' : ''
                            }`}
                            onClick={() => setMode(1)}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                kid_star
                            </span>
                            <p className="font-bold">프레임</p>
                        </div>
                        <div
                            className={`h-28 bg-orange-100 flex flex-col justify-center items-center cursor-pointer hover:bg-orange-200 ${
                                mode === 2 ? 'categori-selected' : ''
                            }`}
                            onClick={() => setMode(2)}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                <span className="material-symbols-outlined">
                                    title
                                </span>
                            </span>
                            <p className="font-bold">텍스트</p>
                        </div>
                        <div
                            className={`h-28 bg-orange-100 flex flex-col justify-center items-center cursor-pointer hover:bg-orange-200 ${
                                mode === 3 ? 'categori-selected' : ''
                            }`}
                            onClick={() => setMode(3)}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                <span className="material-symbols-outlined">
                                    volume_up
                                </span>
                            </span>
                            <p className="font-bold">오디오</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                        {sideBar}
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 h-full editor-height bg-gray-50 flex flex-col justify-between">
                    <div className="w-full h-3/4 px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center mt-0">
                            <p className="text-2xl">은쮸</p>
                        </div>
                        {/* 폰트 테스트 */}
                        <p>폰트 테스트</p>
                        <div className="relative w-full h-full flex flex-col justify-center items-center">
                            <img
                                className="bg-white border"
                                style={{ width: '640px', height: '400px' }}
                                src="/src/assets/images/nothumb.png"
                            />
                            <img
                                src={selectImgUrl}
                                className="absolute top-0 lef-0"
                                style={{ width: '640px', height: '400px' }}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="w-full h-1/4 bg-white border-2 flex justify-center items-center">
                        <div className="w-full flex items-center my-4">
                            <div className=" w-1/12 flex justify-center items-center">
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    play_circle
                                </span>
                            </div>
                            <div className="w-11/12 flex items-center overflow-x-scroll">
                                {usedClipList.map((clip) => {
                                    return (
                                        <SelectedVideoCard
                                            key={clip.clipId}
                                            clip={clip}
                                            unselectClip={() =>
                                                unselectClip(clip.clipId)
                                            }
                                            changeVolume={(event) =>
                                                changeVolume(clip.clipId, event)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {publisher ? (
                <div id="main-video" className="col-md-6">
                    <OpenViduVideoCard streamManager={publisher} />
                </div>
            ) : (
                <></>
            )}
            <div id="video-container">
                {subscribers.length >= 1 ? (
                    subscribers.map((subscriber) => {
                        return (
                            <OpenViduVideoCard
                                key={subscriber.id}
                                streamManager={subscriber}
                            />
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
        </section>
    );
}
