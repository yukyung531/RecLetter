import { useEffect, useState, useRef } from 'react';
import {
    FrameType,
    Letter,
    StudioDetail,
    fontTemplate,
    UserInfo,
} from '../types/type';
import { getTemplate, getFont } from '../api/template';
import { httpStatusCode } from '../util/http-status';
import { OpenVidu, Session } from 'openvidu-browser';
// import { connectSession, createSession, endSession } from '../api/openvidu';
import { getUser } from '../api/user';
// import { connect } from '../util/chat';
import axios from 'axios';

export default function LetterMakePage() {
    //mode - 0:영상리스트, 1:프레임, 2:텍스트, 3:오디오
    const [mode, setMode] = useState<number>(0);

    ///////////////////////////////////////////////초기 설정////////////////////////////////////////////////////////

    // //영상리스트 with 스튜디오 정보
    // const [studioDetailInfo, setStudioDetailInfo] = useState<StudioDetail>({
    //     studioId: '',
    //     studioTitle: '',
    //     studioOwner: '',
    //     isCompleted: false,
    //     clipInfoList: [],
    //     studioFrameId: -1,
    //     studioFontId: -1,
    //     studioBGMId: -1,
    // });

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
    // const [bgmList, setBGMList] = useState([]); //추후 구현

    // 선택한 프레임
    const [selectImgUrl, setSelectImgUrl] = useState<string>(
        '/src/assets/frames/frame1.png'
    );

    //유저 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userId: '',
        userNickname: '',
    });

    /** 선택한 프레임 적용 */
    const selectImg = (source: string) => {
        setSelectImgUrl(source);
    };

    //메인비디오 Ref
    const mainVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        /**initSetting()
         * 초기 설정
         */
        const initSetting = async () => {
            getFont()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        console.log(res.data);
                        setFontList([...res.data.fontTemplate]);
                    } else {
                        console.log('Network Error!');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            getTemplate()
                .then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        console.log(res.data);
                        setFrameList([...res.data.frameTemplate]);
                    } else {
                        console.log('Network Error');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        initSetting();

        //+유저 정보 불러오기
        const getUserInfo = async () => {
            const resuser = await getUser();
            const tempObj = { ...resuser.data };
            setUserInfo({
                userId: tempObj.userId,
                userNickname: tempObj.userNickname,
            });
        };
        getUserInfo();
    }, []);

    /////////////////////////////////////mode에 따른 사이드바 추가////////////////////////////////////////////////////
    let sideBar = <></>;

    switch (mode) {
        case 0:
            sideBar = (
                <div className="w-full flex justify-start text-xl ">
                    <p>선택하지 않은 영상</p>
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
                <div className="w-full flex justify-start text-xl ">
                    <p>BGM</p>
                </div>
            );
            break;
    }

    /////////////////////////////////////////////openvidu이용 화상 공유/////////////////////////////////////////////
    //studioId 가져오기
    const splitUrl = document.location.href.split('/');
    const studioId = splitUrl[splitUrl.length - 1];

    // const videoContainerRef = useRef<HTMLDivElement>(null);
    const subVideoRef = useRef<HTMLVideoElement>(null);

    const [users, setUsers] = useState<any[]>([]);

    let OV: OpenVidu;
    let session: Session;

    const APPLICATION_SERVER_URL = 'https://demos.openvidu.io/';

    /**startScreenShare
     * 화면공유를 눌렀을 때 실행되는 함수다.
     */
    const startScreenShare = async () => {
        //openvidu object 가져오고 session 추가
        OV = new OpenVidu();
        session = OV.initSession();

        //session action 정의 only screen share만 존재
        session.on('streamCreated', (event) => {
            console.log(event);
            if (event.stream.typeOfVideo == 'SCREEN') {
                const subscriber = session.subscribe(
                    event.stream,
                    'video-container'
                );

                subscriber.on('videoElementCreated', (event) => {
                    appendUserData(event.element, subscriber.stream.connection);
                });
            }
        });

        //stream파괴시
        session.on('streamDestroyed', (event) => {
            //delete html element
            removeUserData(event.stream.connection);
        });

        //오류시
        session.on('exception', (exception) => {
            console.warn(exception);
        });

        //이제 세션에 연결해 봅시다.
        getToken(studioId).then((token) => {
            session
                .connect(token, { clientData: userInfo.userId })
                .then(() => {
                    console.log('Session opened');
                })
                .catch((error) => {
                    console.warn(
                        'There was an error connecting to the session for screen share:',
                        error.code,
                        error.message
                    );
                });
        });
    };

    /** publishScreenShare()
     *  웹캠 공유를 활성화합니다.
     */
    const publishScreenShare = () => {
        const publisherScreen = OV.initPublisher('container-screens', {
            audioSource: undefined,
            videoSource: 'screen',
            publishAudio: false,
            publishVideo: true,
            resolution: '1920x1080',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
        });

        // session.publish(publisherScreen);

        // publisherScreen.addVideoElement(mainVideoRef.current);

        // 유저가 공유 중지하면 중지
        publisherScreen.once('accessAllowed', () => {
            publisherScreen.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .addEventListener('ended', () => {
                    console.log('User Pressed stop sharing');
                    session.unpublish(publisherScreen);
                });
            session.publish(publisherScreen);
            if (mainVideoRef.current) {
                publisherScreen.addVideoElement(mainVideoRef.current);
            }
            // console.log('Admin: session- ', session);
        });

        // console.log(publisherScreen);
    };

    /** appendUserData
     *  userData가 추가되면 실행되는 함수입니다.
     * @param videoElement
     * @param connection
     */
    const appendUserData = (connection: any) => {
        let userData;
        let nodeId;
        //유저데이터, 노드 아이디 받아오기
        if (typeof connection === 'string') {
            userData = connection;
            nodeId = connection;
        } else {
            userData = JSON.parse(connection.data).clientData;
            nodeId = connection.connectionId;
        }

        //유저 목록 추가
        setUsers((prev) => {
            const userObj = {
                nodeId,
                userData,
            };
            return [...prev, userObj];
        });
    };

    /** removeUserData
     *  유저를 지우는 함수입니다.
     * @param connection
     */
    const removeUserData = (connection: any) => {
        setUsers((prev) => {
            return prev.filter((user) => {
                user.nodeId !== connection.connectionId;
            });
        });
    };

    /** getToken()
     * 세션을 생성하고 접속을 위한 토큰을 가져옵니다.
     */
    const getToken = async (studioId: string) => {
        //studioId가 세션 id가 된다.
        const sessionId = await createSession(studioId);
        return await createToken(sessionId);
    };

    /**createSession(sessionId), 세션을 생성한다 */
    const createSession = async (sessionId: string) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL + 'api/sessions',
            { customSessionId: sessionId },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data; // The sessionId
    };

    /** createToken(sessionId)
     * 토큰을 생성한다.
     * @param sessionId
     * @returns
     */
    const createToken = async (sessionId: string) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL +
                'api/sessions/' +
                sessionId +
                '/connections',
            {},
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data; // The token
    };

    /**세션을 종료합니다. */
    const endScreenShare = async () => {
        //세션 종료
        // endSession(studioId);

        //세션 연결 종료, 유저 정보 초기화
        session.disconnect();
        setUsers([]);
    };

    /**윈도우 창을 닫으면 자동 종료 */
    window.onbeforeunload = () => {
        if (session) endScreenShare();
    };

    ///////////////////////////////////////////////렌더링///////////////////////////////////////////////////////////
    return (
        <section className="relative section-top pt-16">
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
                    onClick={startScreenShare}
                >
                    세션 연결 하기
                </button>
                <button
                    className="btn-cover color-bg-blue3 text-white"
                    onClick={publishScreenShare}
                >
                    화상 공유하기
                </button>
                <button
                    className="btn-cover color-bg-blue3 text-white"
                    onClick={endScreenShare}
                >
                    화상공유종료하기
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
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        defaultValue={50}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="main-video" className="col-md-6">
                <p>{userInfo.userId}</p>
                <video
                    autoPlay
                    playsInline={true}
                    ref={mainVideoRef}
                    width={'680px'}
                    height={'480px'}
                ></video>
            </div>
            <div id="video-container">
                {users.map((user) => {
                    console.log(users);
                    return (
                        <div
                            className="data-node"
                            id={`data-${user.nodeId}`}
                            key={user.nodeId}
                        >
                            <p>{user.userData}</p>
                            <video
                                autoPlay
                                playsInline={true}
                                ref={subVideoRef}
                                width={'680px'}
                                height={'480px'}
                            ></video>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
