// import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
import { enterChatting } from '../api/chat';

// 배포용
// const websocketUrl = 'wss://recletter.me/ws';
const websocketUrl = import.meta.env.VITE_REACT_WEBSOCKET_URL;
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
                console.log('success');
                setConnect = true;

                stuId = studioParam;
                username = nickname;
                uuid = uid;
                chatList = setChattingList;
                setCurrentPeople = currentPeopleFunc;

                subscribe(stuId, uuid, username, chatList, setCurrentPeople);
                console.log(setConnect);
            },
        });
        client.activate();
    }
}

/** 인원 구하는 API */
const findPeopleAPI = async () => {
    await enterChatting(stuId)
        .then((res) => {
            // console.log('현재인원 : ' + res.data);
            setCurrentPeople(res.data);
        })
        .catch((error) => {});
};

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
        console.log('현재 연결 상태: 재연결합니다');
        connect(stuId, uuid, username, chatList, setCurrentPeople);
    } else if (client.connected) {
        console.log('이미 연결된 상태입니다,');
        findPeopleAPI();
        if (setConnect && !currentRoom.includes(stuId)) {
            client.subscribe(topic + `/${stuId}`, (payload) => {
                onMeesageReceived(payload);
                console.log('채팅을 보냈습니다');
            });
            if (!firstEnter) {
                firstChatJoin(stuId);
                firstEnter = true;
            }
            currentRoom.push(stuId);
        } else if (!setConnect) {
            unSubscribe();
            client.deactivate();
        }
    }
}
export function reSubscribe(reSubStudioParam) {
    // console.log('재구독 작동합니다');
    stuId = reSubStudioParam;
    findPeopleAPI();
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
    console.log('unScribe하겠습니다' + studioId);
    client.subscribe(topic + `/${studioId}`, (payload) => {}).unsubscribe();
    if (currentRoom.includes(studioId)) {
        currentRoom.filter((prevTopics) => prevTopics !== studioId);
    }
}

export function disconnect(studioId) {
    // if (client === null) {
    //     console.log('ㅅㄹㅈㄷ');

    //     return;
    // }
    console.log('tfwe');
    console.log(stuId);
    console.log(studioId);
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
    console.log('합합 메시지리븟 입니다!');
    console.log('uuid 입니다' + uuid);
    console.log('닉네임입니다' + username);
    console.log(message);

    if (message.type === 'JOIN' && message.uuid === uuid) {
        findPeopleAPI();
        console.log('유저가 같아서 표시되지 않습니다.');
    }
    //이름이 같지 않을 때
    else if (message.type === 'JOIN' || message.type === 'LEAVE') {
        findPeopleAPI();
        showMessage(
            message.sender,
            message.uuid,
            message.time,
            message.content,
            'alarm'
        );
    } else {
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
    console.log(sid);
    stuId = sid;
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
