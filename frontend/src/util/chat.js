// import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
import { enterChatting } from '../api/chat';

const websocketUrl = 'ws://localhost:8080/ws';
const topic = '/topic';
const app = '/app/chat';
let client = null;
let studioId = 0;
let chatList;
let firstEnter = false;
let username;
let uuid;
let setConnect = true;
let people;

/** create-react-app환경 */
export function connect(id, uuid, nickname, setChattingList, setCurrentPeople) {
    const token = localStorage.getItem('access-token');
    client = new StompJs.Client({
        brokerURL: websocketUrl,
        connectHeaders: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
        },
        onConnect: () => {
            studioId = id;
            username = nickname;
            uuid = uuid;
            console.log('success');
            setConnect = true;
            console.log(setConnect);
            chatList = setChattingList;
            const findPeopleAPI = async () => {
                await enterChatting(studioId)
                    .then((res) => {
                        console.log('현재인원 : ' + res);
                        setCurrentPeople(res.data);
                    })
                    .catch((error) => {});
            };
            findPeopleAPI();
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
    client.publish({
        destination: app + `/${studioId}/join`,
        body: JSON.stringify({
            type: 'JOIN',
            studioId: studioId,
        }),
    });
}

export function subscribe() {
    if (setConnect) {
        client.subscribe(topic + `/${studioId}`, (payload) => {
            onMeesageReceived(payload);
            console.log('채팅을 보냈습니다');
        });
    } else if (!setConnect) {
        client.deactivate();
    }
}
export function unSubscribe() {
    client.subscribe(topic + `/${studioId}`, (payload) => {}).unsubscribe();
}

export function disconnect() {
    if (client === null) {
        return;
    }
    client.publish({
        destination: app + `/${studioId}/leave`,
        body: JSON.stringify({
            type: 'LEAVE',
            studioId: studioId,
        }),
    });
    console.log('채팅이 종료되었습니다.');
    firstEnter = false;
}

function showMessage(userName, uuid, time, content, type) {
    chatList((props) => [
        ...props,
        {
            userName: userName,
            uuid: uuid,
            time: time,
            content: content,
            type: type,
        },
    ]);
}

function onMeesageReceived(payload) {
    let message = JSON.parse(payload.body); // 메시지 객체를 파싱
    console.log('합합 메시지리븟 입니다!');
    console.log(message);

    if (message.type === 'JOIN' && message.uuid === uuid) {
        console.log('유저가 같아서 표시되지 않습니다.');
    }
    //이름이 같지 않을 때
    else if (message.type === 'JOIN' || message.type === 'LEAVE') {
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
        console.log('작동 ' + setConnect);
        setConnect = false;
    }
}

export function sendMessage(userName, content) {
    client.publish({
        destination: app + `/${studioId}/sendMessage`,
        body: JSON.stringify({
            sender: userName,
            content: content,
            UUID: uuid,
            type: 'CHAT',
            studioId: studioId,
        }),
    });
}
