import { useLocation, useNavigate } from 'react-router-dom';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { ClipInfo } from '../types/type';

//axios
import { uploadClip } from '../api/clip';
import { httpStatusCode } from '../util/http-status';

export default function ClipEditPage() {
    ///////////////////////////////영상 정보 불러오기///////////////////////////////////////////////////////////
    const location = useLocation();

    const videoInfo: ClipInfo = location.state.videoInfo;
    const base64: string = location.state.base64;

    const splitUrl = document.location.href.split('/');
    const studioId = splitUrl[splitUrl.length - 1];

    //////////////////////////로딩 직후 초기 설정///////////////////////////////////////////////////////
    const [loaded, setLoaded] = useState<boolean>(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    //시작, 끝 시간 설정
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(59);

    const [endMaxtime, setEndMaxTime] = useState<number>(59);

    //텍스트 연동 설정
    const [inputText, setInputText] = useState<string>('');

    /**ffmpegload()
     * 영상을 인코딩하는데 사용하는 ffmpeg을 불러오는 곳이다.
     */
    const ffmpegload = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;

        // ffmpeg.on('log', ({ message }) => {
        //     console.log(message);
        // });
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
                '-i',
                'input.mp4',
                '-ss',
                startTimeString,
                '-to',
                endTimeString,
                '-c',
                'copy',
                'final.mp4',
            ]);
            const data = await ffmpeg.readFile('final.mp4');
            const newBlob = new Blob([data], { type: 'video/mp4' });
            console.log(data);

            //axios 전송
            if (studioId) {
                //make formdata
                const clipForm = new FormData();
                clipForm.append('studioId', studioId);
                clipForm.append('clipTitle', name);
                clipForm.append('clipContent', inputText);
                clipForm.append('clip', newBlob);

                type ObjectType = {
                    [key: string]: FormDataEntryValue;
                };
                //formdata to json
                const object: ObjectType = {};
                clipForm.forEach((value, key) => {
                    object[key.toString()] = value;
                });
                console.log(object);

                await uploadClip(object)
                    .then((response) => {
                        if (response && response.status === httpStatusCode.OK) {
                            console.log('영상이 성공적으로 전달되었습니다.');
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
            }
        }

        if (nowTime > endTime) {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = startTime;
            }
        }
    };

    ///영상 재생//////////////////////////////////////////////////////////////////////////////

    /** playVideo()
     * 영상 재생 버튼을 누르면 나오는 함수다.
     * 영상이 재생된다.
     */
    const playVideo = () => {
        //영상재생
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    /** pauseVideo()
     * 일시정지 버튼을 누르면 호출되는 함수다.
     * 영상 재생이 일시정지된다.
     */
    const pauseVideo = () => {
        //영상정지
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    /** stopVideo()
     *  영상 정지 버튼 누르면 호출되는 함수다.
     *  영상 재생이 정지되고, 처음으로 돌아간다.
     */
    const stopVideo = () => {
        //영상정지
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = startTime;
        }
    };

    //프로그레스 바의 현재 상태를 위한 state다.
    const [progress, setProgress] = useState(0);

    /**handleProgress(event)
     * 프로그레스 바와 영상을 동기화한다.
     * @param event
     * 영상이 재생되는 이벤트다.
     * @returns
     * 영상이 만들어진 직후에는 이 값이 없다. 그래서 그냥 생략한다.
     */
    const handleProgress = (event: BaseSyntheticEvent) => {
        if (isNaN(event.target.duration)) {
            return;
        } else {
            setProgress(
                (event.target.currentTime / event.target.duration) * 100
            );
        }
    };

    //////////////////////////////////서브 텍스트 입력/////////////////////////////////////////////////
    const changeText = (event: BaseSyntheticEvent) => {
        setInputText(event.target.value);
    };

    ////////////////////////////////////영상 이름 편집///////////////////////////////////////////////////////////
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [name, setName] = useState<string>(videoInfo.clipTitle);

    ///////////////////////////////////////렌더링 부분////////////////////////////////////////////////////////////////

    return (
        <section className="relative section-top">
            <div className="h-20 w-full px-12 color-text-black flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    {isEditingName ? (
                        // 수정전
                        <>
                            <input
                                className="text-2xl border-2 pl-2"
                                type="text"
                                value={name}
                                onChange={(event: BaseSyntheticEvent) => {
                                    setName(event.target.value);
                                }}
                            />
                            <div className="ml-20" />
                            <span
                                className="material-symbols-outlined mx-2 text-3xl"
                                onClick={() => setIsEditingName(false)}
                            >
                                check_box
                            </span>
                        </>
                    ) : (
                        // 수정중
                        <>
                            <div className="text-2xl border-2 pl-2">{name}</div>
                            <div className="ml-20" />
                            <span
                                className="material-symbols-outlined mx-2 text-3xl"
                                onClick={() => setIsEditingName(true)}
                            >
                                edit
                            </span>
                        </>
                    )}
                    <span className="material-symbols-outlined mx-2 text-3xl">
                        group_add
                    </span>
                </div>
                <div
                    onClick={makeFinalVideo}
                    className="btn-cover color-bg-red3 text-white"
                >
                    저장하기
                </div>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex">
                    {/* 카테고리 */}
                    <div className="w-1/5 ">
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center categori-selected">
                            <span className="material-symbols-outlined text-3xl">
                                settings
                            </span>
                            <p className="font-bold">설정</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    {loaded ? (
                        // 로딩 후
                        <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                            <div className="w-full flex justify-start text-xl ">
                                <p>사용할 구간 선택</p>
                            </div>
                            <div className="my-2 flex justify-center items-center">
                                <input
                                    className="w-16 p-2 border border-black rounded text-center"
                                    type="number"
                                    value={startTime}
                                    min={0}
                                    onChange={changeStartTime}
                                ></input>
                                <p className="mx-4">~</p>
                                <input
                                    className="w-16 p-2 border border-black rounded text-center"
                                    type="number"
                                    value={endTime}
                                    max={endMaxtime}
                                    onChange={changeEndTime}
                                ></input>
                            </div>

                            <div className="w-full flex justify-start text-xl ">
                                <p>서브 텍스트 입력</p>
                            </div>
                            <input
                                className="w-56 my-2 p-2 border border-black rounded"
                                placeholder="텍스트를 입력해주세요."
                                onChange={changeText}
                                value={inputText}
                            ></input>
                        </div>
                    ) : (
                        //로딩 중
                        <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                            <p>로딩중</p>
                        </div>
                    )}
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 editor-height bg-gray-50 flex justify-between">
                    <div className="w-full px-4 py-4 flex flex-col justify-center items-center">
                        {/* 입력 텍스트 */}
                        <p>{inputText}</p>
                        {/* 비디오 */}
                        <video
                            className="bg-white border my-2"
                            style={{
                                width: '640px',
                                height: '480px',
                                display: 'block',
                            }}
                            ref={videoRef}
                            onTimeUpdate={(event: BaseSyntheticEvent) => {
                                timeChange(event);
                                handleProgress(event);
                            }}
                            controls
                        />
                        <div className="w-full flex flex-col justify-center items-center my-4">
                            {/* 재생버튼 */}
                            <div>
                                <span
                                    className="material-symbols-outlined me-1 text-4xl cursor-pointer"
                                    onClick={playVideo}
                                >
                                    play_circle
                                </span>
                                <span
                                    className="material-symbols-outlined me-1 text-4xl cursor-pointer"
                                    onClick={pauseVideo}
                                >
                                    pause_circle
                                </span>
                                <span
                                    className="material-symbols-outlined me-1 text-4xl cursor-pointer"
                                    onClick={stopVideo}
                                >
                                    stop_circle
                                </span>
                            </div>
                            {/* 프로그레스 바 */}
                            <progress
                                id="progress"
                                max={100}
                                value={progress}
                                className="w-full rounded -webkit-progress-bar:bg-black -webkit-progress-value:bg-red"
                            >
                                Progress
                            </progress>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
