import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// const websocketUrl = 'http://localhost:8080/ws';
const websocketUrl = 'ws://localhost:8080/ws';
const topic = '/topic/1ade6e43-e16e-4e2d-b331-b40f199a9ce3';
const app = '/app/chat/1ade6e43-e16e-4e2d-b331-b40f199a9ce3/sendMessage';
var client = null;

/** create-react-app환경 */
export function connect(id, setChattingList) {
    const sock = new WebSocket(websocketUrl);
    client = Stomp.over(function () {
        return new WebSocket('ws://localhost:8080/ws');
    });
    // client = new Client({ brokerURL: 'ws://localhost:5173/ws' });
    client.connect({}, () => {
        client.subscribe(topic, (payload) => {
            console.log('구독완료');
            console.log(JSON.parse(payload.body).content);
            showMessage(
                '은수',
                '1',
                JSON.parse(payload.body).content,
                setChattingList
            );
        });
    });
    client.onConnect = () => {
        console.log('열렸습니다');
    };
}

export function disconnect() {
    if (client !== null) {
        client.disconnect();
        console.log('Disconnected');
    }
}

function showMessage(userName, time, content, setChattingList) {
    setChattingList((props) => [
        ...props,
        { userName: userName, time: time, content: content },
    ]);
}

export function sendMessage(userName, time, content, setChattingList) {
    client.send(
        app,
        {},
        JSON.stringify({
            sender: userName,
            content: content,
            type: 'CHAT',
            studioId: '1ade6e43-e16e-4e2d-b331-b40f199a9ce3',
        })
    );
}
