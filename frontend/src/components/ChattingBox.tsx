import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { connect, disconnect, firstChatJoin, sendMessage } from '../util/chat';
import { useDispatch, useSelector } from 'react-redux';

type chattingType = {
    userName: string;
    time: string;
    content: string;
};
export default function ChattingBox() {
    const [chatToggle, setChatToggle] = useState<boolean>(false);
    const [chattingList, setChattingList] = useState<chattingType[]>([]);
    const [comment, setComment] = useState<string>();
    //test용 유저 선택
    const [userSelect, setUserSelect] = useState<string>('은수');

    /** 리덕스 함수 */
    const studioCurrentId = useSelector(
        (state: any) => state.loginFlag.studioId
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (studioCurrentId !== '') {
            console.log(studioCurrentId);
            connect(studioCurrentId, setChattingList);
            setChatToggle(false);
            setChattingList([]);
        }

        return () => {
            disconnect();
        };
    }, [studioCurrentId]);

    // 채팅 토글 바꾸기
    const changeChatToggle = () => {
        setChatToggle(!chatToggle);
    };

    // 채팅 입력시 입력창 변화
    const changeComment = (e: BaseSyntheticEvent) => {
        setComment(e.currentTarget.value);
    };

    // 채팅 보내기
    const sendChatting = () => {
        sendMessage(userSelect, comment);
    };

    // 채팅 리스트 표시
    const chatting = () => {
        return (
            <>
                {chattingList.map((item, index) => {
                    if (item.userName === userSelect) {
                        console.log('은수작동');
                        return (
                            <div className="flex flex-col items-end py-2">
                                <p
                                    className="w-3/4 text-right h-14 bg-sky-500 text-white rounded-lg px-2 py-1"
                                    key={'chat' + index}
                                >
                                    {item.content}
                                </p>
                            </div>
                        );
                    } else {
                        console.log('연수작동');
                        return (
                            <div className="flex flex-col items-start py-2">
                                <p
                                    className="w-3/4 text-left h-14 bg-gray-400 text-black rounded-lg px-2 py-1"
                                    key={'chat' + index}
                                >
                                    {item.content}
                                </p>
                            </div>
                        );
                    }
                })}
            </>
        );
    };

    const showChattingRoom = () => {
        if (chatToggle) {
            return (
                <div className="w-60 h-96 fixed flex flex-col justify-between items-center  bottom-8 right-8 p-2 bg-white border z-30 ">
                    <div className="w-full rounded">
                        <div className="flex">
                            <div
                                className="w-fit border border-black px-2 py-1 rounded cursor-pointer"
                                onClick={() => {
                                    changeChatToggle();
                                }}
                            >
                                닫기
                            </div>
                        </div>
                        <div>{chatting()}</div>
                    </div>
                    <div className="flex bg-white cursor-pointer">
                        <input
                            className=" w-40 border mr-2"
                            type="text"
                            value={comment}
                            onChange={(e) => {
                                changeComment(e);
                            }}
                            placeholder="채팅을 입력하세요"
                        />
                        <p
                            className="w-fit border border-black px-2 py-1 rounded"
                            onClick={sendChatting}
                        >
                            보내기
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="w-0 h-0 fixed flex justify-center items-center bottom-8 right-8 bg-sky-400 hidden">
                    닫힘
                </div>
            );
        }
    };

    /** 리덕스에따라 활성화되는 채팅방 */
    const activeChatting = () => {
        if (studioCurrentId) {
            return (
                <div
                    className="w-16 h-16 fixed flex justify-center items-center bottom-8 right-8 bg-sky-400 rounded-full cursor-pointer z-20"
                    onClick={changeChatToggle}
                >
                    <span className="material-symbols-outlined text-4xl">
                        chat
                    </span>
                </div>
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
