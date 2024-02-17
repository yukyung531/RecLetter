// import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
import { enterChatting } from '../api/chat';

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
let setCurrentPeople;
let currentRoom = [];
let unSubscribeFlag = false;

/** create-react-app환경 */
export function connect(
    studioParam,
    uid,
    nickname,
    setChattingList,
    currentPeopleFunc
) {
    const token = localStorage.getItem('access-token');
    if (client === null) {
        client = new StompJs.Client({
            brokerURL: websocketUrl,
            connectHeaders: {
                Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
            },
            onConnect: () => {
                console.log('----connect success----');
                setConnect = true;

                stuId = studioParam;
                username = nickname;
                uuid = uid;
                chatList = setChattingList;
                setCurrentPeople = currentPeopleFunc;

                // console.log(stuId, uuid, username, chatList, setCurrentPeople)
                subscribe(stuId, uuid, username, chatList, setCurrentPeople);
                // console.log(setConnect);
            },
        });
        client.activate();
    }
}

export function firstChatJoin(stuId) {
    client.publish({
        destination: app + `/${stuId}/join`,
        body: JSON.stringify({
            type: 'JOIN',
            studioId: stuId,
        }),
    });
}

export function subscribe(
    studioParam,
    uid,
    nickname,
    setChattingList,
    currentPeopleFunc
) {
    stuId = studioParam;
    username = nickname;
    uuid = uid;
    chatList = setChattingList;
    setCurrentPeople = currentPeopleFunc;
    if (client === null) {
        console.log('----reConnect 시도----');
        connect(stuId, uuid, username, chatList, setCurrentPeople);
    } else if (client.connected && !unSubscribeFlag) {
        console.log('----이미 connect 상태입니다----');
        connect(studioParam, uid, nickname, setChattingList, currentPeopleFunc);
        if (setConnect && !currentRoom.includes(stuId)) {
            client.subscribe(topic + `/${stuId}`, (payload) => {
                onMeesageReceived(payload);
            });
            if (!firstEnter) {
                firstChatJoin(stuId);
                firstEnter = true;
            }
            currentRoom.push(stuId);
        } else if (!setConnect) {
            unSubscribe(stuId);
            client.deactivate();
        } else {
            unSubscribe(stuId);
            client.subscribe(topic + `/${stuId}`, (payload) => {
                onMeesageReceived(payload);
            });
        }
    }
}
export function reSubscribe(reSubStudioParam) {
    // console.log('재구독 작동합니다');
    stuId = reSubStudioParam;
    setConnect = true;
    subscribe(stuId, uuid, username, chatList, setCurrentPeople);
    client.publish({
        destination: app + `/${stuId}/join`,
        body: JSON.stringify({
            type: 'JOIN',
            studioId: reSubStudioParam,
        }),
    });
}
export function unSubscribe(studioId) {
    console.log('----unScribe' + studioId + '----');
    client.subscribe(topic + `/${studioId}`, (payload) => {}).unsubscribe();
    if (currentRoom.includes(studioId)) {
        currentRoom.filter((prevTopics) => prevTopics !== studioId);
    }
    unSubscribeFlag = true;
}

export function disconnect(studioId) {
    console.log('----' + stuId + '연결 dissconnect 시도----');
    if (stuId === studioId) {
        client.publish({
            destination: app + `/${studioId}/leave`,
            body: JSON.stringify({
                type: 'LEAVE',
                studioId: studioId,
            }),
        });
    }

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
    if (message.type === 'CHAT') {
        console.log(message);
        showMessage(
            message.sender,
            message.uuid,
            message.time,
            message.content,
            'chat'
        );
    }
    if (message.type === 'LEAVE') {
        setConnect = false;
        unSubscribe(message.studioId);
    }
}

export function sendMessage(userName, content, sid) {
    console.log('----메시지를 보냅니다----');
    stuId = sid;

    /** 시간 저장 */
    // const now = new Date();
    // const hours = now.getHours().toString().padStart(2, '0');
    // const minutes = now.getMinutes().toString().padStart(2, '0');
    // showMessage(userName, uuid, `${hours}:${minutes}`, content);

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
