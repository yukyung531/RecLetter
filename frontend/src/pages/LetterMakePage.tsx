import {
    useEffect,
    useState,
    useRef,
    useCallback,
    BaseSyntheticEvent,
} from 'react';
import {
    FrameType,
    StudioDetail,
    fontTemplate,
    UserInfo,
    ClipInfo,
    BGMTemplate,
    ClipList,
} from '../types/type';
import { getTemplate, getFont, getBgm } from '../api/template';
import { httpStatusCode } from '../util/http-status';
import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
// import { connectSession, createSession, endSession } from '../api/openvidu';
import { getUser } from '../api/user';
// import { connect } from '../util/chat';
import {
    connectSessionAPI,
    createSessionAPI,
    endSessionAPI,
    isSessionExistAPI,
} from '../api/openvidu';
import { useNavigate } from 'react-router-dom';
import { modifyStudioInfo, studioDetail } from '../api/studio';
import SelectedVideoCard from '../components/SelectedVideoCard';
import UnSelectedVideoCard from '../components/UnSelectedVideoCard';
import BGMCard from '../components/BGMCard';
import { disconnect } from '../util/chat';
import CanvasItem from '../components/CanvasItem';
import html2canvas from 'html2canvas';

interface mousePosition {
    positionX: number | null;
    positionY: number | null;
}

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
    const [eraserFlag, setEraserFlag] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stickerScale, setStickerScale] = useState<number>(160);
    const [stickerRotate, setStickerRotate] = useState<number>(0);

    interface WholeVideo {
        length: number;
        clipList: ClipInfo[];
    }
    //비디오 정보
    const [wholeVideoInfo, setWholeVideoInfo] = useState<WholeVideo>({
        length: 0,
        clipList: [],
    });

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
    const [selectedFrame, setSelectedFrame] = useState<number>(-1);
    const [selectImgUrl, setSelectImgUrl] = useState<string>('');

    const selectImg = (frameId: number, source: string) => {
        setSelectedFrame(frameId);
        setSelectImgUrl(source);
    };

    // 스티커 리스트
    const [stickerList, setStickerList] = useState<string[]>([
        'sticker1',
        'sticker2',
        'sticker3',
        'sticker4',
        'sticker5',
        'sticker6',
    ]);
    // 선택된 스티커
    const [selectedObj, setSelectedObj] = useState<string>('');
    // 마우스 위치
    const [mousePosition, setMousePosition] = useState<mousePosition>({
        positionX: null,
        positionY: null,
    });
    // 스티커 붙이기
    const [stickerFlag, setStickerFlag] = useState<boolean>(false);
    /** 스티커 선택 */
    const handleSelectedObj = (sticker: string) => {
        setSelectedObj(sticker);
    };
    /** 마우스 포인터 정하기 */
    const handleMousePositionInSideBar = ({
        positionX,
        positionY,
    }: mousePosition) => {
        setMousePosition({ ...mousePosition, positionX, positionY });
    };

    //유저 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userId: '',
        userEmail: '',
        userNickname: '',
    });

    //현재 재생 중
    const [playing, setPlaying] = useState<boolean>(false);

    /** duration 정보 끌어올리기 */
    const getDuration = (clipId: number, length: number) => {
        for (let i = 0; i < studioDetailInfo.clipInfoList.length; i++) {
            if (studioDetailInfo.clipInfoList[i].clipId === clipId) {
                studioDetailInfo.clipInfoList[i].clipLength = length;
                break;
            }
        }
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
                        //프레임 기본 정보 초기화
                        setSelectImgUrl(
                            `/src/assets/frames/frame${res.data.studioFrameId}.png`
                        );
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
            startScreenShare();
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

    useEffect(() => {
        /** 페이지 새로고침 전에 실행 할 키보드 이벤트 함수 */
        setStickerScale(160);
        setStickerRotate(0);
        let scale = stickerScale;
        let rotate = stickerRotate;
        const handleStickerKey = (event: KeyboardEvent) => {
            if (selectedObj !== '') {
                if (event.key === 'q') {
                    rotate -= 4;
                    setStickerRotate(rotate + 2);
                } else if (event.key === 'e') {
                    rotate += 4;
                    setStickerRotate(rotate + 2);
                } else if (event.key === 'w') {
                    scale += 4;
                    setStickerScale(scale + 2);
                } else if (event.key === 's') {
                    scale -= 4;
                    setStickerScale(scale + 2);
                }
            }
        };
        window.addEventListener('keydown', handleStickerKey);
        return () => {
            window.removeEventListener('keydown', handleStickerKey);
        };
    }, [selectedObj]);

    const onHtmlToPng = () => {
        const target = canvasRef.current;
        const onCapture = () => {
            console.log('onCapture');
            if (!target) {
                return alert('결과 저장에 실패했습니다');
            }
            html2canvas(target, { scale: 2, backgroundColor: null }).then(
                (canvas) => {
                    const imageDataURL = canvas.toDataURL('image/png');
                    console.log(imageDataURL);
                    onSaveAs(
                        canvas.toDataURL('image/png'),
                        'image-download.png'
                    );
                }
            );
        };

        const onSaveAs = (uri: string, filename: string) => {
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = uri;
            link.download = filename;
            link.click();
            document.body.removeChild(link);
        };
        onCapture();
    };

    ////////////////////////////////////////영상 순서 결정////////////////////////////////////////////////////////////

    //클립 선택
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

        //전체영상정보 업데이트
        updateWhole(newSelected);
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

        //전체영상정보 업데이트
        updateWhole(newSelected);

        //비디오 재생 중이었다면 중지 후 초기화
        if (videoRef.current) {
            videoRef.current.pause();
            playingIdx.current = 0;
        }
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

    //누적 시간합
    //현재 시간 계산용
    const [cumulTime, setCumulTime] = useState<number[]>([]);
    const [nowPlayingTime, setNowPlayingTime] = useState<number>(0);

    /** updateWhole
     * 전체 영상 정보 업데이트를 위한 함수다.
     * @param newSelected
     */
    const updateWhole = (newSelected: ClipInfo[]) => {
        const cumul: number[] = [];
        //전체 영상 정보 업데이트
        let len = 0;
        newSelected.map((clip) => {
            cumul.push(len);
            len += clip.clipLength;
        });
        setWholeVideoInfo({
            length: len,
            clipList: [...newSelected],
        });
        setCumulTime([...cumul]);
    };

    ////////////////////////////////////////BGM 결정////////////////////////////////////////////////////////////////
    const selectBGM = (bgmId: number) => {
        setSelectedBGM(bgmId);
    };

    ///////////////////////////////////////비디오 플레이어////////////////////////////////////////////////////////////

    const videoRef = useRef<HTMLVideoElement>(null);

    //현재 재생 중인 index
    const playingIdx = useRef<number>(0);

    //현재 재생중인 클립 정보
    const [nowPlayingVideo, setNowPlayingVideo] = useState<ClipInfo>({
        clipId: -1,
        clipTitle: '원하시는 영상을 입력하세요',
        clipOwner: '',
        clipLength: -1,
        clipThumbnail: '',
        clipUrl: '',
        clipOrder: -1,
        clipVolume: -1,
        clipContent: '',
    });

    /** playVideo()
     *  비디오를 플레이한다.
     */
    const playVideo = () => {
        setPercent(0);
        setPlaying(true);
        if (videoRef.current) {
            //idx 범위 내부면 비디오 재생 및 다음으로 넘기는 함수
            if (
                playingIdx.current >= 0 &&
                playingIdx.current < usedClipList.length
            ) {
                //범위 안이면 실행, 목록, 볼륨 조절
                setNowPlayingVideo(usedClipList[playingIdx.current]);
                videoRef.current.src = usedClipList[playingIdx.current].clipUrl;
                videoRef.current.volume =
                    usedClipList[playingIdx.current].clipVolume / 100;
                videoRef.current.play();
            } else {
                //범위 밖이면 맨 처음 영상으로 돌아간 후 정지
                playingIdx.current = 0;
                setNowPlayingVideo(usedClipList[playingIdx.current]);
                videoRef.current.src = usedClipList[playingIdx.current].clipUrl;
                videoRef.current.volume =
                    usedClipList[playingIdx.current].clipVolume / 100;
                stopVideo();
            }
        }
    };

    /** stopVideo()
     *  비디오를 정지한다.
     */
    const stopVideo = () => {
        setPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    /** selectIdx(index: number)
     *  카드를 누르면 거기부터 재생된다.
     * @param index
     */
    const selectIdx = (index: number) => {
        console.log(index);
        stopVideo();
        playingIdx.current = index;
        playVideo();
    };

    //비디오 플레이어 위치를 위한 state
    const [percent, setPercent] = useState<number>(0);

    //////////////////////////////////////뒤로가기 버튼 누르면 뒤로가기///////////////////////////////////////////////
    const goBack = async () => {
        await endScreenShare();
        navigate(`/studiomain/${studioId}`);
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
                            <UnSelectedVideoCard
                                key={clip.clipId}
                                props={clip}
                                selectVideo={() => selectVideo(clip.clipId)}
                                getDuration={(clipId: number, length: number) =>
                                    getDuration(clipId, length)
                                }
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
                                        selectImg(frame.frameId, source);
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
        case 4:
            sideBar = (
                <div className="w-full flex flex-col justify-start text-xl ">
                    <button onClick={onHtmlToPng}>다운로드</button>
                    <p>스티커</p>
                    <div className="flex flex-wrap m-2">
                        {stickerList.map((item) => {
                            const imgUrl = `/src/assets/sticker/${item}.png`;
                            return (
                                <div className="w-16 h-16 cursor-pointer rounded-lg hover:bg-gray-100">
                                    <img
                                        src={imgUrl}
                                        alt=""
                                        onClick={(e) => {
                                            handleSelectedObj(item);
                                            handleMousePositionInSideBar({
                                                positionX: e.clientX,
                                                positionY: e.clientY,
                                            });
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
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
        newSession.on('streamDestroyed', (event: any) => {
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

    /** saveNowStatus()
     *  현재 상태 저장 함수
     */
    const saveNowStatus = async () => {
        /* Canvas 이미지 설정 */
        const target = canvasRef.current;
        const onCapture = () => {
            console.log('onCapture');
            if (!target) {
                return alert('결과 저장에 실패했습니다');
            }
            html2canvas(target, { scale: 2, backgroundColor: null }).then(
                (canvas) => {
                    const imageDataURL = canvas.toDataURL('image/png');
                    uploadLetterAPI(imageDataURL);
                }
            );
        };
        onCapture();
    };

    /** 영상 보내는 API */
    const uploadLetterAPI = async (imageDataURL: string) => {
        try {
            // FormData 객체 생성
            const formData = new FormData();

            /* 기존에 있던 데이터 추가 */
            const used: ClipList[] = [];
            usedClipList.map((clip) => {
                used.push({
                    clipId: clip.clipId,
                    clipVolume: clip.clipVolume,
                });
            });
            const unused: number[] = [];
            notUsedClipList.map((clip) => {
                unused.push(clip.clipId);
            });

            //font의 경우 현재 구현 안되었으니 기본으로 고정
            // const nowStatus: Letter = {
            //     studioId: studioId, //string
            //     usedClipList: used, //ClipList{clipId:number,clipVolume:number}
            //     unusedClipList: unused, //number[]
            //     studioFrameId: selectedFrame, //number
            //     studioFontId: 1, //number
            //     studioFontSize: 32, //number
            //     studioFontBold: false, //boolean
            //     studioBgmId: selectedBGM, //number
            //     studioVolume: 100, //number
            //     studioSticker: '',
            // };

            // 이미지 데이터를 Blob으로 변환 후 FormData에 추가
            const blob = await fetch(imageDataURL).then((res) => res.blob());
            formData.append('studioId', studioId);
            used.forEach((item, index) => {
                formData.append(
                    `usedClipList[${index}][clipid],`,
                    String(item.clipId)
                );
                formData.append(
                    `usedClipList[${index}][clipVolume],`,
                    String(item.clipVolume)
                );
            });
            unused.forEach((item, index) => {
                formData.append(`unusedClipList[${index}],`, String(item));
            });
            formData.append('studioFrameId', String(selectedFrame));
            formData.append('studioFontId', String(1));
            formData.append('studioFontSize', String(32));
            formData.append('studioFontBold', 'false');
            formData.append('studioBgmId', String(selectedBGM));
            formData.append('studioVolume', String(100));
            formData.append('studioSticker', blob, 'sticker.png');

            type ObjectType = {
                [key: string]: FormDataEntryValue;
            };
            //formdata to json
            const object: ObjectType = {};
            console.log('FormData에 넣은 데이터ㅡㅡㅡㅡㅡㅡㅡㅡㅡ');
            formData.forEach((value, key) => {
                console.log('key / Value | ' + key + ' / ' + value);
                object[key.toString()] = value;
            });
            console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ');
            console.log(object);
            //전송
            await modifyStudioInfo(object)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });

            //세션 종료 후 뒤로 가기
            await endScreenShare();
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다.');
        }
    };

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
        <section
            className="relative section-top pt-16"
            onMouseMove={(e) => {
                if (selectedObj !== '') {
                    setMousePosition({
                        ...mousePosition,
                        positionX: e.clientX,
                        positionY: e.clientY,
                    });
                    console.log(mousePosition.positionX);
                }
            }}
        >
            {selectedObj !== '' &&
            mousePosition.positionX &&
            mousePosition.positionY ? (
                <div
                    className="sticker z-40"
                    style={{
                        position: 'absolute',
                        left: mousePosition.positionX - stickerScale / 2,
                        top: mousePosition.positionY - stickerScale / 2,
                        backgroundImage: `url('/src/assets/sticker/${selectedObj}.png')`,
                        backgroundSize: 'cover',
                        width: stickerScale,
                        height: stickerScale,
                        rotate: stickerRotate + 'deg',
                    }}
                    onClick={(e) => {
                        setStickerFlag(true);
                        // setSelectedObj('');
                    }}
                ></div>
            ) : null}
            {/* {isParticipantAlertActive ? (
                <ParticipantAlertWindow
                    onClickOK={allowAccess}
                    onClickCancel={denyAccess}
                />
            ) : (
                <></>
            )} */}
            {/* 중앙 섹션 */}
            <div className="flex w-full editor-height">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex flex-col">
                    <div className="flex items-center pl-12">
                        <span
                            className="material-symbols-outlined cursor-pointer"
                            onClick={goBack}
                        >
                            arrow_back_ios
                        </span>
                        <p className="text-3xl">
                            {studioDetailInfo.studioTitle}
                        </p>
                    </div>
                    {/* 카테고리 */}
                    <div className="flex">
                        <div className="relative w-1/5 color-text-main">
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(0);
                                }}
                            >
                                <div
                                    className={`${
                                        mode === 0
                                            ? 'h-16 categori-selected '
                                            : ''
                                    }`}
                                ></div>
                                <span className="material-symbols-outlined text-3xl">
                                    movie_edit
                                </span>
                                <p className="font-bold">영상</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(1);
                                }}
                            >
                                <div
                                    className={`${
                                        mode === 1
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                <span className="material-symbols-outlined text-3xl">
                                    kid_star
                                </span>
                                <p className="font-bold">프레임</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(2);
                                }}
                            >
                                <div
                                    className={`${
                                        mode === 2
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                <span className="material-symbols-outlined text-3xl">
                                    title
                                </span>
                                <p className="font-bold">텍스트</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(3);
                                }}
                            >
                                <div
                                    className={`${
                                        mode === 3
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                <span className="material-symbols-outlined text-3xl">
                                    volume_up
                                </span>
                                <p className="font-bold">오디오</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(4);
                                }}
                            >
                                <div
                                    className={`${
                                        mode === 4
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                <span className="material-symbols-outlined text-3xl">
                                    image
                                </span>
                                <p className="font-bold">스티커</p>
                            </div>
                        </div>
                        {/* 카테고리 선택에 따라 */}
                        <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                            {sideBar}
                        </div>
                    </div>
                </div>
                {/* 우측부분 */}
                {/* 상단 */}
                <div className="w-3/4 h-full editor-height bg-gray-50 flex flex-col justify-between">
                    <div className="w-full h-3/4 px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center mt-0">
                            <p className="text-2xl">
                                {nowPlayingVideo.clipTitle}
                            </p>
                        </div>
                        <div className="flex w-full">
                            {/* 영상 표시 부분 */}
                            <div className="relative w-4/5 h-full flex flex-col justify-center items-center">
                                {/* 영상 */}
                                <video
                                    className="bg-black border"
                                    style={{
                                        width: '800px',
                                        aspectRatio: 16 / 9,
                                        transform: `rotateY(180deg)`,
                                    }}
                                    ref={videoRef}
                                    onEnded={() => {
                                        playingIdx.current =
                                            playingIdx.current + 1;
                                        playVideo();
                                    }}
                                    onTimeUpdate={(
                                        event: BaseSyntheticEvent
                                    ) => {
                                        setPercent(
                                            event.target.currentTime /
                                                event.target.duration
                                        );
                                        setNowPlayingTime(
                                            event.target.currentTime
                                        );
                                    }}
                                    crossOrigin="anonymous"
                                />
                                {/* 프레임 */}
                                <img
                                    src={selectImgUrl}
                                    className="absolute top-0 lef-0"
                                    style={{
                                        width: '800px',
                                        aspectRatio: 16 / 9,
                                    }}
                                    alt=""
                                />
                                {/* 스티커 */}
                                <main className="absolute" ref={canvasRef}>
                                    <CanvasItem
                                        canvasWidth={800}
                                        canvasHeight={450}
                                        sticker={selectedObj}
                                        setSticker={setSelectedObj}
                                        eraser={eraserFlag}
                                        stickerFlag={stickerFlag}
                                        setStickerFlag={setStickerFlag}
                                        mousePosition={mousePosition}
                                        scale={stickerScale}
                                        rotate={stickerRotate}
                                    ></CanvasItem>
                                </main>
                            </div>
                            {/* 저장 및 현재 편지 정보 */}
                            <div className="relative w-1/5 h-full flex flex-col justify-evenly">
                                <button
                                    className="box-border btn-cover w-full bg-[#FF777F] text-white"
                                    onClick={saveNowStatus}
                                >
                                    저장하기
                                </button>
                                <div className="w-full flex flex-col rounded">
                                    <h5 className="bg-[#FF777F]">편지 정보</h5>
                                    <div>
                                        <p>
                                            제목: {studioDetailInfo.studioTitle}
                                        </p>
                                        <p>
                                            길이:{' '}
                                            {Math.floor(
                                                wholeVideoInfo.length / 60
                                            )}
                                            분{' '}
                                            {Math.floor(
                                                wholeVideoInfo.length % 60
                                            )}
                                            초
                                        </p>
                                        <p>
                                            선택 영상:{' '}
                                            {wholeVideoInfo.clipList.length}
                                        </p>
                                        {wholeVideoInfo.clipList.map((clip) => {
                                            return <p>{clip.clipTitle}</p>;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 하단바 */}
                    <div className="w-full h-1/4 bg-white border-2 flex justify-center items-center">
                        <div className="w-full flex items-center my-4">
                            <div className=" w-1/12 flex justify-center items-center">
                                {/* 재생버튼 */}
                                {!playing ? (
                                    <span
                                        className="material-symbols-outlined me-1 text-4xl"
                                        onClick={playVideo}
                                    >
                                        play_circle
                                    </span>
                                ) : (
                                    <span
                                        className="material-symbols-outlined me-1 text-4xl"
                                        onClick={stopVideo}
                                    >
                                        stop_circle
                                    </span>
                                )}
                                <span>
                                    {cumulTime.length > 0 ? Math.floor(
                                        (nowPlayingTime +
                                            cumulTime[playingIdx.current]) /
                                            60
                                    ):
                                    0}
                                    분
                                    {cumulTime.length > 0 ? Math.floor(
                                            (nowPlayingTime +
                                                cumulTime[playingIdx.current]) %
                                                60
                                    ) :
                                    0}
                                    초
                                </span>
                            </div>
                            <div className="w-11/12 flex items-center overflow-x-scroll">
                                {usedClipList.map((clip, index) => {
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
                                            getDuration={(
                                                clipId: number,
                                                length: number
                                            ) => getDuration(clipId, length)}
                                            propVideoRef={videoRef}
                                            percent={percent}
                                            selectCard={() => selectIdx(index)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* openvidu 동작 확인용 현재 publishing 창 */}
            {/* {publisher ? (
                <div id="main-video" className="col-md-6">
                    <OpenViduVideoCard streamManager={publisher} />
                </div>
            ) : (
                <></>
            )} */}
        </section>
    );
}
