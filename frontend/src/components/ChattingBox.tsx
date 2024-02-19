import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { connect, reSubscribe, sendMessage, subscribe } from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { studioDeleteState, themeState } from '../util/counter-slice';
import { getlastPath } from '../util/get-func';

type chattingMessageType = {
    userName: string;
    time: string;
    content: string;
    type: string;
    uuid: string;
};
type chattingType = {
    studioId: string;
    chatting: chattingMessageType[];
};
type themeInterface = {
    bgColor: string;
    comment: string;
    chatColor: string;
    openLogo: string;
    closeLogo: string;
};
export default function ChattingBox() {
    const [chatToggle, setChatToggle] = useState<boolean>(false);
    const [chattingList, setChattingList] = useState<chattingType[]>([]);
    const [comment, setComment] = useState<string>('');
    const [userNickname, setUserNickname] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [currentPeople, setCurrentPeople] = useState<string[]>([]);
    const [chatFlag, setChatFlag] = useState<boolean>(false);
    const [peopleFlag, setPeopleFlag] = useState<boolean>(false);
    const [studioCurrentId, setStudioCurrentId] = useState<string>('');
    const [viewChatFlag, setViewChatFlag] = useState<boolean>(true);
    const [currentPath, setCurrentPath] = useState<string>('');

    //스크롤 탐지용
    const messageEndRef = useRef<HTMLDivElement>(null);

    // 리덕스 테마 값
    const chatTheme = useSelector((state: any) => state.loginFlag.theme);
    const studioNameRedux = useSelector(
        (state: any) => state.loginFlag.studioName
    );
    const [studioName, setStudioName] = useState<string>('');
    const [themeObj, setThemeObj] = useState<themeInterface[]>([
        {
            bgColor: '#ffa9a9',
            comment: '#fff593',
            chatColor: '#626262',
            openLogo: 'chatlogo12',
            closeLogo: 'chatlogo1',
        },
        {
            bgColor: '#fff593',
            comment: '#ffa9a9',
            chatColor: '#626262',
            openLogo: 'chatlogo22',
            closeLogo: 'chatlogo2',
        },
        {
            bgColor: '#626262',
            comment: '#fff593',
            chatColor: '#ffffff',
            openLogo: 'chatlogo32',
            closeLogo: 'chatlogo3',
        },
    ]);
    const chatStudioList: string[] = useSelector(
        (state: any) => state.loginFlag.studioId
    );
    const dispatch = useDispatch();
    window.addEventListener('beforeunload', () => {
        const studioPath = getlastPath();
        dispatch(studioDeleteState(studioPath));
    });

    useEffect(() => {
        //최초 연결이면
        const studioPath = getlastPath();
        if (chatStudioList.length === 0) {
            changeChatToggle(false);
        } else if (studioPath !== '') {
            if (
                chatStudioList.length === 1 &&
                chatStudioList[0] === studioPath
            ) {
                // console.log('----첫 리스트----');

                chatInitialAPI();
            } else if (
                chatStudioList.length > 1 &&
                (chatStudioList[chatStudioList.length - 1] === studioPath ||
                    chatStudioList[chatStudioList.length - 1] === 'reload')
            ) {
                console.log('----리스트 1개 이상----');

                subscribeFunc();
            } else if (chatStudioList.length === 0) {
                // console.log('작동3');

                changeChatToggle(false);
            }
        }

        return () => {
            resetChattingList();
        };
    }, [chatStudioList]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // console.log('채팅리스트 숫자' + chattingList.length);
        if (!chatToggle) {
            setViewChatFlag(false);
        }
        setCurrentPath(getlastPath());
        console.log(currentPath);
    }, [chattingList]);

    useEffect(() => {
        setStudioName(studioNameRedux);
    }, [studioNameRedux]);

    /** 유저 API 설정 */
    const chatInitialAPI = async () => {
        if (!chatFlag) {
            await getUser().then((res) => {
                if (res.status === httpStatusCode.OK) {
                    console.log('유저 정보를 새로이 받아옵니다.');
                    setUserNickname(res.data.userNickname);
                    setUserId(res.data.userId);
                    setCurrentPeople([]);
                    const studioPath = getlastPath();
                    connect(setChattingList);
                    setChatToggle(false);
                    setChatFlag(true);
                    resetChattingList();
                }
            });
        }
        // 처음 진입한게 아니라 connect가 이미 된 상태라 구독으로 바꾸기
        else {
            await getUser().then((res) => {
                if (res.status === httpStatusCode.OK) {
                    console.log('재진입 유저 정보를 새로이 받아옵니다.');
                    setUserNickname(res.data.userNickname);
                    setUserId(res.data.userId);
                    setCurrentPeople([]);
                    setChatToggle(false);
                    setChatFlag(true);
                    resetChattingList();
                    const studioPath = getlastPath();
                    reSubscribe(setChattingList);
                }
            });
        }
    };
    const subscribeFunc = async () => {
        await getUser().then((res) => {
            if (res.status === httpStatusCode.OK) {
                // console.log('유저 정보를 새로이 받아옵니다.');
                setUserNickname(res.data.userNickname);
                setUserId(res.data.userId);
                setCurrentPeople([]);
                const studioPath = getlastPath();
                subscribe(setChattingList);
                setChatToggle(false);
                setChatFlag(true);
                resetChattingList();
            }
        });
    };
    // 채팅 토글 바꾸기
    const changeChatToggle = (toggle: boolean) => {
        setChatToggle(toggle);
        if (chatToggle) {
            setViewChatFlag(true);
        }
    };

    // 채팅 입력시 입력창 변화
    const changeComment = (e: BaseSyntheticEvent) => {
        setComment(e.currentTarget.value);
    };

    // 채팅 보내기
    const sendChatting = () => {
        if (comment !== '') {
            const studioPath = getlastPath();
            sendMessage(userNickname, comment, studioPath, setChattingList);
            setComment('');
        }
    };
    /** 해당 id의 채팅 삭제 */
    const resetChattingList = () => {
        const studioPath = getlastPath();
        if (studioPath !== '') {
            setChattingList((prev) => {
                // Filtering out the items with the same studioId
                const filterList = prev.filter(
                    (item) => item.studioId !== studioPath
                );

                // Adding a new item with the updated studioId
                return [...filterList, { studioId: studioPath, chatting: [] }];
            });
        }
    };
    /** 엔터키 누르면 보내는 이벤트 */
    const sendEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendChatting();
        }
    };

    const sendIconElement = () => {
        if (comment === '') {
            return (
                <span
                    className="w-fit h-8 material-symbols-outlined border px-2 flex justify-center items-center rounded color-text-gray color-border-gray"
                    onClick={sendChatting}
                >
                    send
                </span>
            );
        } else {
            return (
                <span
                    className="w-fit h-8 material-symbols-outlined border px-2 flex justify-center items-center rounded color-black border-black color-bg-yellow2"
                    onClick={sendChatting}
                >
                    send
                </span>
            );
        }
    };

    /** 채팅 리스트 열기 */
    const openPeople = () => {
        if (peopleFlag) {
            return (
                <div className="absolute top-12 w-48 max-h-52 overflow-y-scroll rounded-md p-2 bg-white ">
                    <div className="relative w-full flex justify-between">
                        <p></p>
                        <p
                            className="cursor-pointer hover:font-bold"
                            onClick={() => {
                                setPeopleFlag(false);
                            }}
                        >
                            x
                        </p>
                    </div>
                    {currentPeople.map((item, index) => {
                        return (
                            <div
                                className="m-1 border-b-2 color-border-lightgray1"
                                key={'people ' + index}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <></>;
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [chatToggle]);

    // 채팅 리스트 표시
    const chatting = () => {
        let index = -1;
        chattingList.map((item, itemIndex) => {
            // console.log('엥');
            // console.log(chattingList);
            if (item.studioId == currentPath) {
                index = itemIndex;
            }
        });
        if (index !== -1) {
            let viewChat = chattingList[index].chatting;
            return (
                <>
                    {viewChat.map((chat, index) => {
                        if (chat.type === 'alarm') {
                            return (
                                <div
                                    className="w-full flex flex-col items-center my-3"
                                    key={'chat' + index}
                                >
                                    <div className="w-3/4 text-center bg-gray-300 rounded-lg px-2 py-1">
                                        <p>{chat.content}</p>
                                    </div>
                                </div>
                            );
                        } else if (
                            // chat.type === 'chat' &&
                            chat.uuid === userId
                        ) {
                            return (
                                <div
                                    className="flex items-end py-2 justify-end"
                                    key={'chat' + index}
                                >
                                    <p
                                        className=" text-sm me-1"
                                        style={{
                                            color: `${themeObj[chatTheme].chatColor}`,
                                        }}
                                    >
                                        {chat.time}
                                    </p>
                                    <div
                                        className="w-fit text-right h-fit color-text-darkgray px-2 py-1 chat-text-setting"
                                        style={{
                                            borderRadius: '5px 0 5px 5px',
                                            backgroundColor: `${themeObj[chatTheme].comment}`,
                                        }}
                                    >
                                        <p>{chat.content}</p>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    className="flex flex-col items-start py-1"
                                    key={'chat' + index}
                                >
                                    <p
                                        style={{
                                            color: `${themeObj[chatTheme].chatColor}`,
                                        }}
                                    >
                                        {chat.userName}
                                    </p>
                                    <div className="flex items-end">
                                        <div
                                            className="w-fit text-start h-fit color-text-darkgray bg-white rounded-lg px-2 py-1 chat-text-setting"
                                            style={{
                                                borderRadius: '0 5px 5px 5px',
                                            }}
                                        >
                                            <p>{chat.content}</p>
                                        </div>
                                        <p
                                            className=" text-sm ms-1 "
                                            style={{
                                                color: `${themeObj[chatTheme].chatColor}`,
                                            }}
                                        >
                                            {chat.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                    <div ref={messageEndRef}></div>
                </>
            );
        }
    };

    // 로컬 스토리지에서 테마 불러오기. 없으면 기본값 0 사용
    const initialTheme = Number(localStorage.getItem('selectedTheme')) || 0;

    const [selectedTheme, setSelectedTheme] = useState(initialTheme);

    const handleThemeChange = (theme: number) => {
        setSelectedTheme(theme);
        // 테마 변경 시 로컬 스토리지에 테마 저장
        localStorage.setItem('selectedTheme', theme.toString());
        dispatch(themeState(theme));
    };

    const showChattingRoom = () => {
        const openLogoSrc =
            '/src/assets/icons/' + themeObj[chatTheme].openLogo + '.png';
        if (chatToggle) {
            return (
                <div
                    className=" w-80 h-4/5 rounded-ss-lg rounded-se-lg rounded-es-lg fixed flex bottom-16 flex-col justify-between items-center right-8 pe-2 ps-3 py-3 z-20 border-2 border-white me-2 mb-1"
                    style={{
                        backgroundColor: `${themeObj[chatTheme].bgColor}`,
                    }}
                >
                    <div className="relative w-full">
                        <div className="flex justify-between">
                            <p
                                className="text-center text-2xl font-bold"
                                style={{
                                    color: `${themeObj[chatTheme].chatColor}`,
                                }}
                            >
                                {studioName}
                            </p>
                            <p
                                className="relative text-center right-2 bottom-2 text-xl cursor-pointer"
                                onClick={() => {
                                    changeChatToggle(!chatToggle);
                                }}
                            >
                                x
                            </p>
                        </div>
                        <div className="relative flex justify-between">
                            <div></div>
                            <div className="flex justify-center items-center">
                                <div
                                    className={`w-4 h-4 rounded-full color-bg-darkgray mx-1 border-2 border-white cursor-pointer ${
                                        selectedTheme === 2
                                            ? 'transform scale-125'
                                            : ''
                                    }`}
                                    style={{
                                        borderWidth: `${
                                            selectedTheme === 2 ? '3px' : '2px'
                                        }`,
                                    }}
                                    onClick={() => {
                                        dispatch(themeState(2));
                                        handleThemeChange(2);
                                    }}
                                ></div>
                                <div
                                    className={`w-4 h-4 rounded-full color-bg-yellow2 mx-1 border-2 border-white cursor-pointer ${
                                        selectedTheme === 1
                                            ? 'transform scale-125'
                                            : ''
                                    }`}
                                    style={{
                                        borderWidth: `${
                                            selectedTheme === 1 ? '3px' : '2px'
                                        }`,
                                    }}
                                    onClick={() => {
                                        dispatch(themeState(1));
                                        handleThemeChange(1);
                                    }}
                                ></div>
                                <div
                                    className={`w-4 h-4 rounded-full color-bg-main mx-1 border-2 border-white cursor-pointer ${
                                        selectedTheme === 0
                                            ? 'transform scale-125'
                                            : ''
                                    }`}
                                    style={{
                                        borderWidth: `${
                                            selectedTheme === 0 ? '3px' : '2px'
                                        }`,
                                    }}
                                    onClick={() => {
                                        dispatch(themeState(0));
                                        handleThemeChange(0);
                                    }}
                                ></div>
                            </div>
                        </div>
                        {openPeople()}
                        <div className="w-full horizenbar bg-black my-3"></div>
                    </div>

                    <div className="w-full rounded overflow-y-scroll h-full px-2">
                        <div>{chatting()}</div>
                    </div>
                    <div className="w-full flex bg-white cursor-pointer border border-black rounded-lg px-2 py-1">
                        <div className="flex w-full">
                            <img
                                src="/src/assets/icons/Chat_Circle1.png"
                                className="w-8 h-8 flex justify-center items-center rounded color-text-gray "
                                alt=""
                            />
                            <input
                                className=" w-full py-1 px-2 focus:outline-none"
                                type="text"
                                value={comment}
                                onChange={(e) => {
                                    changeComment(e);
                                }}
                                placeholder="채팅을 입력해주세요"
                                onKeyDown={sendEnter}
                            />
                            {sendIconElement()}
                        </div>
                    </div>
                    <div
                        className="absolute w-14 h-10 -bottom-8 right-0 cursor-pointer"
                        onClick={() => {
                            changeChatToggle(!chatToggle);
                        }}
                    >
                        <img className="" src={openLogoSrc} alt="" />
                    </div>
                </div>
            );
        } else {
            return <div className=" hidden"></div>;
        }
    };

    /** 리덕스에따라 활성화되는 채팅방 */
    const activeChatting = () => {
        if (chatStudioList.length !== 0) {
            const closeLogoSrc =
                '/src/assets/icons/' + themeObj[chatTheme].closeLogo + '.png';

            if (chatTheme === 0 && !chatToggle)
                return (
                    <div className="relative">
                        <img
                            src="/src/assets/icons/chatlogo1.png"
                            className="w-16 h-16 fixed flex justify-center items-center bottom-8 right-8 rounded-full cursor-pointer z-30"
                            alt=""
                            onClick={() => {
                                changeChatToggle(!chatToggle);
                            }}
                        />
                        {!viewChatFlag ? (
                            <div className="fixed w-4 h-4 bottom-[70px] right-9 border-2 border-white color-bg-subbold rounded-full z-40"></div>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            else if (!chatToggle) {
                return (
                    <div className="relative">
                        <img
                            src={closeLogoSrc}
                            className="w-16 h-16 fixed flex justify-center items-center bottom-8 right-8  cursor-pointer z-30"
                            alt=""
                            onClick={() => {
                                changeChatToggle(!chatToggle);
                            }}
                        />
                        {!viewChatFlag ? (
                            <div className="fixed w-4 h-4 bottom-[70px] right-9 border-2 border-white color-bg-subbold rounded-full z-40"></div>
                        ) : (
                            <></>
                        )}
                    </div>
                );
            }
        }
    };

    return (
        <>
            {activeChatting()}
            {showChattingRoom()}
        </>
    );
}
