// import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';

const websocketUrl = 'ws://localhost:8080/ws';
const topic = '/topic';
const app = '/app/chat';
let client = null;
let studioId = 0;
let chatList;
let firstEnter = false;
let username;

/** create-react-app환경 */
export function connect(id, setChattingList) {
    const token = localStorage.getItem('access-token');
    console.log(token);

    client = new StompJs.Client({
        brokerURL: websocketUrl,
        connectHeaders: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
        },
        onConnect: () => {
            studioId = id;
            console.log('success');
            chatList = setChattingList;
            subscribe();
            if (!firstEnter) {
                firstChatJoin(studioId);
                firstEnter = true;
            }
        },
    });
    client.activate();
}

export function firstChatJoin(studioId) {
    console.log('조인 실행대쪄');
    client.publish({
        destination: app + `/${studioId}/join`,
        body: JSON.stringify({
            type: 'JOIN',
            studioId: studioId,
        }),
    });
}

export function subscribe() {
    client.subscribe(topic + `/${studioId}`, (payload) => {
        console.log(payload);
        onMeesageReceived(payload);
        console.log('구독이 되었습니다');
        // showMessage('은수', '1', JSON.parse(payload.body).content);
    });
}

export function disconnect() {
    if (client) {
        client.deactivate();
        console.log('채팅이 종료되었습니다.');
        firstEnter = false;
    }
}

function showMessage(userName, time, content) {
    chatList((props) => [
        ...props,
        { userName: userName, time: time, content: content },
    ]);
}

function onMeesageReceived(payload) {
    let message = JSON.parse(payload.body); // 메시지 객체를 파싱
    console.log(message);

    if (
        ((message.type === 'JOIN' ||
        message.type === 'LEAVE') && message.sender === username)
    ) {
        console.log('유저가 같아서 표시되지 않습니다.');
    }
    //이름이 같지 않을 때
    else {
        showMessage(message.sender, message.time, message.content);
    }
}

export function sendMessage(userName, content) {
    username=userName;
    client.publish({
        destination: app + `/${studioId}/sendMessage`,
        body: JSON.stringify({
            sender: userName,
            content: content,
            type: 'CHAT',
            studioId: studioId,
        }),
    });
}
