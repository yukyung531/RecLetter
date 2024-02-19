// import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
import { enterChatting } from '../api/chat';
import { getlastPath } from './get-func';
import { getUser } from '../api/user';
import { httpStatusCode } from '../util/http-status';

// 배포용
// const websocketUrl = 'wss://recletter.me/ws';
const websocketUrl = import.meta.env.VITE_REACT_WEBSOCKET_URL;
// console.log("websocketUrl: " + websocketUrl);
const topic = '/topic';
const app = '/app/chat';
let client = null;
let stuId = '';
let chatList;
let firstEnter = false;
let username;
let uuid;
let setConnect = true;
let currentRoom = [];
let unSubscribeFlag = false;

/** create-react-app환경 */
export function connect(setChattingList) {
    const token = localStorage.getItem('access-token');
    if (client === null) {
        client = new StompJs.Client({
            brokerURL: websocketUrl,
            connectHeaders: {
                Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
            },
            onConnect: async () => {
                console.log('----connect success----');
                setConnect = true;

                if (setChattingList !== null && setChattingList !== undefined) {
                    console.log('chatlist를 갱신합니다.');
                    chatList = setChattingList;
                }
                await getUser().then((res) => {
                    if (res.status === httpStatusCode.OK) {
                        console.log('유저 정보를 새로이 받아옵니다.');
                        stuId = getlastPath();
                        username = res.data.userNickname;
                        uuid = res.data.userId;
                        // console.log(stuId, uuid, username)
                        subscribe(chatList);
                        // console.log(setConnect);
                    }
                });
            },
        });
        client.activate();
    }
}

export function firstChatJoin(studioId) {
    stuId = studioId;
    client.publish({
        destination: app + `/${stuId}/join`,
        body: JSON.stringify({
            type: 'JOIN',
            studioId: stuId,
        }),
    });
}

export async function subscribe(setChattingList) {
    await getUser().then((res) => {
        if (res.status === httpStatusCode.OK) {
            console.log('subscribe 시작');

            if (setChattingList !== null && setChattingList !== undefined) {
                console.log('chatlist를 갱신합니다.');
                chatList = setChattingList;
            }
            stuId = getlastPath();
            username = res.data.userNickname;
            uuid = res.data.userId;

            if (client === null) {
                console.log('----reConnect 시도----');
                connect(chatList);
            } else if (client.connected && !unSubscribeFlag) {
                console.log('----이미 connect 상태입니다----');
                connect(chatList);
                if (setConnect && !currentRoom.includes(stuId)) {
                    pushRoom();
                    if (!firstEnter) {
                        console.log('처음접속 Join 작동합니다..');
                        firstChatJoin(stuId);
                        firstEnter = true;
                    }
                } else if (!setConnect) {
                    console.log(
                        'disconnect 로 인하여 client를 deactive합니다.'
                    );
                    unSubscribe(stuId);
                    setConnect = true;
                    client.deactivate();
                } else {
                    console.log('재구독');
                    unSubscribe(stuId);
                    pushRoom();
                    unSubscribeFlag = false;
                }
            } else {
                if (!currentRoom.includes(stuId)) {
                    console.log('----구독합니다 ' + stuId + '----');
                    client.publish({
                        destination: app + `/${stuId}/join`,
                        body: JSON.stringify({
                            type: 'JOIN',
                            studioId: stuId,
                        }),
                    });
                    pushRoom();
                } else {
                    stuId = getlastPath();
                    if (currentRoom.includes(stuId)) {
                        currentRoom.filter(
                            (prevTopics) => prevTopics !== stuId
                        );
                    }
                    pushRoom();
                }
            }
        }
    });
}
export function reSubscribe(setChattingList) {
    console.log('재구독 작동합니다');
    if (setChattingList !== null && setChattingList !== undefined) {
        chatList = setChattingList;
    }
    stuId = getlastPath();
    setConnect = true;
    if (!currentRoom.includes(stuId)) {
        subscribe(chatList);
    }
}
export function unSubscribe(studioId) {
    console.log('----unScribe ' + studioId + '----');
    client.subscribe(topic + `/${studioId}`, (payload) => {}).unsubscribe();
    if (currentRoom.includes(studioId)) {
        currentRoom.filter((prevTopics) => prevTopics !== studioId);
    }
    unSubscribeFlag = true;
}

export function disconnect(studioId) {
    stuId = studioId;
    setConnect = false;
    unSubscribe(stuId);
    // console.log('----' + stuId + '연결 dissconnect 시도----');
    // if (stuId === studioId) {
    //     client.publish({
    //         destination: app + `/${studioId}/leave`,
    //         body: JSON.stringify({
    //             type: 'LEAVE',
    //             studioId: studioId,
    //         }),
    //     });
    // }

    // console.log('채팅이 종료되었습니다.');
}

function showMessage(userName, uuid, time, content, type) {
    const newMessage = {
        userName: userName,
        uuid: uuid,
        time: time,
        content: content,
        type: type,
    };
    chatList((prev) => {
        // 해당 studioId를 가진 chattingType을 찾습니다.
        const searchChatList = prev.map((chatItem) =>
            chatItem.studioId === stuId
                ? {
                      ...chatItem,
                      chatting: [...chatItem.chatting, newMessage],
                  }
                : chatItem
        );
        return searchChatList;
    });
}

function onMeesageReceived(payload) {
    let message = JSON.parse(payload.body); // 메시지 객체를 파싱
    // console.log('합합 메시지리븟 입니다!');
    // console.log('uuid 입니다' + uuid);
    // console.log('닉네임입니다' + username);
    // console.log(message);

    //이름이 같지 않을 때
    if (message.type === 'CHAT' && message.studioId === stuId) {
        console.log(message);
        showMessage(
            message.sender,
            message.uuid,
            message.time,
            message.content,
            'chat'
        );
    }
    if (message.type === 'JOIN') {
        console.log('JOIN 합니다');
    }
    if (message.type === 'LEAVE') {
        // setConnect = false;
        // unSubscribe(message.studioId);
    }
}

export function sendMessage(userName, content, sid, setChattingList) {
    console.log('----메시지를 보냅니다----');
    stuId = sid;
    if (setChattingList !== null && setChattingList !== undefined) {
        chatList = setChattingList;
    }
    /** 시간 저장 */
    // const now = new Date();
    // const hours = now.getHours().toString().padStart(2, '0');
    // const minutes = now.getMinutes().toString().padStart(2, '0');
    // showMessage(userName, uuid, `${hours}:${minutes}`, content);

    // console.log('----studioId : ' + stuId);
    // console.log('----userName : ' + userName);
    // console.log('----content : ' + content);
    // console.log('----uuid : ' + uuid);

    client.publish({
        destination: app + `/${stuId}/sendMessage`,
        body: JSON.stringify({
            sender: userName,
            content: content,
            UUID: uuid,
            type: 'CHAT',
            studioId: stuId,
        }),
    });
}
function pushRoom() {
    client.subscribe(topic + `/${stuId}`, (payload) => {
        onMeesageReceived(payload);
    });
    currentRoom.push(stuId);
}
