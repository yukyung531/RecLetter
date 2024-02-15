import { useState, useEffect, useRef, BaseSyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipInfo,
    ScriptTemplate,
    StudioDetail,
    UserInfo,
} from '../types/type';
import MyClipCard from '../components/MyClipCard';
import getBlobDuration from 'get-blob-duration';
import DeleteCheckWindow from '../components/DeleteCheckWindow';

//axios
import { getScript } from '../api/template';
import { httpStatusCode } from '../util/http-status';
import ScriptTemplateCard from '../components/ScriptTemplateCard';
import { getUser } from '../api/user';
import { disconnect } from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';
import { getlastPath } from '../util/get-func';
import {
    studioAddState,
    studioDeleteState,
    studioNameState,
} from '../util/counter-slice';
import { enterStudio, studioDetail } from '../api/studio';
import ErrorModal from '../components/ErrorModal';
import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';
import GuideModal from '../components/GuideModal';

interface Const {
    audio: boolean;
    video: boolean;
}

export default function ClipRecordPage() {
    //모달
    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    /** closeModal()
     *  모달 닫기
     */
    const closeModal = () => {
        setIsModalActive(false);
    };

    //영상 길이 경고
    const [isRecordLimitModalActive, setIsRecordingLimitModalActive] =
        useState<boolean>(false);
    const watchWarningRef = useRef<boolean>(true);

    /** closeWarning() 경고창 종료 */
    const closeWarning = () => {
        setIsRecordingLimitModalActive(false);
        startRecord();
    };

    // 영상없이 다음 단계로 이동하려할 때 모달
    const [isRecordModalActive, setIsRecordModalActive] =
        useState<boolean>(false);
    const closeRecordModal = () => {
        setIsRecordModalActive(false);
    };

    //모드 0:영상, 1:스크립트
    const [mode, setMode] = useState<number>(0);

    const [isRecording, setIsRecording] = useState<boolean>(false);

    const [myClipList, setMyClipList] = useState<ClipInfo[]>([]);

    //스크립트 선택된 것
    const [selectedScript, setSelectedScript] = useState<string>('');
    const scriptRef = useRef<HTMLTextAreaElement>(null);

    const [scriptList, setScriptList] = useState<ScriptTemplate[]>([]);

    //인코딩 옵션
    const encoderOptions = {
        audioBitsPerSecond: 256000,
        videoBitsPerSecond: 7500000,
        mimeType: 'video/webm; codecs=vp9',
    };

    /** 리덕스 설정 */
    const dispatch = useDispatch();
    const studioName = useSelector((state: any) => state.loginFlag.studioName);
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const chatStudioList: string[] = useSelector(
        (state: any) => state.loginFlag.studioId
    );

    /**handleScript()
     * 사이드바 textarea에 작성한 script를 중앙 상단의 출력창에 바인딩한다.
     */
    const handleScript = () => {
        if (scriptRef.current) {
            setSelectedScript(scriptRef.current.value);
        }
    };

    //유저 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userId: '',
        userNickname: '',
        userEmail: '',
    });

    //url로부터 스튜디오 제목 불러오기
    const studioTitle: string | null = new URLSearchParams(location.search).get(
        'title'
    );

    //영상 번호
    let clipNumber: number = myClipList.length;

    //선택한 영상 정보
    const [selectedClip, setSelectedClip] = useState<ClipInfo>({
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

    //플레이 상태
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    ////////////////////////타이머 기능///////////////////////////////////////////////////////
    const timer = useRef<number | null | NodeJS.Timeout>(null);
    const [nowTime, setNowTime] = useState<number>(0);

    /**handltTimerStart()
     * 영상 촬영 시 사용하는 타이머를 시작한다.
     * 1초에 nowTime이 1씩 증가한다.
     */
    const handleTimerStart = () => {
        timer.current = setInterval(() => {
            setNowTime((prev) => prev + 1);
        }, 1000);
    };

    /**handleTimerEnd()
     * 영상 촬영을 끝냈을 때 타이머를 끝낸다.
     * nowTime을 초기화하고, timer설정을 clear한다.
     */
    const handleTimerEnd = () => {
        if (timer.current) {
            setNowTime(0);
            clearInterval(timer.current);
        }
    };

    ///////////////////////타이머 기능 종료///////////////////////////////////////////////////

    ////////////////////////스크립트 좌우////////////////////////////////////////////////
    const selectedScriptRef = useRef<HTMLDivElement>(null);

    /** goUp()
     *  스크립트 < 버튼 누를 시 실행
     *  위쪽 스크립트 보여주기
     */
    const goUp = () => {
        if (selectedScriptRef.current) {
            selectedScriptRef.current.scrollTop -= 56;
        }
    };

    /** goDown()
     *  스크립트 > 버튼 누를 시 실행
     *  아래쪽 스크립트 보여주기
     */
    const goDown = () => {
        if (selectedScriptRef.current) {
            selectedScriptRef.current.scrollTop += 56;
        }
    };

    /** 방향키 위 아래 */
    window.onkeydown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            goUp();
        } else if (event.key === 'ArrowRight') {
            goDown();
        }
    };

    /////////웹캠 구간////////////////////////////////////////////////////////////

    //미디어스트림 저장 변수
    const defaultMS = new MediaStream();

    const [mS, setMS] = useState<MediaStream>(defaultMS);

    //미디어레코더 저장 변수
    const defaultMrecorder = new MediaRecorder(defaultMS, encoderOptions);

    const [mediaRecorder, setMediaRecorder] =
        useState<MediaRecorder>(defaultMrecorder);

    // 비디오 미리보기 ref
    const videoOutputRef = useRef<HTMLVideoElement>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);

    //영상 권한
    const constraints = {
        audio: true,
        video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment',
            frameRate: { max: 30 },
        },
    };

    //스튜디오 정보
    const [studioDetailInfo, setStudioDetailInfo] = useState<StudioDetail>({
        studioId: '',
        studioTitle: '',
        studioStatus: '',
        studioOwner: '',
        clipInfoList: [],
        studioFrameId: -1,
        studioBGMId: -1,
        studioStickerUrl: '',
        studioBGMVolume: 100,
        expireDate: new Date(),
    });

    //studioId
    const splitUrl = document.location.href.split('/');
    const studioId = splitUrl[splitUrl.length - 1];

    const regex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    /**useEffect를 이용한 촬영 준비 설정
     * 오디오, 비디오 권한을 받아, 허가를 얻으면 mediaStream을 얻는다.
     * 해당 스트림을 비디오 녹화 화면(videoOutputRef)와 연결하여 현재 웹캠으로 촬영되는 화면의 미리보기를 실행한다.
     */
    useEffect(() => {
        //웹캠 영상 미리보기
        navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
            if (videoOutputRef.current !== null) {
                //촬영되는 화면 미리보기 코드
                videoOutputRef.current.srcObject = mediaStream;

                videoOutputRef.current.onloadedmetadata = () => {
                    if (videoOutputRef.current !== null) {
                        videoOutputRef.current.play();
                    }
                };
                //촬영되는 화면 미리보기 코드끝
                setMS(mediaStream);
            }
            setMS(mediaStream);
        });

        /**loadScript()
         * 스크립트 템플릿 불러오기
         */
        const loadScript = async () => {
            getScript()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        const arr = [...res.data.scriptTemplate];
                        setScriptList(arr);
                    } else {
                        // console.log('네트워크는 올바르나 응답이 문제');
                    }
                })
                .catch((err) => {
                    // console.log('네트워크 에러');
                    console.log(err);
                });
        };
        loadScript();

        const token = localStorage.getItem('access-token');
        if (isLogin) {
            //API 불러오는 함수로 clipInfo를 받아옴
            //우선 url query String으로부터 스튜디오 상세 정보 받아오기

            const studioId = getlastPath();
            if (studioId !== '') {
                const getDetail = async (studioId: string) => {
                    await studioDetail(studioId).then((res) => {
                        if (res.status === httpStatusCode.OK) {
                            setStudioDetailInfo(res.data);
                            setSelectImgUrl(
                                `/src/assets/frames/frame${res.data.studioFrameId}.png`
                            );
                            if (res.data.studioStatus === 'COMPLETE') {
                                alert('완성된 비디오입니다.');
                                navigate('/studiolist');
                            }
                            // 채팅방 불러오기 설정
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
        if (!token || !isLogin) {
            setIsModalActive(true);
        }

        //+유저 정보 불러오기
        const getUserInfo = async () => {
            const resuser = await getUser();
            const tempObj = { ...resuser.data };
            setUserInfo({
                userId: tempObj.userId,
                userNickname: tempObj.userNickname,
                userEmail: tempObj.userEmail,
            });
        };
        getUserInfo();

        /** 페이지 새로고침 전에 실행 할 함수 */
        const reloadingStudioId = getlastPath();
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const studioId = getlastPath();
            disconnect(studioId);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            //url 초기화(자원관리)
            myClipList.map((clip) => {
                URL.revokeObjectURL(clip.clipUrl);
            });
            //mediaStream 소멸
            const trackList: MediaStreamTrack[] = mS.getTracks();
            for (let i = 0; i < trackList.length; i++) {
                trackList[i].stop();
                mS.removeTrack(trackList[i]);
            }

            // console.log('사라지기전 ' + reloadingStudioId + '입니다');
            if (reloadingStudioId) {
                dispatch(studioDeleteState(reloadingStudioId));
                disconnect(reloadingStudioId);
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
        };
    }, []);

    /**startRecord()
     * 영상 녹화시작 함수
     * 영상 녹화를 시작한다. 녹화 버튼을 누르면 실행되는 함수다.
     * MediaRecorder를 불러와 webm형태의 비디오를 스트림 받는다.
     * 데이터를 전달 받으면 mediaData라는 Blob배열에 저장한다.
     * 녹화 중지 시, blob 정보가 저장된 url을 생성하고, 촬영한 영상을 띄운다.
     * 타이머를 중지한다.
     */
    const startRecord = () => {
        //일단 재생하던 영상은 멈춰
        stopVideo();

        const mediaData: Blob[] = [];

        //MediaRecorder 생성자 호출, webm형식 저장
        const newMediaRecorder = new MediaRecorder(mS, encoderOptions);

        //전달받은 데이터 등록
        newMediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                mediaData.push(event.data);
            }
        };

        //녹화 중지 시
        newMediaRecorder.onstop = () => {
            setIsRecording(false);
            clipNumber++; //클립번호 추가
            async function getBlobInfo() {
                const blob = new Blob(mediaData, {
                    type: 'video/webm; codecs=vp9',
                });
                const duration = await getBlobDuration(blob);

                //webm객체에 정보 추가 후 변환
                //영상 미리보기 출력
                const newURL: string = URL.createObjectURL(blob);
                const recording = videoOutputRef.current;
                const preview = videoPreviewRef.current;
                if (recording && preview) {
                    preview.src = newURL;
                    preview.style.display = 'block';
                    recording.style.display = 'none';
                }

                //새 클립 정보 생성
                if (userInfo.userEmail) {
                    const newClip: ClipInfo = {
                        clipId: clipNumber,
                        clipTitle: userInfo.userNickname + ' ' + clipNumber,
                        clipOwner: userInfo.userEmail,
                        clipLength: duration,
                        clipThumbnail: '/src/assets/images/nothumb.png',
                        clipUrl: newURL,
                        clipOrder: 0,
                        clipVolume: 50,
                        clipContent: 'S',
                    };

                    const newArray = [newClip, ...myClipList];
                    setMyClipList(newArray);
                    setSelectedClip(newClip);
                }
            }
            getBlobInfo();
            handleTimerEnd();
        };

        //녹화 시작
        newMediaRecorder.start();
        setMediaRecorder(newMediaRecorder);
        //녹화 표시, 화면 전환, 타이머 시작
        setIsRecording(true);
        handleRecordMode();
        handleTimerStart();
    };

    /**endRecord()
     * 영상 녹화를 끝낸다. mediaRecorder를 멈춰 먼저 정의되어 있던 프로세스를 수행한다.
     */
    const endRecord = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
        setMode(0);
        setIsPlaying(true); //영상 녹화 종료 후 video는 autoplay로 인해 바로 실행
    };

    /**handleRecordMode()
     * 저장된 영상들을 보다가 웹캠 녹화 화면으로 이동을 원할 때 사용한다.
     * 사이드바의 영상 촬영하기 버튼을 누르면 나온다.
     * 촬영된 비디오 보기(videoPreviewRef)를 안보이게, 웹캠 화면(videoOutputRef)을 보이게 설정한다.
     */
    const handleRecordMode = () => {
        pauseVideo();
        if (videoOutputRef.current && videoPreviewRef.current) {
            videoPreviewRef.current.style.display = 'none';
            videoOutputRef.current.style.display = 'block';
        }
    };

    ////////////웹캠 구간 종료////////////////////////////////////////////////////////////////////////////////

    ////////////////////영상 리스트 기능////////////////////////////////////////////////////////////////////////

    /**onLinkClick()
     * 사이드바에서 클릭한 영상을 화면에 보여준다.
     * @param clipId
     * clipId는 현재 선택한 클립의 번호다.
     */
    const onLinkClick = (clipId: number) => {
        //클립 선택
        const clip: ClipInfo[] = myClipList.filter(
            (prev) => clipId === prev.clipId
        );
        setSelectedClip(clip[0]);
    };

    /**changeMode()
     * 사이드바 조종 함수
     * 사이드바에 영상리스트, 스크립트 중 하나를 선택하도록 만든다.
     * @param mode
     * 0: 영상 리스트, 1: 스크립트
     */
    const changeMode = (mode: number) => {
        setMode(mode);
    };

    //삭제 모달 관련 state
    const [isDeleting, setIsDeleting] = useState<boolean>(false); //삭제확인창 띄우기 여부
    const [deleteStateId, setDeleteStateId] = useState<number>(-1); //삭제하는 요소의 id

    /**onPressDelete(clipId : number)
     * 영상 리스트에서 영상 삭제를 누르면 나온다.
     * 영상 삭제 창을 활성화시킨다.
     * @param clipId
     * 클립의 고유 id다. 이 id를 지울것이라 설정한다.
     */
    const onPressDelete = (clipId: number) => {
        setIsDeleting(true);
        setDeleteStateId(clipId);
    };

    /**chooseDelete()
     * 삭제 확인창에서 삭제를 눌렀을 때 호출되는 함수다.
     * 호출 시, 해당 요소를 myClipList에서 삭제한다. 그리고 삭제 확인 창을 닫늗다.
     */
    const chooseDelete = () => {
        //선택된 비디오였다면 초기화
        if (selectedClip.clipId === deleteStateId) {
            setSelectedClip({
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
        }

        setMyClipList((prevList) => {
            for (let i = 0; i < prevList.length; i++) {
                if (prevList[i].clipId === deleteStateId) {
                    URL.revokeObjectURL(prevList[i].clipUrl); //url 삭제
                    prevList.splice(i, 1);
                    break;
                }
            }
            const newList: ClipInfo[] = [...prevList];
            return newList;
        });

        //삭제 여부 초기화
        setDeleteStateId(-1);
        setIsDeleting(false);
    };

    /**chooseNotDelete()
     * 삭제 취소를 선택하면 나오는 창이다.
     * 삭제 확인 창을 닫기만 한다.
     */
    const chooseNotDelete = () => {
        setDeleteStateId(-1);
        setIsDeleting(false);
    };

    //클립 이름 변경 관련 state
    const [changingName, setChangingName] = useState<string>('');

    /**onNameChange(clipId : number)
     * 클립의 이름 변경을 완료하면 호출되는 함수다.
     * 입력된 이름으로 해당 클립의 이름을 바꾼다.
     * @param clipId
     * 클립의 고유 id다.
     */
    const onNameChange = (clipId: number) => {
        //현재 변경중인 이름 요소 찾아 변경
        setMyClipList((prevList) => {
            for (let i = 0; i < prevList.length; i++) {
                if (prevList[i].clipId === clipId) {
                    prevList[i].clipTitle = changingName;
                    break;
                }
            }
            const newList: ClipInfo[] = [...prevList];
            return newList;
        });
    };

    /**영상 60초 제한 */
    if (nowTime >= 59) {
        handleTimerEnd();
        endRecord();
    }

    /////////////////////////영상리스트 기능 종료//////////////////////////////////////////////

    ///영상 재생//////////////////////////////////////////////////////////////////////////////

    /** playVideo()
     * 영상 재생 버튼을 누르면 나오는 함수다.
     * 클립 리스트에 있는 영상 중, 선택한 영상, 또는 최근에 감상한 영상을 재생한다.
     */
    const playVideo = () => {
        setIsPlaying(true);
        //영상 재생 화면 띄우기
        const recording = videoOutputRef.current;
        const preview = videoPreviewRef.current;
        if (recording && preview && preview.style.display === 'none') {
            preview.style.display = 'block';
            recording.style.display = 'none';
        }
        //영상재생
        if (preview) {
            preview.play();
        }
    };

    /** pauseVideo()
     * 일시정지 버튼을 누르면 호출되는 함수다.
     * 영상 재생이 일시정지된다.
     */
    const pauseVideo = () => {
        setIsPlaying(false);
        const preview = videoPreviewRef.current;
        if (preview) {
            preview.pause();
        }
    };

    /** stopVideo()
     *  정지 버튼을 누르면 호출되는 함수다.
     *  영상 재생이 정지되고, 처음 위치로 돌아간다.
     */
    const stopVideo = () => {
        setIsPlaying(false);
        const preview = videoPreviewRef.current;
        if (preview) {
            preview.pause();
            preview.currentTime = 0;
        }
    };

    /////////////////////////////클립 편집 페이지로 이동//////////////////////////////

    const navigate = useNavigate();

    /**goToClipEdit()
     * 영상 편집 페이지로 이동한다.
     */
    const goToClipEdit = () => {
        const preview = selectedClip;
        if (preview) {
            if (preview.clipUrl) {
                //url기반 영상 정보 검색
                //이렇게 해주는 이유는 State로 관리하기에는 복잡하고, 영상 편집하기 버튼 눌렀을 때만 필요해, 굳이 평소에 일일이 관리할 필요 없어서
                for (let i = 0; i < myClipList.length; i++) {
                    if (myClipList[i].clipUrl === preview.clipUrl) {
                        const videoInfo: ClipInfo = myClipList[i];
                        blobToBase64(preview.clipUrl, videoInfo);
                    }
                }
                //navigate 직전에 blob url 정리할 것
            } else {
                //에러창 출력
                setIsRecordModalActive(true);
                // console.log('선택된 영상이 없습니다. 영상을 선택해 주세요.');
            }
        }
    };

    /**blob객체를 base64로 바꾸는 함수 */
    async function blobToBase64(blobUrl: string, videoInfo: ClipInfo) {
        // Blob URL에서 데이터 불러오기
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        // Blob 데이터를 Base64로 변환
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64 = reader.result;
            //url 초기화(자원관리)
            myClipList.map((clip) => {
                URL.revokeObjectURL(clip.clipUrl);
            });
            //mediaStream 소멸
            const trackList: MediaStreamTrack[] = mS.getTracks();
            for (let i = 0; i < trackList.length; i++) {
                trackList[i].stop();
                mS.removeTrack(trackList[i]);
            }

            if (base64 && typeof base64 === 'string') {
                navigate(`/clipEdit/${studioId}`, {
                    state: { videoInfo, base64 },
                });
            }
        };
    }

    /////////////////////////////////프레임 설정////////////////////////////////////////
    const [selectImgUrl, setSelectImgUrl] = useState<string>('');

    ///////////////////////////////렌더링 화면//////////////////////////////////////////
    return (
        <section className="relative section-top pt-14 ">
            {isModalActive ? (
                <ErrorModal onClick={closeModal} message="오류가 났습니다" />
            ) : (
                <></>
            )}
            {isRecordModalActive ? (
                <ErrorModal
                    onClick={closeRecordModal}
                    message="촬영된 영상이 없습니다. 영상을 촬영해 주세요."
                />
            ) : (
                <></>
            )}
            {isRecordLimitModalActive ? (
                <>
                    <GuideModal
                        onClick={closeWarning}
                        message="영상은 최대 1분까지 촬영 가능합니다."
                    />
                    <div
                        className="z-20 fixed top-2/3 left-1/2 shadow-lg text-white"
                        style={{ transform: 'translate(-50%, 0%)' }}
                    >
                        <input
                            type="checkbox"
                            onChange={(event) => {
                                watchWarningRef.current = !event.target.checked;
                            }}
                            id="warning"
                        />
                        <label htmlFor="warning">
                            더 이상 안내문을 보지 않습니다.
                        </label>
                    </div>
                </>
            ) : (
                <></>
            )}

            {/* 중앙 섹션 */}
            <div className="flex w-full editor-height">
                {/* 삭제 확인 모달 */}
                {isDeleting ? (
                    <>
                        <div className="w-full h-full absolute top-0 left-0 bg-[#626262] opacity-30 z-20"></div>
                        <div className="absolute top-1/4 left-1/3 opacity-100 z-20">
                            <DeleteCheckWindow
                                onClickOK={chooseDelete}
                                onClickCancel={chooseNotDelete}
                            />
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {/* 좌측부분 */}
                <div className="relative w-1/4 h-full flex flex-col">
                    <div className="w-full h-10 flex justify-between items-center px-12 py-6 border-b-2 color-border-sublight color-text-black">
                        <div className="flex items-center ">
                            <span
                                className="material-symbols-outlined cursor-pointer"
                                onClick={() => {
                                    //url 초기화(자원관리)
                                    myClipList.map((clip) => {
                                        URL.revokeObjectURL(clip.clipUrl);
                                    });
                                    //mediaStream 소멸
                                    const trackList: MediaStreamTrack[] =
                                        mS.getTracks();
                                    for (let i = 0; i < trackList.length; i++) {
                                        trackList[i].stop();
                                        mS.removeTrack(trackList[i]);
                                    }

                                    //navigate
                                    navigate(`/studiomain/${studioId}`);
                                }}
                            >
                                arrow_back_ios
                            </span>
                            <p className="text-2xl ms-3 w-64 truncate">
                                {studioName}
                            </p>
                        </div>
                    </div>
                    {/* 카테고리 */}
                    <div className="flex w-full h-full">
                        <div className="relative w-16 color-text-darkgray color-bg-lightgray1">
                            <div
                                className={`w-full h-16 flex flex-col justify-center items-center cursor-pointer`}
                                onClick={() => {
                                    changeMode(0);
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
                                            ? 'h-16 categori-selected'
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
                                    changeMode(1);
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
                                <span className="material-symbols-outlined text-3xl">
                                    kid_star
                                </span>
                                <p className="font-bold">스크립트</p>
                            </div>
                        </div>
                        {/* 카테고리 선택에 따라 */}
                        {mode === 0 ? (
                            <div className="w-4/5 h-screen flex flex-col items-center p-4 overflow-y-scroll">
                                <div className="w-full py-1 flex justify-start text-xl ">
                                    <p>촬영한 영상</p>
                                </div>
                                {myClipList.map((clip) => {
                                    return (
                                        <MyClipCard
                                            props={clip}
                                            key={clip.clipId}
                                            onClick={() => {
                                                onPressDelete(clip.clipId);
                                            }}
                                            onLinkClick={() => {
                                                onLinkClick(clip.clipId);
                                                playVideo();
                                                setIsPlaying(true); //누르면 autoplay로 자동재생
                                            }}
                                            onNameChange={() =>
                                                onNameChange(clip.clipId)
                                            }
                                            setChangingName={setChangingName}
                                            selectedClip={selectedClip}
                                        />
                                    );
                                })}
                                {/* <button
                                    className="w-full text-xl bg-[#2C75E2] text-white rounded"
                                    onClick={handleRecordMode}
                                >
                                    영상 촬영하기
                                </button> */}
                            </div>
                        ) : (
                            <div className="w-4/5 flex flex-col items-center p-6">
                                <div className="w-full mb-2 flex justify-start text-xl ">
                                    <p>스크립트</p>
                                </div>
                                <textarea
                                    ref={scriptRef}
                                    onChange={handleScript}
                                    rows={4}
                                    placeholder={`하고 싶은 말을 자유롭게 메모하세요.\n녹화하면서 확인할 수 있어요.`}
                                    className="text-base mb-3 pl-2 text-black min-h-36 w-full border-black border-solid border-2 rounded overflow-y-scroll"
                                ></textarea>

                                <div className="mb-2 w-full flex justify-start text-xl">
                                    <p>템플릿 불러오기</p>
                                </div>
                                <div className="overflow-y-scroll">
                                    {scriptList.map((script) => {
                                        return (
                                            <ScriptTemplateCard
                                                key={script.scriptId}
                                                props={script}
                                                onClick={() => {
                                                    setSelectedScript(
                                                        script.scriptContent
                                                    );
                                                    //스크립트 연동
                                                    if (scriptRef.current) {
                                                        scriptRef.current.value =
                                                            script.scriptContent;
                                                    }
                                                    //맨 첫번째 구문으로
                                                    if (
                                                        selectedScriptRef.current
                                                    ) {
                                                        selectedScriptRef.current.scrollTop = 0;
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4  editor-height bg-gray-50 flex justify-between">
                    <div className="w-4/5 px-4 py-4 flex flex-col items-center">
                        <div className="box-border my-3 py-3 min-h-[80px] h-[80px] rounded-full border-2 border-black movie-width text-xl whitespace-pre-wrap flex align-middle justify-between text-center">
                            <button className="pl-4" onClick={goUp}>
                                &#60;
                            </button>
                            <div
                                className="min-h-[56px] h-[56px] overflow-hidden"
                                ref={selectedScriptRef}
                            >
                                {selectedScript}
                            </div>
                            <button className="pr-4" onClick={goDown}>
                                &#62;
                            </button>
                        </div>
                        <div className="w-[800px] h-[450px] flex justify-center align-middle bg-black relative">
                            {/*영상 촬영 화면*/}
                            <video
                                className="bg-black border my-2"
                                style={{
                                    transform: `rotateY(180deg)`,
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    display: 'block',
                                }}
                                ref={videoOutputRef}
                                muted
                            />
                            {/*영상 감상 화면*/}
                            <video
                                className="bg-black border my-2"
                                style={{
                                    transform: `rotateY(180deg)`,
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    display: 'none',
                                }}
                                ref={videoPreviewRef}
                                src={selectedClip.clipUrl}
                                autoPlay
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
                            {studioDetailInfo.studioStickerUrl.match(regex) ? (
                                <img
                                    src={studioDetailInfo.studioStickerUrl}
                                    className="absolute top-0 lef-0"
                                    crossOrigin="anonymous"
                                    style={{
                                        width: '800px',
                                        aspectRatio: 16 / 9,
                                    }}
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="w-1/5 flex flex-col justify-around items-center">
                        <div
                            onClick={goToClipEdit}
                            className="btn-cover color-bg-main text-white"
                        >
                            다음단계로
                        </div>
                        <div>
                            <div>
                                {/* 녹화중 아니면 녹화버튼, 녹화중이면 정지 버튼 */}
                                {!isRecording ? (
                                    <div
                                        className="w-32 p-1 flex items-center justify-center border border-gray-100 rounded-lg shadow-md cursor-pointer"
                                        onClick={() => {
                                            if (watchWarningRef.current) {
                                                //경고문 보는 상태면 경고창 출력
                                                setIsRecordingLimitModalActive(
                                                    true
                                                );
                                            } else {
                                                //아니면 바로 녹화 시작
                                                startRecord();
                                            }
                                        }}
                                    >
                                        <span className="mx-1 material-symbols-outlined text-2xl text-[#626262]">
                                            radio_button_checked
                                        </span>
                                        <span
                                            className={
                                                isRecording
                                                    ? 'text-red-500 mx-1'
                                                    : 'text-[#626262] mx-1'
                                            }
                                        >
                                            ON-AIR
                                        </span>
                                    </div>
                                ) : (
                                    <div
                                        className="w-32 p-1 flex flex-col items-center justify-center border color-border-main rounded-lg shadow-md cursor-pointer"
                                        onClick={endRecord}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span className="material-symbols-outlined text-2xl color-text-main mx-2">
                                                radio_button_checked
                                            </span>
                                            <span
                                                className={
                                                    isRecording
                                                        ? 'text-red-500 mx-1'
                                                        : 'text-[#626262] mx-1'
                                                }
                                            >
                                                ON-AIR
                                            </span>
                                        </div>
                                        <span className="text-2xl">
                                            {Math.floor(nowTime / 60)} :{' '}
                                            {nowTime >= 10
                                                ? nowTime % 60
                                                : '0' + (nowTime % 60)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="my-4"></div>
                            <div className="w-32 px-2 p-1 flex justify-around items-center border border-gray-100 rounded-lg shadow-md">
                                {/* 녹화중 아니면 재생 버튼, 녹화중에는 타이머 비활성화 */}
                                {!isRecording ? (
                                    <>
                                        {!isPlaying ? (
                                            <span
                                                className="material-symbols-outlined me-1 text-2xl cursor-pointer text-[#626262]"
                                                onClick={playVideo}
                                            >
                                                play_circle
                                            </span>
                                        ) : (
                                            <span
                                                className="material-symbols-outlined me-1 text-2xl cursor-pointer text-[#626262]"
                                                onClick={pauseVideo}
                                            >
                                                pause_circle
                                            </span>
                                        )}
                                        <p className=" h-6 border color-border-darkgray"></p>
                                        <span
                                            className="material-symbols-outlined me-1 text-2xl cursor-pointer text-[#626262]"
                                            onClick={stopVideo}
                                        >
                                            stop_circle
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined me-1 text-2xl cursor-pointer text-[#D9D9D9]">
                                            play_circle
                                        </span>
                                        <p className=" h-6 border border-[#D9D9D9]"></p>
                                        <span className="material-symbols-outlined me-1 text-2xl cursor-pointer text-[#D9D9D9]">
                                            stop_circle
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
