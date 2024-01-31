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
        showMessage('은수', '1', JSON.parse(payload.body).content);
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

    // 본인이 보낸 입장 메시지는 본인에게 렌더링하지 않음
    // if (message.type === 'JOIN' && message.sender === username) {
    //     console.log('작동해야지!!!정은수 핑크색 쓰지마라');

    //     return;
    // }
    if (message.type === 'JOIN') {
        showMessage(message.sender, message.time, message.content);
    }
    // 메시지를 출력할 요소를 생성
    let messageElement = document.createElement('li');

    // 참여하고 퇴장하였을 때, css 적용
    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        showMessage(message.sender, message.time, message.content);
        console.log(message.content + message.sender + message.time);
    }
}

export function sendMessage(userName, content) {
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
