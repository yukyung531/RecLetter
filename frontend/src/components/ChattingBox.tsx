import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import {
    connect,
    disconnect,
    firstChatJoin,
    reSubscribe,
    sendMessage,
    unSubscribe,
} from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';
import { studioState } from '../util/counter-slice';

type chattingType = {
    userName: string;
    time: string;
    content: string;
    type: string;
    uuid: string;
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
    //스크롤 탐지용
    const messageEndRef = useRef<HTMLDivElement>(null);

    /** 리덕스 함수 */
    const studioCurrentId = useSelector(
        (state: any) => state.loginFlag.studioId
    );
    const dispatch = useDispatch();
    window.addEventListener('beforeunload', () => {
        dispatch(studioState(''));
    });

    useEffect(() => {
        if (studioCurrentId !== '') {
            chatInitialAPI();
        } else {
            changeChatToggle(false);
        }
        return () => {
            setChattingList([]);
        };
    }, [studioCurrentId]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chattingList]);

    /** 유저 API 설정 */
    const chatInitialAPI = async () => {
        if (!chatFlag) {
            await getUser().then((res) => {
                if (res.status === httpStatusCode.OK) {
                    console.log('새로고침하여 유저 정보를 새로이 받아옵니다.');
                    setUserNickname(res.data.userNickname);
                    setUserId(res.data.userId);
                    setCurrentPeople([]);
                    connect(
                        studioCurrentId,
                        res.data.userId,
                        res.data.userNickname,
                        setChattingList,
                        setCurrentPeople
                    );
                    setChatToggle(false);
                    setChatFlag(true);
                    setChattingList([]);
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
                    setChattingList([]);
                }
            });
            reSubscribe(studioCurrentId);
        }
    };
    // 채팅 토글 바꾸기
    const changeChatToggle = (toggle: boolean) => {
        setChatToggle(toggle);
    };

    // 채팅 입력시 입력창 변화
    const changeComment = (e: BaseSyntheticEvent) => {
        setComment(e.currentTarget.value);
    };

    // 채팅 보내기
    const sendChatting = () => {
        if (comment !== '') {
            sendMessage(userNickname, comment);
            setComment('');
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
                <div className="absolute top-8 w-72 max-h-52 overflow-y-scroll rounded-md p-2 bg-slate-200">
                    <div className="relative w-full flex justify-between">
                        <p>참여자 목록</p>
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
                            <div className="m-1" key={'people ' + index}>
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

    // 채팅 리스트 표시
    const chatting = () => {
        return (
            <>
                {chattingList.map((chat, index) => {
                    console.log(chat);
                    if (chat.type === 'alarm') {
                        return (
                            <div
                                className="w-full flex flex-col items-center  my-3"
                                key={'chat' + index}
                            >
                                <div className="w-3/4 text-center bg-gray-300 rounded-lg px-2 py-1">
                                    <p>{chat.content}</p>
                                </div>
                            </div>
                        );
                    } else if (chat.type === 'chat' && chat.uuid === userId) {
                        return (
                            <div
                                className="flex items-end py-2 justify-end"
                                key={'chat' + index}
                            >
                                <p className=" text-sm me-1 color-text-darkgray">
                                    {chat.time}
                                </p>
                                <div
                                    className="w-fit text-right h-fit color-text-darkgray color-bg-yellow2 px-2 py-1 chat-text-setting"
                                    style={{ borderRadius: '5px 0 5px 5px' }}
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
                                <p>{chat.userName}</p>
                                <div className="flex items-end">
                                    <div
                                        className="w-fit text-start h-fit color-text-darkgray bg-white rounded-lg px-2 py-1 chat-text-setting"
                                        style={{
                                            borderRadius: '0 5px 5px 5px',
                                        }}
                                    >
                                        <p>{chat.content}</p>
                                    </div>
                                    <p className=" text-sm ms-1 color-text-darkgray">
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
    };

    const showChattingRoom = () => {
        if (chatToggle) {
            return (
                <div className=" w-88 h-5/6 rounded-lg fixed flex bottom-16 flex-col justify-between items-center right-8 px-5 py-3 color-bg-sublight z-20 ">
                    <div className="relative w-full">
                        <div className="flex justify-between">
                            <p className="text-center text-2xl font-bold">
                                studio1
                            </p>
                            <p
                                className="relative text-center left-3 bottom-3 text-xl cursor-pointer"
                                onClick={() => {
                                    changeChatToggle(!chatToggle);
                                }}
                            >
                                x
                            </p>
                        </div>
                        <div className="relative flex justify-between">
                            <div
                                className="relative -left-2 flex items-center cursor-pointer rounded-full px-2 hover:font-bold hover:bg-gray-300"
                                onClick={() => {
                                    setPeopleFlag(true);
                                }}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    group
                                </span>
                                <p className="mx-1">{currentPeople.length}</p>
                            </div>
                            <div className="flex justify-center items-center">
                                <div className="w-4 h-4 rounded-full color-bg-darkgray mx-1"></div>
                                <div className="w-4 h-4 rounded-full color-bg-lightgray1 mx-1"></div>
                                <div className="w-4 h-4 rounded-full color-bg-main mx-1"></div>
                            </div>
                        </div>
                        {openPeople()}
                        <div className="w-full horizenbar bg-black my-1"></div>
                    </div>

                    <div className="w-full rounded overflow-y-scroll h-full">
                        <div>{chatting()}</div>
                    </div>
                    <div className="w-full flex bg-white cursor-pointer border border-black rounded-lg px-2 py-1">
                        <div className="flex w-full">
                            <img
                                src="/src/assets/icons/Chat_Circle.png"
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
                </div>
            );
        } else {
            return <div className=" hidden"></div>;
        }
    };

    /** 리덕스에따라 활성화되는 채팅방 */
    const activeChatting = () => {
        if (studioCurrentId) {
            return (
                <img
                    src="/src/assets/icons/Chat_Circle.png"
                    className="w-16 h-16 fixed flex justify-center items-center bottom-8 right-8 rounded-full cursor-pointer z-30"
                    alt=""
                    onClick={() => {
                        changeChatToggle(!chatToggle);
                    }}
                />
            );
        }
    };

    return (
        <>
            {activeChatting()}
            {showChattingRoom()}
        </>
    );
}
