// import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';
import { enterChatting } from '../api/chat';

const websocketUrl = 'ws://recletter.me/api/ws';
const topic = '/topic';
const app = '/app/chat';
let client = null;
let stuId = 0;
let chatList;
let firstEnter = false;
let username;
let uuid;
let setConnect = true;
let setCurrentPeople;

/** create-react-app환경 */
export function connect(
    studioParam,
    uid,
    nickname,
    setChattingList,
    currentPeopleFunc
) {
    const token = localStorage.getItem('access-token');
    client = new StompJs.Client({
        brokerURL: websocketUrl,
        connectHeaders: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
        },
        onConnect: () => {
            stuId = studioParam;
            username = nickname;
            uuid = uid;
            console.log('success');
            setConnect = true;
            console.log(setConnect);
            chatList = setChattingList;
            setCurrentPeople = currentPeopleFunc;

            findPeopleAPI();
            subscribe();
            if (!firstEnter) {
                firstChatJoin(stuId);
                firstEnter = true;
            }
        },
    });
    client.activate();
}

/** 인원 구하는 API */
const findPeopleAPI = async () => {
    await enterChatting(stuId)
        .then((res) => {
            console.log('현재인원 : ' + res.data);
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

export function subscribe() {
    if (setConnect) {
        client.subscribe(topic + `/${stuId}`, (payload) => {
            onMeesageReceived(payload);
            console.log('채팅을 보냈습니다');
        });
    } else if (!setConnect) {
        unSubscribe();
        client.deactivate();
    }
}
export function reSubscribe(reSubStudioParam) {
    // console.log('재구독 작동합니다');
    stuId = reSubStudioParam;
    findPeopleAPI();
    setConnect = true;
    client.publish({
        destination: app + `/${stuId}/join`,
        body: JSON.stringify({
            type: 'JOIN',
            studioId: stuId,
        }),
    });
}
export function unSubscribe() {
    client.subscribe(topic + `/${stuId}`, (payload) => {}).unsubscribe();
}

export function disconnect() {
    if (client === null) {
        return;
    }
    client.publish({
        destination: app + `/${stuId}/leave`,
        body: JSON.stringify({
            type: 'LEAVE',
            studioId: stuId,
        }),
    });
    // console.log('채팅이 종료되었습니다.');
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
        firstEnter = false;
        setConnect = false;
        unSubscribe();
    }
}

export function sendMessage(userName, content) {
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
