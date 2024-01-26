import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { connect, sendMessage } from '../util/chat';

type chattingType = {
    userName: string;
    time: string;
    content: string;
};
export default function ChattingBox() {
    const [chatToggle, setChatToggle] = useState<boolean>(false);
    const [chattingList, setChattingList] = useState<chattingType[]>([
        { userName: '은수', time: '시간', content: '내용' },
        { userName: '연수', time: '시간', content: '내용2' },
    ]);
    const [comment, setComment] = useState<string>();
    //test용 유저 선택
    const [userSelect, setUserSelect] = useState<string>('은수');
    //test용 방 번호
    const roomNum = 1;

    useEffect(() => {
        // connect(1, setChattingList);
    }, []);

    //send 유저 이름 바꾸기
    const changeUser = (user: string) => {
        setUserSelect(user);
        console.log('유저를 바꾼다. ' + user);
    };

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
        sendMessage(userSelect, '1234', comment, setChattingList);
    };

    // 채팅 리스트 표시
    const chatting = () => {
        return (
            <>
                {chattingList.map((item, index) => {
                    console.log(item);
                    if (item.userName === userSelect) {
                        console.log('은수작동');
                        return (
                            <p className=" text-left h-14 bg-yellow-100">
                                {item.content}
                            </p>
                        );
                    } else {
                        console.log('연수작동');
                        return (
                            <p className=" text-right h-14 bg-sky-100">
                                {item.content}
                            </p>
                        );
                    }
                })}
            </>
        );
    };

    const showChattingRoom = () => {
        if (chatToggle) {
            return (
                <div className="w-52 h-96 fixed flex flex-col justify-between items-center  bottom-8 right-8 p-2 bg-white border border-sky-400 z-30 ">
                    <div className="w-full rounded bg-slate-100">
                        <div className="flex">
                            <p
                                className="w-fit mx-2 border border-black px-2 py-1 rounded cursor-pointer"
                                onClick={() => {
                                    changeUser('은수');
                                }}
                            >
                                은수
                            </p>
                            <p
                                className="w-fit mx-2 border border-black px-2 py-1 rounded  cursor-pointer"
                                onClick={() => {
                                    changeUser('연수');
                                }}
                            >
                                연수
                            </p>
                            <div className="w-fit border border-black px-2 py-1 rounded">
                                닫기
                            </div>
                        </div>
                        <div>{chatting()}</div>
                    </div>
                    <div className="flex bg-white cursor-pointer">
                        <input
                            className=" w-32 border mr-2"
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

    return (
        <>
            <div
                className="w-16 h-16 fixed flex justify-center items-center bottom-8 right-8 bg-sky-400 rounded-full cursor-pointer z-20"
                onClick={changeChatToggle}
            >
                <span className="material-symbols-outlined text-4xl">chat</span>
            </div>
            {showChattingRoom()}
        </>
    );
}
