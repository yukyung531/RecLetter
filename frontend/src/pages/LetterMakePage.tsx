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
    CanvasFont,
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
import {
    enterStudio,
    getStudio,
    modifyStudioInfo,
    studioDetail,
} from '../api/studio';
import SelectedVideoCard from '../components/SelectedVideoCard';
import UnSelectedVideoCard from '../components/UnSelectedVideoCard';
import BGMCard from '../components/BGMCard';
import { disconnect } from '../util/chat';
import CanvasItem from '../components/CanvasItem';
import html2canvas from 'html2canvas';
import { getlastPath, hexToRgba } from '../util/get-func';
import {
    studioAddState,
    studioDeleteState,
    studioNameState,
} from '../util/counter-slice';
import { useDispatch, useSelector } from 'react-redux';
import ColorPalette from '../components/ColorPalette';
import { uploadFile } from '../util/uploadFile';
import { Toggle } from '../components/Toggle';
import { webkitTextStrokeWidth } from 'html2canvas/dist/types/css/property-descriptors/webkit-text-stroke-width';
import ErrorModal from '../components/ErrorModal';

interface mousePosition {
    positionX: number | null;
    positionY: number | null;
}

export default function LetterMakePage() {
    const navigate = useNavigate();

    //mode - 0:영상리스트, 1:프레임, 2:텍스트, 3:오디오
    const [mode, setMode] = useState<number>(0);

    //에러 모달
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const closeModal = () => {
        setIsModalActive(false);
    };

    const [isNavaigateErrorModalActive, setIsNavigateErrorModalActive] =
        useState<boolean>(false);
    const closeNavModal = () => {
        setIsNavigateErrorModalActive(false);
        navigate('/login');
    };

    ///////////////////////////////////////////////초기 설정////////////////////////////////////////////////////////

    // //영상리스트 with 스튜디오 정보
    const [studioDetailInfo, setStudioDetailInfo] = useState<StudioDetail>({
        studioId: '',
        studioTitle: '',
        studioOwner: '',
        studioStatus: '',
        clipInfoList: [],
        studioFrameId: 1,
        studioBGMId: 1,
        studioStickerUrl: '',
        studioBGMVolume: 100,
        expireDate: new Date(),
    });

    //나중 결과물 산출용 상태 관리

    //사용 영상, 사용하지 않은 영상
    const [usedClipList, setUsedClipList] = useState<ClipInfo[]>([]);
    const [notUsedClipList, setNotUsedClipList] = useState<ClipInfo[]>([]);
    //선택된 정보들
    const [selectedBGM, setSelectedBGM] = useState<number>(1);
    const [selectedBGMUrl, setSelectedBGMUrl] = useState<string>('');
    const [eraserFlag, setEraserFlag] = useState<boolean>(false);
    const [clearCanvas, setClearCanvas] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const [stickerScale, setStickerScale] = useState<number>(160);
    const [stickerRotate, setStickerRotate] = useState<number>(0);
    const [keyState, setKeyState] = useState<string>('');
    const [canvasTextSticker, setCanvasTextSticker] = useState<CanvasFont>({
        fontContent: '',
        fontSize: 16,
        fontColor: '#626262',
        fontFamily: 'omyu_pretty',
        fontBorder: '',
        fontBorderWidth: 1,
        fontShadow: '',
        fontShadowWidth: 2,
        fontShadowBlur: 3,
    });
    const [studioBGMVolume, setStudioBGMVolume] = useState<number>(50);

    //BGM 미리듣기 재생 중
    const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);

    /** 리덕스 설정 */
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const chatStudioList: string[] = useSelector(
        (state: any) => state.loginFlag.studioId
    );
    const dispatch = useDispatch();

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
    const [selectedFrame, setSelectedFrame] = useState<number>(1);
    const [selectImgUrl, setSelectImgUrl] = useState<string>('');
    const regex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

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
        'sticker7',
        'sticker8',
        'sticker9',
        'sticker10',
        'sticker11',
        'sticker12',
        'sticker13',
        'sticker14',
        'sticker15',
        'sticker16',
        'sticker17',
        'sticker18',
        'sticker19',
        'sticker20',
        'sticker21',
        'sticker22',
        'sticker23',
        'sticker24',
        'sticker25',
        'sticker26',
        'sticker27',
        'sticker28',
        'sticker29',
        'sticker30',
        'sticker31',
        'sticker32',
        'sticker33',
        'sticker34',
        'sticker35',
        'sticker36',
        'sticker37',
        'sticker38',
        'sticker39',
        'sticker40',
        'sticker41',
        'sticker42',
        'sticker43',
        'sticker44',
        'sticker45',
        'sticker46',
        'sticker47',
        'sticker48',
        'sticker49',
        'sticker50',
        'sticker51',
    ]);
    const [fontStickerList, setFontStickerList] = useState<string[]>([
        'fontsticker1',
        'fontsticker2',
        'fontsticker3',
    ]);
    // 스티커 레이아웃 이미지
    const [stickerLayoutList, setStickerLayoutList] = useState<string[]>([]);

    const [customSticker, setCustomSticker] = useState<string>('');
    const [customStickerFlag, setCustomStickerFlag] = useState<boolean>(false);
    // 선택된 스티커
    const [selectedObj, setSelectedObj] = useState<string>('');
    // 스티커 모드
    const [stickerMode, setStickerMode] = useState<number>(0);
    // 마우스 위치
    const [mousePosition, setMousePosition] = useState<mousePosition>({
        positionX: null,
        positionY: null,
    });
    // 스티커 붙이기
    const [stickerFlag, setStickerFlag] = useState<boolean>(false);
    const [canvasFlag, setCanvasFlag] = useState<number>(0);
    const [canvasDownloadNum, setCavnasDownloadNum] = useState<number>(0);
    const [canvasSaveNum, setCanvasSaveNum] = useState<number>(0);
    // 스티커 파레트
    const [paletteColorFlag, setPaletteColorFlag] = useState<boolean>(false);
    const [paletteBorderFlag, setPaletteBorderFlag] = useState<boolean>(false);
    const [paletteShadowFlag, setPaletteShadowFlag] = useState<boolean>(false);
    /** 스티커 선택 */

    const [scrollY, setScrollY] = useState<number>(0);
    const handleSelectedObj = (sticker: string) => {
        setSelectedObj(sticker);
    };
    /** 스티커 change */
    const onChangeStickerText = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontContent: e.target.value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerSize = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontSize: e.target.value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerColor = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontColor: e.target.value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerColorCode = (value: string) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontColor: value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerFamily = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontFamily: e.target.value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerBorderCode = (value: string) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontBorder: value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerBorderWidth = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontBorderWidth: e.target.value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerShadowWidth = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontShadowWidth: e.target.value, // 특정 값을 수정합니다.
        }));
    };
    const onChangeStickerShadowBlur = (e: BaseSyntheticEvent) => {
        setCanvasTextSticker((prev) => ({
            ...prev, // 이전 상태를 복사합니다.
            fontShadowBlur: e.target.value, // 특정 값을 수정합니다.
        }));
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

    useEffect(() => {
        const studioId = getlastPath();
        if (studioId === '') {
            setIsNavigateErrorModalActive(true);
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
                        const tempClipList = res.data.clipInfoList;

                        // clipList.map((clip, index) => {
                        //     getVideoDurationInSeconds(clip.clipUrl).then(
                        //         (duration) => {
                        //             console.log(clip, duration);
                        //             clipList[index].clipLength = duration;
                        //         }
                        //     );
                        // });

                        //클립리스트 정렬
                        const clipList = tempClipList.sort(
                            (clipA: ClipInfo, clipB: ClipInfo) => {
                                return clipA.clipOrder - clipB.clipOrder;
                            }
                        );

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
                        setSelectedFrame(res.data.studioFrameId);

                        //스티커 기본 정보 초기화
                        /* 스티커 */
                        // console.log('스티커 관련');
                        if (res.data.studioStickerUrl.match(regex)) {
                            setCustomSticker(res.data.studioStickerUrl);
                            setCustomStickerFlag(true);
                            setStickerFlag(true);
                        }

                        //studioBGM
                        // console.log(res.data);
                        if (res.data.studioBgmId) {
                            setSelectedBGM(res.data.studioBgmId);
                            //선택된 bgm 불러오기
                            //2번 bgm부터 bgm1.mp3
                            if (res.data.studioBgmId > 1) {
                                setSelectedBGMUrl(
                                    `/src/assets/bgm/bgm${
                                        res.data.studioBgmId - 1
                                    }.mp3`
                                );
                            }
                        }

                        //studioBGMVolume
                        if (res.data.studioBgmVolume) {
                            if (bgmRef.current) {
                                bgmRef.current.volume =
                                    +res.data.studioBgmVolume / 200;
                            }
                            setStudioBGMVolume(res.data.studioBgmVolume);
                        }
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
        };
        initSetting();

        //OpenVidu 모드 비활성화
        // OpenVidu.enableProdMode();

        const token = localStorage.getItem('access-token');
        if (isLogin) {
            //API 불러오는 함수로 clipInfo를 받아옴
            //우선 url query String으로부터 스튜디오 상세 정보 받아오기

            const studioId = getlastPath();
            if (studioId !== '') {
                const getDetail = async (studioId: string) => {
                    await studioDetail(studioId).then((res) => {
                        if (res.status === httpStatusCode.OK) {
                            // 채팅방 불러오기 설정
                            if (res.data.studioStatus === 'COMPLETE') {
                                alert('완성된 비디오입니다.');
                                navigate('/studiolist');
                            }
                            if (chatStudioList.length === 0) {
                                dispatch(studioAddState(studioId));
                            } else {
                                let chatListFlag = false;
                                chatStudioList.map(
                                    (item: string, index: number) => {
                                        if (!chatListFlag) {
                                            if (item === studioId)
                                                chatListFlag = true;
                                        }
                                    }
                                );
                                if (!chatListFlag) {
                                    dispatch(studioAddState(studioId));
                                }
                            }
                            // 채팅방 불러오기 설정

                            dispatch(studioNameState(res.data.studioTitle));
                            setStudioDetailInfo(res.data);
                            setSelectImgUrl(
                                `/src/assets/frames/frame${res.data.studioFrameId}.png`
                            );
                        }
                    });
                    return;
                };

                const enterStudioAPI = async (studioId: string) => {
                    await enterStudio(studioId)
                        .then((res) => {
                            // console.log(res);
                            getDetail(studioId);
                        })
                        .catch(() => {
                            console.log('오류떠서 재실행');
                            getDetail(studioId);
                        });
                };
                enterStudioAPI(studioId);
            }
        }
        if (!token || !isLogin) {
            navigate(`/login`);
        }
        // openvidu 화면 공유 시작
        //현재 주석 처리. 주석 풀것!!! (주석해제위치)
        startScreenShare();

        /** 페이지 새로고침 전에 실행 할 함수 */
        const reloadingStudioId = getlastPath();
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const studioId = getlastPath();
            disconnect(studioId);
        };
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            // console.log('사라지기전 ' + reloadingStudioId + '입니다');
            if (reloadingStudioId) {
                dispatch(studioDeleteState(reloadingStudioId));
                disconnect(reloadingStudioId);
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
            window.removeEventListener('scroll', handleScroll);
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
                setKeyState('');
                if (event.key === 'q') {
                    rotate -= 4;
                    setStickerRotate(rotate + 2);
                    setKeyState('q');
                } else if (event.key === 'ㅂ') {
                    rotate -= 4;
                    setStickerRotate(rotate + 2);
                    setKeyState('ㅂ');
                } else if (event.key === 'e') {
                    rotate += 4;
                    setStickerRotate(rotate + 2);
                    setKeyState('e');
                } else if (event.key === 'ㄷ') {
                    rotate += 4;
                    setStickerRotate(rotate + 2);
                    setKeyState('ㄷ');
                } else if (event.key === 'w') {
                    scale += 4;
                    setStickerScale(scale + 2);
                    setKeyState('w');
                } else if (event.key === 'ㅈ') {
                    scale += 4;
                    setStickerScale(scale + 2);
                    setKeyState('ㅈ');
                } else if (event.key === 's') {
                    scale -= 4;
                    setStickerScale(scale + 2);
                    setKeyState('s');
                } else if (event.key === 'ㄴ') {
                    scale -= 4;
                    setStickerScale(scale + 2);
                    setKeyState('ㄴ');
                } else if (event.key === 'Escape') {
                    setCustomStickerFlag(false);
                    setStickerFlag(false);
                    setSelectedObj('');
                    setKeyState('Escape');
                }
            }
        };
        const handleStickerKeyUp = (event: KeyboardEvent) => {
            setKeyState('');
        };
        window.addEventListener('keydown', handleStickerKey);
        window.addEventListener('keyup', handleStickerKeyUp);
        return () => {
            window.removeEventListener('keydown', handleStickerKey);
            window.removeEventListener('keyup', handleStickerKeyUp);
        };
    }, [selectedObj]);

    useEffect(() => {
        if (canvasDownloadNum !== 0) {
            const target = canvasRef2.current;
            // 캡처 전에 비디오를 좌우 반전
            const video = videoRef.current;
            if (video) {
                video.style.transform = 'scaleX(1)';
            }
            const onCapture = () => {
                // console.log('onCapture');
                if (!target) {
                    setErrorMessage('결과 저장에 실패했습니다');
                    return setIsModalActive(true);
                }

                html2canvas(target, { scale: 1.6, backgroundColor: null }).then(
                    (canvas) => {
                        const imageDataURL = canvas.toDataURL('image/png');
                        // console.log(imageDataURL);
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
                if (video) {
                    video.style.transform = 'scaleX(-1)';
                }
            };
            onCapture();
            setCavnasDownloadNum(0);
            setClearCanvas(!clearCanvas);
        }
    }, [canvasDownloadNum]);

    useEffect(() => {
        if (canvasSaveNum !== 0) {
            const target = canvasRef.current;
            const onCapture = () => {
                // console.log('onCapture');
                if (!target) {
                    setErrorMessage('결과 저장에 실패했습니다');
                    return setIsModalActive(true);
                }
                html2canvas(target, { scale: 1.6, backgroundColor: null }).then(
                    (canvas) => {
                        const imageDataURL = canvas.toDataURL('image/png');
                        uploadLetterAPI(imageDataURL);
                    }
                );
            };
            onCapture();
            setCanvasSaveNum(0);
            setClearCanvas(!clearCanvas);
        }
    }, [canvasSaveNum]);

    //Toogle 초기화
    useEffect(() => {
        if (!paletteColorFlag) {
            setCanvasTextSticker((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontColor: '#626262',
            }));
        }
    }, [paletteColorFlag]);
    useEffect(() => {
        if (!paletteBorderFlag) {
            setCanvasTextSticker((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontBorder: '',
                fontBorderWidth: 0.1,
            }));
        }
    }, [paletteBorderFlag]);
    useEffect(() => {
        if (!paletteShadowFlag) {
            setCanvasTextSticker((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontShadow: '',
                fontShadowWidth: 2,
                fontShadowBlur: 3,
            }));
        }
    }, [paletteShadowFlag]);

    const onHtmlToPng = () => {
        setCanvasFlag(1);
        // const target = canvasRef.current;
        // const onCapture = () => {
        //     console.log('onCapture');
        //     if (!target) {
        //         return alert('결과 저장에 실패했습니다');
        //     }
        //     html2canvas(target, { scale: 2, backgroundColor: null }).then(
        //         (canvas) => {
        //             const imageDataURL = canvas.toDataURL('image/png');
        //             console.log(imageDataURL);
        //             onSaveAs(
        //                 canvas.toDataURL('image/png'),
        //                 'image-download.png'
        //             );
        //         }
        //     );
        // };

        // const onSaveAs = (uri: string, filename: string) => {
        //     const link = document.createElement('a');
        //     document.body.appendChild(link);
        //     link.href = uri;
        //     link.download = filename;
        //     link.click();
        //     document.body.removeChild(link);
        // };
        // onCapture();
    };

    ////////////////////////////////////////영상 순서 결정////////////////////////////////////////////////////////////

    /** selectVideo(clipId)
     *  클립을 선택한다.
     * @param clipId
     */
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

    /** unselectClip(clipId)
     *  클립의 선택을 취소한다.
     * @param clipId
     */
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

    /** changeVolume(clipId, event)
     *  클립의 볼륨을 조절한다.
     * @param clipId
     * @param event
     */
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

    /** calculateDuration(clipId, event)
     *  클립의 duration이 로드되면 정보를 추가한다.
     * @param clipId
     * @param event
     */
    const calculateDuration = (clipId: number, event: BaseSyntheticEvent) => {
        //usedClip, notUsedClip을 기준으로 돌아가니, 이쪽의 정보 업데이트
        for (let i = 0; i < usedClipList.length; i++) {
            if (usedClipList[i].clipId === clipId) {
                // console.log(
                //     'duration calculated',
                //     clipId,
                //     event.target.duration
                // );
                usedClipList[i].clipLength = event.target.duration;
                //누적합 갱신
                updateWhole(usedClipList);
            }
        }
        for (let i = 0; i < notUsedClipList.length; i++) {
            if (notUsedClipList[i].clipId === clipId) {
                notUsedClipList[i].clipLength = event.target.duration;
            }
        }
    };

    ////////////////////////////////////////BGM 결정////////////////////////////////////////////////////////////////
    /** selectBGM
     *  현재 bgm을 선택한다.
     * @param bgmId
     */
    const selectBGM = (bgmId: number) => {
        setSelectedBGM(bgmId);
    };

    /** selectBGMUrl
     * bgm을 선택한대로 업로드한다.
     * @param bgmId
     * @returns
     */
    const selectBGMUrl = (bgmId: number) => {
        for (let i = 0; i < bgmList.length; i++) {
            if (bgmList[i].bgmId === bgmId) {
                setSelectedBGMUrl(bgmList[i].bgmUrl + '.mp3');
                return;
            }
        }
    };

    const bgmRef = useRef<HTMLAudioElement>(null);

    ///////////////////////////////////////비디오 플레이어////////////////////////////////////////////////////////////

    const videoRef = useRef<HTMLVideoElement>(null);

    //현재 재생 중인 index
    const playingIdx = useRef<number>(0);

    //현재 재생중인 클립 정보
    const [nowPlayingVideo, setNowPlayingVideo] = useState<ClipInfo>({
        clipId: -1,
        clipTitle: '',
        clipOwner: '',
        clipLength: -1,
        clipThumbnail: '',
        clipUrl: '',
        clipOrder: -1,
        clipVolume: 100,
        clipContent: '',
    });

    /** playVideo()
     *  비디오를 플레이한다.
     */
    const playVideo = () => {
        if (bgmRef.current) {
            bgmRef.current.pause;
            setBgmPlaying(false);
        }

        //재생할게 없으면 return
        if (usedClipList.length === 0) {
            return;
        }

        setPercent(0);
        setPlaying(true);
        //video play && bgm play
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
                    usedClipList[playingIdx.current].clipVolume / 200;
                videoRef.current.play();

                //bgm실행
                if (bgmRef.current) {
                    bgmRef.current.volume = studioBGMVolume / 200;
                    bgmRef.current.currentTime =
                        cumulTime[playingIdx.current] % bgmRef.current.duration;
                    bgmRef.current.play();
                }
            } else {
                //범위 밖이면 맨 처음 영상으로 돌아간 후 정지
                playingIdx.current = 0;
                setNowPlayingVideo(usedClipList[playingIdx.current]);
                videoRef.current.src = usedClipList[playingIdx.current].clipUrl;
                videoRef.current.volume =
                    usedClipList[playingIdx.current].clipVolume / 200;
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
            videoRef.current.currentTime = 0;
            videoRef.current.pause();
            if (bgmRef.current) {
                bgmRef.current.currentTime = 0;
                bgmRef.current.pause();
            }
        }
    };

    /** selectIdx(index: number)
     *  카드를 누르면 거기부터 재생된다.
     * @param index
     */
    const selectIdx = (index: number) => {
        // console.log(index);
        stopVideo();
        playingIdx.current = index;
        playVideo();
    };

    //비디오 플레이어 위치를 위한 state
    const [percent, setPercent] = useState<number>(0);

    //////////////////////////////////////뒤로가기 버튼 누르면 뒤로가기///////////////////////////////////////////////

    /** goBack()
     * 뒤로 가기 버튼을 누르면 뒤로 가진다.
     */
    const goBack = async () => {
        await endScreenShare();
        navigate(`/studiomain/${studioId}`);
    };

    /////////////////////////////////////mode에 따른 사이드바 추가////////////////////////////////////////////////////
    let sideBar = <></>;

    const costomElement = () => {
        return (
            <div className="">
                <img
                    src={
                        customSticker === ''
                            ? '/src/assets/images/nothumb.png'
                            : customSticker
                    }
                    className="w-16 h-16 cursor-pointer rounded-lg hover:bg-gray-100 hover:border hover:color-border-main object-cover"
                    alt=""
                    onClick={(e) => {
                        if (customSticker) {
                            handleSelectedObj(customSticker);
                            handleMousePositionInSideBar({
                                positionX: e.clientX,
                                positionY: e.clientY,
                            });
                            setCustomStickerFlag(true);
                        }
                    }}
                />
                <input
                    type="file"
                    id="customstickerfile"
                    accept="image/*, .gif"
                    onChange={(event) => {
                        uploadFile(event, setCustomSticker);
                    }}
                    style={{ display: 'none' }}
                />
            </div>
        );
    };

    const stickerElement = () => {
        if (stickerMode === 0) {
            return (
                <div className="w-full flex flex-col justify-start text-xl">
                    <div className="flex flex-wrap m-2 h-40 overflow-y-scroll scroll-pink">
                        {stickerList.map((item, index) => {
                            const imgUrl = `/src/assets/sticker/${item}.png`;
                            return (
                                <div
                                    key={'sticker : ' + index}
                                    className="w-16 h-16 cursor-pointer rounded-lg hover:bg-gray-100 hover:border hover:color-border-main"
                                >
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

                    <div className="p-2 border rounded-xl color-border-sublight justify-center my-3">
                        <div className="flex justify-between">
                            <p className="color-text-sublight">커스텀 스티커</p>
                            <label
                                className="input-file-button flex px-1 color-bg-sublight items-center justify-center rounded-lg cursor-pointer"
                                htmlFor="customstickerfile"
                            >
                                <div className="w-4 h-4 mx-1 flex justify-center items-center text-center bg-white rounded-full border color-border-main color-text-main">
                                    +
                                </div>
                                <p className="button-upload text-white">
                                    이미지 업로드
                                </p>
                            </label>
                        </div>
                        <div className="flex flex-wrap items-center justify-center py-3">
                            {costomElement()}
                        </div>
                    </div>
                </div>
            );
        } else if (stickerMode === 1) {
            return (
                <div className="w-full flex flex-col justify-start text-xl pb-10">
                    <p>텍스트 스티커</p>

                    <div
                        className="border rounded-lg color-border-darkgray text-center py-6 cursor-pointer hover:bg-gray-100"
                        onClick={(e) => {
                            handleSelectedObj('fontsticker1');
                            handleMousePositionInSideBar({
                                positionX: e.clientX,
                                positionY: e.clientY,
                            });
                        }}
                    >
                        <p
                            style={{
                                color: canvasTextSticker.fontColor,
                                fontSize: canvasTextSticker.fontSize + 'px',
                                fontFamily: `${canvasTextSticker.fontFamily}`,
                                textShadow: hexToRgba(
                                    canvasTextSticker.fontShadow,
                                    0.5
                                ),
                                WebkitTextStroke: `${
                                    canvasTextSticker.fontBorderWidth + 'px'
                                } ${canvasTextSticker.fontBorder}`,
                            }}
                        >
                            {canvasTextSticker.fontContent === ''
                                ? '텍스트 미리보기'
                                : canvasTextSticker.fontContent}
                        </p>
                    </div>
                    <div>
                        <div className="my-2">
                            <input
                                type="text"
                                className="w-full ps-2 py-1 outline-none text-lg border color-border-darkgray rounded-lg"
                                onChange={onChangeStickerText}
                                placeholder="텍스트를 입력하세요"
                            />
                        </div>
                        <div className="my-2">
                            <select
                                className="w-full border rounded-md py-1 outline-none"
                                name=""
                                onChange={onChangeStickerFamily}
                                style={{
                                    fontFamily: `${canvasTextSticker.fontFamily}`,
                                }}
                            >
                                {fontList.map((item, key) => (
                                    <option
                                        className=" text-base"
                                        value={item.fontFamily}
                                        style={{
                                            fontFamily: `${item.fontFamily}`,
                                        }}
                                    >
                                        {item.fontTitle}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mx-2 my-2">
                            <p>텍스트 사이즈</p>
                            <div className="flex w-fit">
                                <p
                                    className="w-6 text-center font-bold border rounded-ss-lg rounded-es-lg cursor-pointer"
                                    onClick={() => {
                                        setCanvasTextSticker((prev) => ({
                                            ...prev, // 이전 상태를 복사합니다.
                                            fontSize:
                                                Number(
                                                    canvasTextSticker.fontSize
                                                ) - 1, // 특정 값을 수정합니다.
                                        }));
                                    }}
                                >
                                    -
                                </p>
                                <input
                                    type="number"
                                    className="w-14 text-lg appearance-none flex border-y text-center"
                                    onChange={onChangeStickerSize}
                                    value={canvasTextSticker.fontSize}
                                />
                                <p
                                    className="w-6 text-center font-bold border rounded-se-lg rounded-ee-lg cursor-pointer"
                                    onClick={() => {
                                        setCanvasTextSticker((prev) => ({
                                            ...prev, // 이전 상태를 복사합니다.
                                            fontSize:
                                                Number(
                                                    canvasTextSticker.fontSize
                                                ) + 1, // 특정 값을 수정합니다.
                                        }));
                                    }}
                                >
                                    +
                                </p>
                            </div>
                        </div>
                        <div className="mx-2 my-2">
                            <div className="relative flex items-center pe-10">
                                <p>텍스트 색상</p>
                                <div className="mx-4">
                                    <Toggle
                                        flag={paletteColorFlag}
                                        setFlag={setPaletteColorFlag}
                                    />
                                </div>
                            </div>
                            {paletteColorFlag ? (
                                <div>
                                    <ColorPalette
                                        setColor={setCanvasTextSticker}
                                        target="fontColor"
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>

                        <div className="mx-2 my-2">
                            <div className="relative flex items-center pe-10">
                                <p>외곽선</p>
                                <div className="mx-4">
                                    <Toggle
                                        flag={paletteBorderFlag}
                                        setFlag={setPaletteBorderFlag}
                                    />
                                </div>
                            </div>
                            {paletteBorderFlag ? (
                                <div>
                                    <ColorPalette
                                        setColor={setCanvasTextSticker}
                                        target="fontBorder"
                                    />
                                    <div className="flex my-4">
                                        <p className="color-text-darkgray">
                                            두께
                                        </p>
                                        <div className=" mx-2 ">
                                            <input
                                                className="w-16 text-center border px-4 rounded-lg"
                                                type="number"
                                                value={
                                                    canvasTextSticker.fontBorderWidth
                                                }
                                                onChange={
                                                    onChangeStickerBorderWidth
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="mx-2 my-2">
                            <div className="relative flex items-center pe-10">
                                <p>그림자</p>
                                <div className="mx-4">
                                    <Toggle
                                        flag={paletteShadowFlag}
                                        setFlag={setPaletteShadowFlag}
                                    />
                                </div>
                            </div>
                            {paletteShadowFlag ? (
                                <div>
                                    <ColorPalette
                                        setColor={setCanvasTextSticker}
                                        target="fontShadow"
                                    />
                                    <div className="flex my-4">
                                        <p className="color-text-darkgray">
                                            길이
                                        </p>
                                        <div className=" mx-2 ">
                                            <input
                                                className="w-16 text-center border px-4 rounded-lg"
                                                type="number"
                                                value={
                                                    canvasTextSticker.fontShadowWidth
                                                }
                                                onChange={
                                                    onChangeStickerShadowWidth
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex my-4">
                                        <p className="color-text-darkgray">
                                            밝기
                                        </p>
                                        <div className=" mx-2 ">
                                            <input
                                                className="w-16 text-center border px-4 rounded-lg"
                                                type="number"
                                                value={
                                                    canvasTextSticker.fontShadowBlur
                                                }
                                                onChange={
                                                    onChangeStickerShadowBlur
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    };
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
                                // getDuration={(clipId: number, length: number) =>
                                //     getDuration(clipId, length)
                                // }
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
                    <div className="flex flex-wrap text-center cursor-pointer justify-around w-full">
                        {frameList
                            .sort((a, b) => a.frameId - b.frameId)
                            .map((frame, item) => {
                                const source = `/src/assets/frames/frame${frame.frameId}.png`;
                                return (
                                    <div
                                        className="px-1 py-1 hover:bg-gray-100 rounded-lg my-1 flex flex-col items-center justify-center"
                                        key={frame.frameId}
                                        onClick={() => {
                                            selectImg(frame.frameId, source);
                                        }}
                                        style={
                                            selectedFrame === frame.frameId
                                                ? {
                                                      border: '1px solid #ff777f',
                                                  }
                                                : {}
                                        }
                                    >
                                        <img
                                            className="w-24 h-14 border rounded-md"
                                            src={source}
                                            alt=""
                                        />
                                        <p className="my-1 text-sm">
                                            {frame.frameTitle}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            );
            break;
        case 2:
            sideBar = (
                <div className="w-full flex flex-col justify-start text-xl ">
                    <div className="flex justify-between -mb-1">
                        <p>BGM</p>
                        <div>
                            {playing ? (
                                <>
                                    <button className="text-[#D5D5D5] border-2 border-[#D5D5D5] px-[10px] rounded-[10px] text-sm material-symbols-outlined">
                                        play_arrow
                                    </button>
                                    <button className="text-[#D5D5D5] border-2 border-[#D5D5D5] px-[10px] rounded-[10px] text-sm ml-2 material-symbols-outlined">
                                        stop
                                    </button>
                                </>
                            ) : (
                                <>
                                    {bgmPlaying ? (
                                        <button
                                            className="text-[#FF777F] border-2 border-[#FF777F] px-[10px] rounded-[10px] text-sm material-symbols-outlined"
                                            onClick={() => {
                                                if (bgmRef.current) {
                                                    bgmRef.current.pause();
                                                    setBgmPlaying(false);
                                                }
                                            }}
                                        >
                                            pause
                                        </button>
                                    ) : (
                                        <button
                                            className="text-[#FF777F] border-2 border-[#FF777F] px-[10px] rounded-[10px] text-sm material-symbols-outlined"
                                            onClick={() => {
                                                if (bgmRef.current) {
                                                    bgmRef.current.play();
                                                    setBgmPlaying(true);
                                                }
                                            }}
                                        >
                                            play_arrow
                                        </button>
                                    )}
                                    <button
                                        className="text-[#FF777F] border-2 border-[#FF777F] px-[10px] rounded-[10px] text-sm ml-2 material-symbols-outlined"
                                        onClick={() => {
                                            if (bgmRef.current) {
                                                //멈추고 처음으로
                                                setBgmPlaying(false);
                                                bgmRef.current.pause();
                                                bgmRef.current.currentTime = 0;
                                            }
                                        }}
                                    >
                                        stop
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <select
                        name="bgm"
                        id="bgm"
                        onChange={(event) => {
                            stopVideo();
                            setBgmPlaying(false);
                            selectBGM(+event.target.value);
                            selectBGMUrl(+event.target.value);
                        }}
                        className="border h-8 pl-1 pr-0.5 color-border-darkgray rounded my-2"
                    >
                        {bgmList.map((bgm) => {
                            return (
                                <option
                                    value={bgm.bgmId}
                                    selected={bgm.bgmId === selectedBGM}
                                >
                                    {bgm.bgmTitle}
                                </option>
                            );
                        })}
                    </select>

                    <p className="mt-4">배경 음악 볼륨</p>
                    <input
                        className="w-full mt-1"
                        type="range"
                        min={0}
                        max={200}
                        value={studioBGMVolume}
                        defaultValue={100}
                        onChange={(event) => {
                            setStudioBGMVolume(+event.target.value);
                            if (bgmRef.current) {
                                bgmRef.current.volume =
                                    +event.target.value / 200;
                            }
                        }}
                        style={{
                            background: studioBGMVolume
                                ? `linear-gradient(to right,#ff4954 ${
                                      studioBGMVolume / 2
                                  }%, rgba(229,231,235,0.8) ${
                                      studioBGMVolume / 2
                                  }% 100%)`
                                : '#E5E7EB',
                        }}
                    />

                    <p className="mt-6">전체 영상 볼륨 조절</p>
                    <div className="w-full flex">
                        <button
                            className="border-2 border-[#FF777F] text-[#FF777F] m-1 rounded hover:bg-[#FF777F] hover:text-white flex-grow"
                            onClick={() => {
                                usedClipList.map((clip) => {
                                    clip.clipVolume = +clip.clipVolume - 5;
                                    if (clip.clipVolume < 0) {
                                        clip.clipVolume = 0;
                                    }
                                });
                                setUsedClipList([...usedClipList]);
                            }}
                        >
                            -5
                        </button>
                        <button
                            className="border-2 border-[#FF777F] text-[#FF777F] m-1 rounded hover:bg-[#FF777F] hover:text-white flex-grow"
                            onClick={() => {
                                usedClipList.map((clip) => {
                                    clip.clipVolume = +clip.clipVolume - 1;
                                    if (clip.clipVolume < 0) {
                                        clip.clipVolume = 0;
                                    }
                                });
                                setUsedClipList([...usedClipList]);
                            }}
                        >
                            -1
                        </button>
                        <button
                            className="border-2 border-[#FF777F] text-[#FF777F] m-1 rounded hover:bg-[#FF777F] hover:text-white flex-grow"
                            onClick={() => {
                                usedClipList.map((clip) => {
                                    clip.clipVolume = +clip.clipVolume + 1;
                                    if (clip.clipVolume > 200) {
                                        clip.clipVolume = 200;
                                    }
                                });
                                setUsedClipList([...usedClipList]);
                            }}
                        >
                            +1
                        </button>
                        <button
                            className="border-2 border-[#FF777F] text-[#FF777F] m-1 rounded hover:bg-[#FF777F] hover:text-white flex-grow"
                            onClick={() => {
                                usedClipList.map((clip) => {
                                    clip.clipVolume = +clip.clipVolume + 5;
                                    if (clip.clipVolume > 200) {
                                        clip.clipVolume = 200;
                                    }
                                });
                                setUsedClipList([...usedClipList]);
                            }}
                        >
                            +5
                        </button>
                    </div>
                </div>
            );
            break;
        case 3:
            sideBar = (
                <div className="w-full flex flex-col justify-start text-xl">
                    <div className="w-full h-full px-4 py-2 text-xl border rounded-2xl flex flex-wrap items-center justify-center">
                        <p className="relative w-full text-left mb-2">
                            크기 회전 조작
                        </p>
                        <div className="relative w-1/3 flex justify-end">
                            {keyState === ('q' || 'ㅂ') ? (
                                <img
                                    className="absolute w-8 h-8 -top-6 -right-5 z-20"
                                    src="/src/assets/images/keyActive11.png"
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                            <img
                                className=""
                                src="/src/assets/images/keyQ.png"
                                style={
                                    keyState === ('q' || 'ㅂ')
                                        ? { scale: '1.2' }
                                        : {}
                                }
                                alt=""
                            />
                        </div>
                        <div className="relative w-1/3 flex justify-center">
                            {keyState === ('w' || 'ㅈ') ? (
                                <img
                                    className="absolute w-8 h-8 -top-6 -right-5 z-20"
                                    src="/src/assets/images/keyActive12.png"
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                            <img
                                src="/src/assets/images/keyW.png"
                                style={
                                    keyState === ('w' || 'ㅈ')
                                        ? { scale: '1.2' }
                                        : {}
                                }
                                alt=""
                            />
                        </div>
                        <div className="relative w-1/3 flex justify-start">
                            {keyState === ('e' || 'ㄷ') ? (
                                <img
                                    className="absolute w-8 h-8 -top-6 -right-5 z-20"
                                    src="/src/assets/images/keyActive11.png"
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                            <img
                                src="/src/assets/images/keyE.png"
                                style={
                                    keyState === ('e' || 'ㄷ')
                                        ? { scale: '1.2' }
                                        : {}
                                }
                                alt=""
                            />
                        </div>
                        <div className="relative w-1/3"></div>
                        <div className="relative w-1/3 flex justify-center">
                            {keyState === ('s' || 'ㄴ') ? (
                                <img
                                    className="absolute w-8 h-8 -top-6 -right-5 z-20"
                                    src="/src/assets/images/keyActive12.png"
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                            <img
                                src="/src/assets/images/keyS.png"
                                style={
                                    keyState === ('s' || 'ㄴ')
                                        ? { scale: '1.2' }
                                        : {}
                                }
                                alt=""
                            />
                        </div>
                        <div className="relative w-1/3">
                            {keyState === 'Escape' ? (
                                <img
                                    className="absolute w-8 h-8 -top-6 -right-5 z-20"
                                    src="/src/assets/images/keyActive12.png"
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                            <img
                                className="relative -bottom-1 -right-2"
                                src="/src/assets/images/keyESC.png"
                                style={
                                    keyState === 'Escape'
                                        ? { scale: '1.2' }
                                        : {}
                                }
                                alt=""
                            />
                        </div>
                        <div className="w-full flex justify-around mt-4 color-text-darkgray">
                            <div className="flex flex-col items-center text-lg">
                                <div className="flex flex-col justify-center items-center">
                                    <p>회전 조작</p>
                                    <p>Q, E</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-lg">
                                <div className="flex flex-col justify-center items-center">
                                    <p>크기 조작</p>
                                    <p>W, S</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-lg">
                                <div className="flex flex-col justify-center items-center">
                                    <p>선택 해제</p>
                                    <p>ESC</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-around mt-4 color-text-darkgray  hover:text-white">
                            <div
                                className="flex flex-col items-center text-lg border px-2 py-1 rounded-lg cursor-pointer hover:color-bg-sublight btn-animation"
                                onClick={() => setEraserFlag(!eraserFlag)}
                            >
                                <div className="flex flex-col justify-center items-center">
                                    <p>전체 지우기</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <button onClick={onHtmlToPng}>다운로드</button> */}

                    <ul className="flex justify-around my-4">
                        <li
                            className="cursor-pointer hover:font-bold"
                            onClick={() => {
                                setStickerMode(0);
                            }}
                            style={
                                stickerMode === 0
                                    ? {
                                          color: '#ff777f',
                                          borderBottom: '2px solid #ff777f',
                                      }
                                    : {}
                            }
                        >
                            스티커
                        </li>
                        <li
                            className="cursor-pointer hover:font-bold"
                            onClick={() => {
                                setStickerMode(1);
                            }}
                            style={
                                stickerMode === 1
                                    ? {
                                          color: '#ff777f',
                                          borderBottom: '2px solid #ff777f',
                                      }
                                    : {}
                            }
                        >
                            텍스트 스티커
                        </li>
                    </ul>
                    {stickerElement()}
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
        //로그 비활성화
        OV.current.enableProdMode();

        //동영상이 들어오고 있다.
        newSession.on('streamCreated', (event) => {
            //DOM 추가 없으니 두번째 인자는 undefined
            const subscriber = newSession.subscribe(event.stream, undefined);
            // console.log('subcriber - ', subscriber);
            //subscribers 리스트에 추가
            setSubscribers((prevSubscribers) => [
                ...prevSubscribers,
                subscriber,
            ]);
        });

        //화면 공유 종료 시
        newSession.on('streamDestroyed', (event: any) => {
            // console.log(event);
            deleteSubscriber(event.streamManager);
        });

        //에러 발생 시
        newSession.on('exception', (exception) => {
            console.warn(exception);
        });

        // 세션 연결
        const token = await getToken(studioId); //토큰 받아오기
        let user = userInfo;
        if (userInfo.userId === '') {
            const res = await getUser();
            user = res.data;
        }

        // 세션 연결 시작
        newSession
            .connect(token, { clientData: user.userNickname })
            .then(async () => {
                //getDisplayMedia 도전
                // const constraints = {
                //     video: {
                //         width: {
                //             ideal: 1024,
                //         },
                //         height: {
                //             ideal: 1080,
                //         },
                //     },
                //     audio: true,
                //     selfBrowserSurface: 'include',
                // };

                // navigator.mediaDevices
                //     .getDisplayMedia(constraints)
                //     .then((stream) => {
                //         OV.current
                //             .initPublisherAsync(undefined, {
                //                 audioSource: stream.getAudioTracks()[0],
                //                 videoSource: stream.getVideoTracks()[0],
                //                 publishAudio: true,
                //                 publishVideo: true,
                //                 resolution: '1920x1080',
                //                 frameRate: 30,
                //                 insertMode: 'APPEND',
                //                 mirror: false,
                //             })
                //             .then((publisher) => {
                //                 newSession.publish(publisher);
                //                 // console.log(publisher);
                //                 //메인 화면, publisher에 현재 publisher 선정
                //                 setMainStreamManager(publisher);
                //                 setPublisher(publisher);
                //             });
                //     });

                //publisher 초기화(videoSource = screen)
                const publisher = await OV.current.initPublisherAsync(
                    undefined,
                    {
                        audioSource: 'screen',
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
                // console.log(publisher);
                //메인 화면, publisher에 현재 publisher 선정
                setMainStreamManager(publisher);
                setPublisher(publisher);
            })
            .catch((error) => {
                //connect에 에러
                // console.log(
                //     'There was an error connecting to the session:',
                //     error.code,
                //     error.message
                // );
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
        const existSessionInfo = await isSessionExistAPI(studioId);
        let user: any = userInfo;
        //유저 아이디가 로딩 안되는 문제 있음
        //만약 아직 로딩 안되었으면 받아오기
        if (userInfo.userId === '') {
            const res = await getUser();
            user = res.data;
        }

        //세션이 없다. -> 일단 생성부터
        if (existSessionInfo.data === 'no exists') {
            //studioId가 세션 id가 된다.
            const sessionId = await createSession(studioId);
            //세션 아이디로 토큰을 만든다.
            return await createToken(sessionId);
        } else {
            if (
                existSessionInfo.data.defaultRecordingProperties.name ===
                user.userId
            ) {
                //세션 생성자였을 경우(새로고침, 오류 등으로 재접속)
                //여기서 바로 커넥션, sessionId를 항상 studioId로 통일함.
                return await createToken(studioId);
            } else {
                //세션 생성자가 아니었을 경우
                //편집 감상 페이지로 이동
                navigate(`/letterview/${studioId}`);
            }
        }
    };

    /**createSession(sessionId), 세션 정보를 받아오거나 생성한다. */
    const createSession = async (studioId: string) => {
        const response = await createSessionAPI(studioId);
        // console.log('session -', response);
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
        setCanvasFlag(2);
        // uploadLetterAPI()
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    function checkScrollable() {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    }

    function scrollRight() {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            setTimeout(checkScrollable, 100); // 스크롤 이동이 완료된 후에 checkScrollable을 호출.
        }
    }
    function scrollLeft() {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            setTimeout(checkScrollable, 100); // 스크롤 이동이 완료된 후에 checkScrollable을 호출.
        }
    }

    useEffect(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => {
            window.removeEventListener('resize', checkScrollable);
        };
    }, [usedClipList]);

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
                    `usedClipList[${index}].clipId`,
                    String(item.clipId)
                );
                formData.append(
                    `usedClipList[${index}].clipVolume`,
                    String(item.clipVolume)
                );
            });
            unused.forEach((item, index) => {
                formData.append(`unusedClipList[${index}]`, String(item));
            });
            formData.append('studioFrameId', String(selectedFrame));
            // formData.append('studioBgmId', String(selectedBGM));
            formData.append('studioBgmId', String(selectedBGM));
            // formData.append('studioVolume', String(studioBGMVolume));
            formData.append('studioBgmVolume', String(studioBGMVolume));
            formData.append('studioSticker', blob, 'sticker.png');

            type ObjectType = {
                [key: string]: FormDataEntryValue;
            };
            //formdata to json
            const object: ObjectType = {};
            // console.log('FormData에 넣은 데이터ㅡㅡㅡㅡㅡㅡㅡㅡㅡ');
            formData.forEach((value, key) => {
                // console.log('key / Value | ' + key + ' / ' + value);
                object[key.toString()] = value;
            });
            // console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ');
            // console.log(object);
            //전송
            await modifyStudioInfo(object)
                .then((res) => {
                    // console.log(res);
                })
                .catch((err) => {
                    // console.log(err);
                });

            //세션 종료 후 뒤로 가기
            await endScreenShare();
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            setErrorMessage('이미지 업로드에 실패했습니다.');
            setIsModalActive(true);
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
            className="relative section-top h-screen pt-14"
            onMouseMove={(e) => {
                if (selectedObj !== '') {
                    setMousePosition({
                        ...mousePosition,
                        positionX: e.clientX,
                        positionY: e.clientY,
                    });
                    // console.log(mousePosition.positionX);
                }
            }}
        >
            {isModalActive ? (
                <ErrorModal onClick={closeModal} message={errorMessage} />
            ) : (
                <></>
            )}
            {isNavaigateErrorModalActive ? (
                <ErrorModal
                    onClick={closeNavModal}
                    message="에러가 발생하여 돌아갑니다"
                />
            ) : (
                <></>
            )}
            {selectedObj !== '' &&
            mousePosition.positionX &&
            mousePosition.positionY &&
            stickerMode === 0 ? (
                <div
                    className="sticker z-40"
                    style={{
                        position: 'absolute',
                        left: mousePosition.positionX - stickerScale / 2,
                        top:
                            mousePosition.positionY -
                            stickerScale / 2 +
                            scrollY,
                        backgroundImage: `url('${
                            customStickerFlag !== true
                                ? `/src/assets/sticker/${selectedObj}.png')`
                                : `${customSticker}')`
                        }`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
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
            {selectedObj !== '' &&
            mousePosition.positionX &&
            mousePosition.positionY &&
            stickerMode === 1 ? (
                <>
                    <div
                        className="sticker z-40"
                        style={{
                            position: 'absolute',
                            left: mousePosition.positionX - stickerScale / 2,
                            top:
                                mousePosition.positionY -
                                stickerScale / 2 +
                                scrollY,
                            backgroundImage: `url('/src/assets/sticker/${selectedObj}.png')`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            width: stickerScale,
                            height: stickerScale,
                            rotate: stickerRotate + 'deg',
                        }}
                        onClick={(e) => {
                            setStickerFlag(true);
                            // setSelectedObj('');
                        }}
                    ></div>
                    <p
                        className="sticker z-50 text-center flex items-center justify-center cursor-default"
                        style={{
                            position: 'absolute',
                            left: mousePosition.positionX - 400,
                            top:
                                mousePosition.positionY -
                                stickerScale / 2 +
                                scrollY,
                            color: canvasTextSticker.fontColor,
                            fontSize: canvasTextSticker.fontSize + 'px',
                            textShadow: hexToRgba(
                                canvasTextSticker.fontShadow,
                                0.5
                            ),
                            width: '800px',
                            height: stickerScale,
                            rotate: stickerRotate + 'deg',
                            WebkitTextStroke: `${
                                canvasTextSticker.fontBorderWidth + 'px'
                            } ${canvasTextSticker.fontBorder}`,
                        }}
                        onClick={(e) => {
                            setStickerFlag(true);
                            // setSelectedObj('');
                        }}
                    >
                        {canvasTextSticker.fontContent === ''
                            ? '텍스트 미리보기. testText'
                            : canvasTextSticker.fontContent}
                    </p>
                </>
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
                <div className="w-1/4 editor-height flex flex-col border-r">
                    <div className="flex items-center pl-12 py-2 border-b-2 color-border-sublight">
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
                    <div className="flex h-full overflow-y-scroll">
                        <div className="relative w-16 h-full color-text-darkgray color-bg-lightgray1">
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(0);
                                }}
                                style={
                                    mode === 0
                                        ? {
                                              backgroundColor: 'white',
                                              color: '#ff777f',
                                          }
                                        : {}
                                }
                            >
                                <div
                                    className={`${
                                        mode === 0
                                            ? 'h-16 categori-selected '
                                            : ''
                                    }`}
                                ></div>
                                {mode === 0 ? (
                                    <img
                                        className="w-6 h-6 my-1"
                                        src="/src/assets/icons/sidebar-clip-pink.png"
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        className="w-6 h-6 my-1"
                                        src="/src/assets/icons/sidebar-clip.png"
                                        alt=""
                                    />
                                )}

                                <p className="font-bold">영상</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(1);
                                }}
                                style={
                                    mode === 1
                                        ? {
                                              backgroundColor: 'white',
                                              color: '#ff777f',
                                          }
                                        : {}
                                }
                            >
                                <div
                                    className={`${
                                        mode === 1
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                {mode === 1 ? (
                                    <img
                                        className="w-6 h-6 my-1"
                                        src="/src/assets/icons/sidebar-frame-pink.png"
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        className="w-6 h-6 my-1"
                                        src="/src/assets/icons/sidebar-frame.png"
                                        alt=""
                                    />
                                )}
                                <p className="font-bold">프레임</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(2);
                                }}
                                style={
                                    mode === 2
                                        ? {
                                              backgroundColor: 'white',
                                              color: '#ff777f',
                                          }
                                        : {}
                                }
                            >
                                <div
                                    className={`${
                                        mode === 2
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                {mode === 2 ? (
                                    <img
                                        className="w-6 h-6 my-1"
                                        src="/src/assets/icons/sidebar-volume-pink.png"
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        className="w-6 h-6 my-1"
                                        src="/src/assets/icons/sidebar-volume.png"
                                        alt=""
                                    />
                                )}
                                <p className="font-bold">오디오</p>
                            </div>
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    setMode(3);
                                }}
                                style={
                                    mode === 3
                                        ? {
                                              backgroundColor: 'white',
                                              color: '#ff777f',
                                          }
                                        : {}
                                }
                            >
                                <div
                                    className={`${
                                        mode === 3
                                            ? 'h-16 categori-selected'
                                            : ''
                                    }`}
                                ></div>
                                <span className="material-symbols-outlined text-3xl">
                                    kid_star
                                </span>
                                <p className="font-bold">스티커</p>
                            </div>
                        </div>
                        {/* 카테고리 선택에 따라 */}
                        <div className="relative w-[84%] flex flex-col items-center p-3 overflow-y-scroll">
                            {sideBar}
                        </div>
                    </div>
                </div>
                {/* 우측부분 */}
                {/* 상단 */}
                <div className="w-3/4 h-full editor-height bg-gray-50 flex flex-col justify-between">
                    <div className="w-full h-3/4 px-4 py-4 flex flex-col justify-center items-center">
                        <div className="flex justify-start items-start w-full mt-1 ml-[85px]">
                            <p className="text-2xl">
                                {nowPlayingVideo.clipTitle}
                            </p>
                        </div>
                        <div className="flex w-full">
                            {/* 영상 표시 부분 */}

                            <div className="relative w-4/5 h-full flex flex-col items-center">
                                <main
                                    className="relative flex"
                                    ref={canvasRef2}
                                >
                                    {/* 영상 */}
                                    <video
                                        className="bg-black border flipped"
                                        style={{
                                            width: '800px',
                                            aspectRatio: 16 / 9,
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
                                    {stickerLayoutList.map((item, index) => {
                                        return (
                                            <img
                                                key={'show Layout : ' + index}
                                                src={item}
                                                className="absolute top-0 lef-0"
                                                style={{
                                                    width: '800px',
                                                    aspectRatio: 16 / 9,
                                                }}
                                                alt=""
                                            />
                                        );
                                    })}

                                    <main className="absolute" ref={canvasRef}>
                                        <CanvasItem
                                            canvasWidth={800}
                                            canvasHeight={450}
                                            sticker={selectedObj}
                                            stickerText={canvasTextSticker}
                                            setSticker={setSelectedObj}
                                            eraser={eraserFlag}
                                            stickerFlag={stickerFlag}
                                            setStickerFlag={setStickerFlag}
                                            mousePosition={mousePosition}
                                            scale={stickerScale}
                                            rotate={stickerRotate}
                                            mode={stickerMode}
                                            stickerLayout={stickerLayoutList}
                                            setStickerLayout={
                                                setStickerLayoutList
                                            }
                                            saveFlag={canvasFlag}
                                            setSaveFlag={setCanvasFlag}
                                            setCanvasDownload={
                                                setCavnasDownloadNum
                                            }
                                            setCanvasSave={setCanvasSaveNum}
                                            clearCanvas={clearCanvas}
                                            customSticker={customSticker}
                                            setCustomSticker={setCustomSticker}
                                            setCustomStickerFlag={
                                                setCustomStickerFlag
                                            }
                                            customStickerFlag={
                                                customStickerFlag
                                            }
                                        ></CanvasItem>
                                    </main>
                                </main>
                            </div>

                            {/* 저장 및 현재 편지 정보 */}
                            <div className="relative w-1/5 h-full flex flex-col justify-center items-center">
                                <button
                                    className="box-border mx-2 py-3 w-full text-xl rounded-lg color-bg-main text-white btn-animation"
                                    onClick={saveNowStatus}
                                >
                                    저장하기
                                </button>

                                <div className="w-full min-h-36 max-h-44 flex mx-2 flex-col my-3 border-x border-b color-border-sublight rounded-lg bg-white">
                                    <h5 className="color-bg-sublight text-lg border-t px-2 rounded-t-lg text-white">
                                        편지 정보
                                    </h5>

                                    <div className="px-2 pt-3 ms-1 overflow-y-scroll scroll-pink">
                                        <p className="flex">
                                            <p className="font-bold">제목:</p>
                                            <p className="mx-2">
                                                {studioDetailInfo.studioTitle}
                                            </p>
                                        </p>
                                        <p className="flex">
                                            <p className="font-bold">길이:</p>
                                            <p className="mx-2">
                                                {Math.floor(
                                                    wholeVideoInfo.length / 60
                                                )}
                                                분{' '}
                                                {Math.floor(
                                                    wholeVideoInfo.length % 60
                                                )}
                                                초
                                            </p>
                                        </p>
                                        <p className="flex">
                                            <p className="font-bold">
                                                선택 영상:
                                            </p>
                                            <p className="mx-2">
                                                {'('}
                                                {wholeVideoInfo.clipList.length}
                                                {')'}
                                            </p>
                                        </p>
                                        <ul className="list-disc">
                                            {wholeVideoInfo.clipList.map(
                                                (clip) => {
                                                    return (
                                                        <li className="ms-6">
                                                            {clip.clipTitle}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="w-full h-40 overflow-y-scroll border rounded-lg min-h-40 px-1 py-1">
                                    <p className="color-text-main text-lg">
                                        스티커 레이어 {'('}
                                        {stickerLayoutList.length}
                                        {')'}
                                    </p>
                                    {stickerLayoutList.map((item, index) => {
                                        return (
                                            <div
                                                key={'layout : ' + index}
                                                className="border my-1 rounded-md p-1 flex items-center justify-between"
                                            >
                                                <div className="flex items-center">
                                                    <p>레이어 : {index}</p>
                                                    <img
                                                        src={item}
                                                        className="w-16 h-9 border mx-2"
                                                        alt=""
                                                    />
                                                </div>
                                                <img
                                                    onClick={() => {
                                                        const updateItems =
                                                            stickerLayoutList.filter(
                                                                (_, order) =>
                                                                    order !==
                                                                    index
                                                            );
                                                        setStickerLayoutList(
                                                            updateItems
                                                        );
                                                    }}
                                                    className="mx-2 cursor-pointer"
                                                    src="/src/assets/icons/minus-button.png"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 하단바 */}
                    <div className="w-full h-1/4 bg-white border-2 border-l-0 flex justify-center items-center">
                        <div className="w-full flex items-center my-4">
                            <div className=" w-1/12 flex justify-center items-center">
                                {/* 재생버튼 */}
                                <div className="flex flex-col items-center">
                                    {!playing ? (
                                        <span
                                            className="material-symbols-outlined me-1 text-4xl cursor-pointer"
                                            onClick={playVideo}
                                        >
                                            play_circle
                                        </span>
                                    ) : (
                                        <span
                                            className="material-symbols-outlined me-1 text-4xl cursor-pointer"
                                            onClick={stopVideo}
                                        >
                                            stop_circle
                                        </span>
                                    )}
                                    <span>
                                        {cumulTime.length > 0
                                            ? Math.floor(
                                                  (nowPlayingTime +
                                                      cumulTime[
                                                          playingIdx.current
                                                      ]) /
                                                      60
                                              )
                                            : 0}
                                        분
                                        {cumulTime.length > 0
                                            ? Math.floor(
                                                  (nowPlayingTime +
                                                      cumulTime[
                                                          playingIdx.current
                                                      ]) %
                                                      60
                                              )
                                            : 0}
                                        초
                                    </span>
                                    <div className="text-center color-text-main">
                                        음량조절
                                    </div>
                                </div>
                            </div>
                            <button
                                style={{
                                    fontSize: '2em',
                                    margin: '0 0.6em',
                                    color: canScrollLeft
                                        ? 'black'
                                        : 'lightgray',
                                    position: 'relative', // 위치를 상대적으로 설정
                                    top: '-30px', // 상단으로 50px 이동
                                }}
                                onClick={scrollLeft}
                                disabled={!canScrollLeft}
                            >
                                &lt;
                            </button>
                            <div
                                className="relative w-11/12 flex items-center overflow-x-scroll py-2"
                                ref={scrollRef}
                            >
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
                                            propVideoRef={videoRef}
                                            percent={percent}
                                            selectCard={() => selectIdx(index)}
                                        />
                                    );
                                })}
                            </div>
                            <button
                                style={{
                                    fontSize: '2em',
                                    margin: '0 0.6em',
                                    color: canScrollRight
                                        ? 'black'
                                        : 'lightgray',
                                    position: 'relative', // 위치를 상대적으로 설정
                                    top: '-30px', // 상단으로 50px 이동
                                }}
                                onClick={scrollRight}
                                disabled={!canScrollRight}
                            >
                                &gt;
                            </button>
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
            {/* 길이 로드용 metadata 추출 video */}
            {studioDetailInfo.clipInfoList.map((clip) => {
                return (
                    <video
                        src={clip.clipUrl}
                        style={{ display: 'none' }}
                        crossOrigin="anonymous"
                        onLoadedMetadata={(event: BaseSyntheticEvent) =>
                            calculateDuration(clip.clipId, event)
                        }
                    ></video>
                );
            })}
            {/* bgm재생 */}
            <audio
                src={selectedBGMUrl}
                crossOrigin="anonymous"
                controls
                ref={bgmRef}
                style={{ display: 'none' }}
                loop
            >
                오디오
            </audio>
        </section>
    );
}
