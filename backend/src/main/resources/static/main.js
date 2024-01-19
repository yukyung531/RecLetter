'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// 여러 채팅창 기능을 테스트하기 위해 임시로 만들어 놓은 버튼을 클릭했을 때 실행
// 채팅방 버튼 클릭 이벤트 리스너
document.getElementById('joinChatRoom1Button').addEventListener('click', function () {
    // 아직 studioId를 받아올 수 없어서 임의로 roomId를 정해둠
    joinChatRoom(1); // 채팅방 1에 참가
    connect();
});

document.getElementById('joinChatRoom2Button').addEventListener('click', function () {
    joinChatRoom(2); // 채팅방 2에 참가
    connect();
});

document.getElementById('joinChatRoom3Button').addEventListener('click', function () {
    joinChatRoom(3); // 채팅방 3에 참가
    connect();
});

// 채팅방에 참가하는 함수
function joinChatRoom(roomId) {
    // roomId를 전역 변수로 설정합니다.
    window.roomId = roomId;
}

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if (username) {

        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        var socket = new SockJS('/ws');

        stompClient = Stomp.over(socket);
        // WebSocket 연결

        stompClient.connect({}, onConnected, onError);
    }
    // event 객체가 존재하면 preventDefault 실행
    if (event) {
        event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    }
}

// 메시지 보내는 함수
function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/chatrooms/' + window.roomId, onMessageReceived);

    // 서버에 사용자 이름과 roomId 전송하여 채팅방에 JOIN 알림
    stompClient.send("/app/chat/" + window.roomId + "/addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN', roomId: window.roomId})
    )

    connectingElement.classList.add('hidden');
}

function sendMessage(event) {
    event.preventDefault(); // 폼 제출 이벤트의 기본 동작 방지

    var messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT',
            roomId: window.roomId // 메시지에 roomId 포함
        };

        // 메시지를 특정 채팅방으로 보내도록 경로 수정
        stompClient.send("/app/chat/" + window.roomId + "/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = ''; // 입력 필드 초기화
    }
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    // 본인이 보낸 입장 메시지는 렌더링하지 않습니다.
    if (message.type === 'JOIN' && message.sender === username) {
        return;
    }

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

messageForm.addEventListener('submit', sendMessage, true)