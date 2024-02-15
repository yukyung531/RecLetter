import { useLocation, useNavigate } from 'react-router-dom';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { ClipInfo, StudioDetail } from '../types/type';

//axios
import { uploadClip } from '../api/clip';
import { httpStatusCode } from '../util/http-status';
import { disconnect } from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';
import { getlastPath } from '../util/get-func';
import {
    studioAddState,
    studioDeleteState,
    studioNameState,
} from '../util/counter-slice';
import { getUser } from '../api/user';
import { enterStudio, studioDetail } from '../api/studio';
import LoadingModal from '../components/LoadingModal';
import ErrorModal from '../components/ErrorModal';

export default function ClipEditPage() {
    /** 리덕스 설정 */
    const dispatch = useDispatch();
    const studioName = useSelector((state: any) => state.loginFlag.studioName);
    const isLogin = useSelector((state: any) => state.loginFlag.isLogin);
    const chatStudioList: string[] = useSelector(
        (state: any) => state.loginFlag.studioId
    );

    //에러모달
    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    /** closeModal()
     *  모달창 종료
     */
    const closeModal = () => {
        setIsModalActive(false);
    };

    ///////////////////////////////영상 정보 불러오기///////////////////////////////////////////////////////////
    const location = useLocation();

    const videoInfo: ClipInfo = location.state.videoInfo;
    const base64: string = location.state.base64;

    //////////////////////////로딩 직후 초기 설정///////////////////////////////////////////////////////
    const [loaded, setLoaded] = useState<boolean>(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    //시작, 끝 시간 설정
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(59);

    const [endMaxtime, setEndMaxTime] = useState<number>(59);

    //로딩중
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //텍스트 연동 설정
    const [inputText, setInputText] = useState<string>('');

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

    //비디오 재생중인가
    const [playingVideo, setPlayingVideo] = useState<boolean>(false);

    /** formatTime(time: number)
     * 초를 입력하면 0:00 형식으로 변환한다.
     * @param time
     * @returns
     */
    const formatTime = (time: number) => {
        const min = Math.floor(time / 60);
        const sec =
            Math.floor(time % 60) < 10
                ? '0' + Math.floor(time % 60)
                : '' + Math.floor(time % 60);
        return `${min}: ${sec}`;
    };

    /** korFormatTime(time: number)
     *  초를 입력하면 0분 00초 형식으로 변경
     * @param time
     * @returns
     */
    const korFormatTime = (time: number) => {
        const min = Math.floor(time / 60);
        const sec =
            Math.floor(time % 60) < 10
                ? '0' + Math.floor(time % 60)
                : '' + Math.floor(time % 60);
        return `${min}분 ${sec}초`;
    };

    const [videoNowPosition, setVideoNowPosition] = useState<number>(0);
    const [wholeDuration, setWholeDuration] = useState<number>(0);

    /////////////////////////////////프레임 설정////////////////////////////////////////
    const [selectImgUrl, setSelectImgUrl] = useState<string>('');

    //비디오 이름
    const [clipName, setClipName] = useState<string>(videoInfo.clipTitle);

    //studioId
    const splitUrl = document.location.href.split('/');
    const studioId = splitUrl[splitUrl.length - 1];

    /**ffmpegload()
     * 영상을 인코딩하는데 사용하는 ffmpeg을 불러오는 곳이다.
     */
    const ffmpegload = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('log', ({ message }) => {
            // console.log(message);
        });

        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.js`,
                'text/javascript'
            ),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                'application/wasm'
            ),
            workerURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.worker.js`,
                'text/javascript'
            ),
        });
        setLoaded(true);
    };

    /**transcodeToMp4()
     * webm형식으로 되어 있는 파일을 mp4 파일로 변환한다.
     */
    const transcodeToMp4 = async () => {
        const ffmpeg = ffmpegRef.current;
        //blob into file
        const videoFile = await base64ToBlob(base64);
        //비디오 인코딩 webm -> mp4
        await ffmpeg.writeFile('input.webm', await fetchFile(videoFile));
        await ffmpeg.exec(['-i', 'input.webm', '-c', 'copy', 'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        const newBlob = new Blob([data], { type: 'video/mp4' });
        if (videoRef.current) {
            videoRef.current.src = URL.createObjectURL(newBlob);
        }
    };

    /**base64ToBlob(base64: string)
     * base64형태로 전달 받은 영상 파일을 blob 객체로 변환한다.
     * @param base64
     * @returns
     */
    const base64ToBlob = async (base64: string) => {
        const response = await fetch(base64);
        const blob = await response.blob();
        return blob;
    };

    /**loadVideoMetadata()
     * 비디오의 길이나 기본정보 로딩
     */
    const loadVideoMetadata = async () => {
        if (videoRef.current) {
            setEndMaxTime(videoInfo.clipLength);
            setEndTime(videoInfo.clipLength);
        }
    };

    /**
     * 화면이 렌더링 된 후, useEffect를 이용해 ffmpeg을 불러오고, mp4로 영상을 바꾼 후, 관련 정보에 따라 업데이트한다.
     */
    useEffect(() => {
        const loading = async () => {
            await ffmpegload();
            await transcodeToMp4();
            await loadVideoMetadata();
        };
        loading();

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
                            if (res.data.studioStatus === 'COMPLETE') {
                                alert('완성된 비디오입니다.');
                                navigate('/studiolist');
                            }
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
            setIsModalActive(true);
        }

        /** 페이지 새로고침 전에 실행 할 함수 */
        const reloadingStudioId = getlastPath();
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const studioId = getlastPath();
            disconnect(studioId);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            // console.log('사라지기전 ' + reloadingStudioId + '입니다');
            if (reloadingStudioId) {
                dispatch(studioDeleteState(reloadingStudioId));
                disconnect(reloadingStudioId);
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
        };
    }, []);

    ///////////////////////////////////////영상 자르기///////////////////////////////////////////////

    /** changeStartTime(event)
     *  자르는 시간의 시작 시간을 변경한다.
     * @param event
     */
    const changeStartTime = (event: BaseSyntheticEvent) => {
        const nextVal = event.target.value;
        if (nextVal >= 0 && nextVal < endTime) {
            setStartTime(event.target.value);
        }
    };

    /** changeEndTime(event)
     *  자르는 시간의 끝 시간을 변경한다.
     * @param event
     */
    const changeEndTime = (event: BaseSyntheticEvent) => {
        const nextVal = event.target.value;
        if (nextVal > startTime && nextVal <= endMaxtime) {
            setEndTime(event.target.value);
        }
    };

    /** makeFinalVideo()
     *  설정된 시간대로 잘라서 서버로 전송한다.
     */
    const makeFinalVideo = async () => {
        setIsLoading(true);
        const ffmpeg = ffmpegRef.current;
        if (videoRef.current) {
            const prevURL = videoRef.current.src;
            await ffmpeg.writeFile(
                'input.mp4',
                await fetchFile(videoRef.current.src)
            );
            const startTimeString = `00:00:${
                startTime < 10 ? '0' + startTime : startTime
            }`;
            const endTimeString = `00:00:${
                endTime < 10 ? '0' + endTime : endTime
            }`;
            await ffmpeg.exec([
                '-ss',
                startTimeString,
                '-to',
                endTimeString,
                '-i',
                'input.mp4',
                '-map',
                '0',
                '-c',
                'copy',
                'final.mp4',
            ]);
            const data = await ffmpeg.readFile('final.mp4');
            const newBlob = new Blob([data], { type: 'video/mp4' });
            // console.log(data);

            //axios 전송
            if (studioId) {
                //make formdata
                const clipForm = new FormData();
                clipForm.append('studioId', studioId);
                clipForm.append('clipTitle', clipName);
                clipForm.append('clipContent', '');
                clipForm.append('clip', newBlob);

                type ObjectType = {
                    [key: string]: FormDataEntryValue;
                };
                //formdata to json
                const object: ObjectType = {};
                clipForm.forEach((value, key) => {
                    object[key.toString()] = value;
                });

                await uploadClip(object)
                    .then((response) => {
                        if (response && response.status === httpStatusCode.OK) {
                            // console.log('영상이 성공적으로 전달되었습니다.');
                            //revokeURL
                            URL.revokeObjectURL(prevURL);
                            setIsLoading(false);
                            navigate(`/studiomain/${studioId}`);
                        } else {
                            console.log('영상 전송에 실패하였습니다.');
                        }
                    })
                    .catch((err: Error) => {
                        console.log(err);
                    });
            }

            //revokeURL
            URL.revokeObjectURL(prevURL);
        }
    };

    //////////////////////////////////////////////재생시간 제한///////////////////////////////////

    /** timeChange(event)
     *  재생 시 시작, 끝 시간을 자르는 시간으로 제한한다.
     * @param event
     */
    const timeChange = (event: BaseSyntheticEvent) => {
        const nowTime = event.target.currentTime;
        if (nowTime < startTime) {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = startTime;
                videoRef.current.play();
            }
        }

        if (nowTime > endTime) {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = startTime;
                videoRef.current.play();
            }
        }
    };

    /** resetSettings()
     *  설정 초기화 버튼 누르면 작동
     *  시작, 종료 시간 초기화
     */
    const resetSettings = () => {
        setStartTime(0);
        setEndTime(endMaxtime);
    };

    ///영상 재생//////////////////////////////////////////////////////////////////////////////

    /** playVideo()
     * 영상 재생 버튼을 누르면 나오는 함수다.
     * 영상이 재생된다.
     */
    const playVideo = () => {
        setPlayingVideo(true);
        //영상재생
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    /** stopVideo()
     *  영상 정지 버튼 누르면 호출되는 함수다.
     *  영상 재생이 일시정지된다.
     */
    const stopVideo = () => {
        setPlayingVideo(false);
        //영상정지
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    //////////////////////////////////서브 텍스트 입력/////////////////////////////////////////////////
    /** changeText()
     *  서브텍스트 입력
     * @param event
     */
    const changeText = (event: BaseSyntheticEvent) => {
        setInputText(event.target.value);
    };

    ///////////////////////////////////////렌더링 부분////////////////////////////////////////////////////////////////

    return (
        <section className="relative section-top pt-14">
            {isLoading ? <LoadingModal /> : <></>}
            {isModalActive ? (
                <ErrorModal onClick={closeModal} message="오류가 났습니다" />
            ) : (
                <></>
            )}

            {/* 중앙 섹션 */}
            <div className="flex w-full">
                {/* 좌측부분 */}
                <div className="w-1/5 flex flex-col editor-height">
                    <div className="w-full h-10 flex justify-between items-center px-12 py-6 border-b-2 color-border-sublight color-text-black">
                        <div className="flex items-center ">
                            <span
                                className="material-symbols-outlined cursor-pointer"
                                onClick={() => {
                                    //navigate
                                    navigate(`/cliprecord/${studioId}`);
                                }}
                            >
                                arrow_back_ios
                            </span>
                            <p className="text-2xl ms-3 w-64 truncate">
                                {studioDetailInfo.studioTitle}
                            </p>
                        </div>
                    </div>
                    {loaded ? (
                        // 로딩 후
                        <div className="w-full flex flex-col items-center p-6 overflow-y-scroll">
                            <div className="w-56 flex justify-start text-xl text-[#FF777F]">
                                <p>선택 영상 편집</p>
                            </div>
                            <div className="w-56 flex justify-start text-xl ">
                                <p>사용할 구간 선택</p>
                            </div>
                            <div className="my-2 flex justify-center items-center">
                                <input
                                    className="w-16 p-2 border border-black rounded text-center"
                                    type="number"
                                    value={startTime}
                                    min={0.0}
                                    step={0.01}
                                    onChange={changeStartTime}
                                ></input>
                                <p className="mx-4">~</p>
                                <input
                                    className="w-16 p-2 border border-black rounded text-center"
                                    type="number"
                                    value={endTime}
                                    max={endMaxtime}
                                    step={0.01}
                                    onChange={changeEndTime}
                                ></input>
                            </div>

                            <button
                                className="w-56 mt-6 p-2 border border-[#FF777F] rounded text-[#FF777F] text-xl"
                                onClick={resetSettings}
                            >
                                편집 내용 전체 초기화
                            </button>
                        </div>
                    ) : (
                        //로딩 중
                        <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                            <p>로딩중</p>
                        </div>
                    )}
                </div>
                {/* 우측부분 */}
                <div className="w-full editor-height bg-gray-50 flex justify-between">
                    <div className="w-4/5 py-4 flex flex-col justify-center items-center">
                        {/* 입력 텍스트 */}
                        <input
                            type="text"
                            className="w-[800px] text-2xl bg-white rounded p-4 border-2 border-black"
                            value={clipName}
                            onChange={(event) => {
                                setClipName(event.target.value);
                            }}
                        />
                        {/* 비디오 */}
                        <div className="relative my-2">
                            <video
                                className="bg-black border"
                                style={{
                                    transform: `rotateY(180deg)`,
                                    width: '800px',
                                    height: '450px',
                                    display: 'block',
                                }}
                                ref={videoRef}
                                onTimeUpdate={(event: BaseSyntheticEvent) => {
                                    timeChange(event);
                                    if (videoRef.current) {
                                        setVideoNowPosition(
                                            videoRef.current.currentTime
                                        );
                                    }
                                }}
                                onLoadedData={() => {
                                    if (videoRef.current) {
                                        setWholeDuration(
                                            videoRef.current.duration
                                        );
                                        setEndMaxTime(
                                            videoRef.current.duration
                                        );
                                        setEndTime(videoRef.current.duration);
                                    }
                                }}
                                onEnded={stopVideo}
                            ></video>
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
                        </div>
                        <div className="w-full flex flex-col justify-center items-center my-4">
                            {/* 재생버튼 */}
                            <div className="w-full flex justify-center items-center mt-4 px-12">
                                {/* 비디오 컨트롤러 */}
                                {!playingVideo ? (
                                    <img
                                        className="me-3"
                                        src="/src/assets/icons/play_icon.png"
                                        alt="플레이"
                                        onClick={playVideo}
                                    />
                                ) : (
                                    <img
                                        className="me-[9px] h-[29px]"
                                        src="/src/assets/icons/pause_icon.png"
                                        alt="정지"
                                        onClick={stopVideo}
                                    />
                                )}
                                <div className="w-full h-2 bg-black relative">
                                    <div
                                        className={`h-2 bg-[#FF777F] absolute top-0 left-0 z-10`}
                                        style={{
                                            width: `${
                                                (videoNowPosition /
                                                    wholeDuration) *
                                                100
                                            }%`,
                                            maxWidth: `100%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-full pl-[86px]">
                                {formatTime(videoNowPosition)}/
                                {formatTime(wholeDuration)}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/5 flex flex-col justify-start items-center pr-12 pt-[100px]">
                        {loaded ? (
                            <div
                                onClick={makeFinalVideo}
                                className="w-full py-3 rounded-lg text-center color-bg-main text-white text-xl mb-3 cursor-pointer"
                            >
                                저장하기
                            </div>
                        ) : (
                            <div className="w-full py-3 rounded-lg text-center bg-[#F5F5F5] text-white text-xl mb-3 cursor-pointer">
                                저장하기
                            </div>
                        )}
                        <div className="w-full break-all">
                            <div className="w-full rounded-t-lg text-lg pl-2 bg-[#FFA9A9] text-white">
                                영상 정보
                            </div>
                            <div className="w-full h-full rounded-b-lg text-lg p-2 border-2 border-[#FFA9A9] bg-white whitespace-normal">
                                <p>제목: </p>
                                <p className="min-h-[28px]">{clipName}</p>
                                <p>길이: {korFormatTime(wholeDuration)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
