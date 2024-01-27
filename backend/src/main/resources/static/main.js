'use strict';

var usernamePage = document.querySelector('#username-page'); // 사용자 이름 입력 페이지
var chatPage = document.querySelector('#chat-page'); // 채팅 페이지
var usernameForm = document.querySelector('#usernameForm'); // 사용자 이름 입력 폼
var messageForm = document.querySelector('#messageForm'); // 메시지 입력 폼
var messageInput = document.querySelector('#message'); // 메시지 입력 필드
var messageArea = document.querySelector('#messageArea'); // 메세지 출력 영역
var connectingElement = document.querySelector('.connecting'); // 연결 상태 출력 요소

// 채팅 관련 변수들
var stompClient = null; // STOMP 클라이언트
var username = null; // 사용자 이름(나중에 로그인 기능 연결되면 api로 받아와야 함.)

// 사용자 아바타 색상 목록
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// 각 채팅방에 입장하는 버튼에 이벤트 리스너를 추가
// 임시로 studioId를 1, 2, 3으로 지정하여 채팅방에 입장하도록 함
document.getElementById('joinChatRoom1Button').addEventListener('click', function () {
    joinChatRoom(1); // 채팅방 1에 참가
    connect(); // 채팅 서버에 연결
});

document.getElementById('joinChatRoom2Button').addEventListener('click', function () {
    joinChatRoom(2); // 채팅방 2에 참가
    connect();// 채팅 서버에 연결
});

document.getElementById('joinChatRoom3Button').addEventListener('click', function () {
    joinChatRoom(3); // 채팅방 3에 참가
    connect();// 채팅 서버에 연결
});

// 채팅방에 참가하는 함수
function joinChatRoom(studioId) {
    // studioId를 전역 변수로 설정.
    window.studioId = studioId;
}

// 채팅 서버에 연결하는 함수
function connect(event) {
    // 사용자 이름 가져오기
    username = document.querySelector('#name').value.trim();

    if (username) { // 사용자 이름이 입력되었다면
        usernamePage.classList.add('hidden'); // 사용자 이름 입력 페이지를 숨기고
        chatPage.classList.remove('hidden'); // 채팅 페이지를 보여줌

        var socket = new SockJS('/ws'); // WebSocket 연결 생성.

        stompClient = Stomp.over(socket); // STOMP 프로토콜을 사용하는 클라이언트를 생성.

        // 채팅 서버에 연결.(연결 옵션, 서버연결 성공 시 콜백함수, 에러 발생 시 콜백함수)
        stompClient.connect({}, onConnected, onError);
    }
    // event 객체가 존재하면 preventDefault 실행
    if (event) {
        event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    }
}

// 채팅방에 참여하여 참여메시지 보내는 함수
function onConnected() {
    // 특정 채팅방 구독 (subscribe 는 수신자 역할)
    stompClient.subscribe('/topic/' + window.studioId, onMessageReceived);

    // 서버에 사용자 이름과 studioId 전송하여 채팅방에 JOIN 알림 (send 는 송신자 역할)
    stompClient.send("/app/chat/" + window.studioId + "/join", // 메시지를 보낼 목적지
        {}, // 헤더 옵션
        JSON.stringify({sender: username, type: 'JOIN', studioId: window.studioId}) // 보낼 메시지 변환
    )
    // 연결중인 화면 숨기기
    connectingElement.classList.add('hidden');
}

// 메시지를 보내는 함수
function sendMessage(event) {
    event.preventDefault(); // 폼 제출 이벤트의 기본 동작 방지

    var messageContent = messageInput.value.trim(); // 메시지 내용을 가져옴.

    if (messageContent && stompClient) { // 메시지 내용이 있고 서버에 연결되어 있다면
        var chatMessage = { // 메시지 객체를 생성.
            sender: username, // 보낸 사람
            content: messageContent, // 메시지 내용
            type: 'CHAT', // 메시지 타입
            studioId: window.studioId // 채팅방 ID
        };

        // 메시지를 특정 채팅방으로 보내도록 경로 수정
        stompClient.send("/app/chat/" + window.studioId + "/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = ''; // 메시지 입력 필드를 초기화.
    }
}

// 연결 에러 처리 함수
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

// 메시지를 받는 함수
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body); // 메시지 객체를 파싱

    // 본인이 보낸 입장 메시지는 본인에게 렌더링하지 않음
    if (message.type === 'JOIN' && message.sender === username) {
        return;
    }

    // 메시지를 출력할 요소를 생성
    var messageElement = document.createElement('li');

    // 참여하고 퇴장하였을 때, css 적용
    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
    }
    else {// 그 외의 경우, css 적용
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i'); // 아바타 요소 생성.
        // var avatarText = document.createTextNode(message.sender[0]); // 아바타 텍스트 생성.
        // avatarElement.appendChild(avatarText); // 아바타 요소에 텍스트 추가.
        // avatarElement.style['background-color'] = getAvatarColor(message.sender); // 아바타 요소의 배경색을 설정.

        messageElement.appendChild(avatarElement); // 메시지 요소에 아바타 요소 추가.

        var usernameElement = document.createElement('span'); // 사용자 이름 요소 생성.
        var usernameText = document.createTextNode(message.sender); // 사용자 이름 텍스트 생성.
        usernameElement.appendChild(usernameText); // 사용자 이름 요소에 텍스트 추가.
        messageElement.appendChild(usernameElement); // 메시지 요소에 사용자 이름 요소 추가.
    }

    var textElement = document.createElement('p'); // 텍스트 요소 생성.
    var messageText = document.createTextNode(message.content); // 메시지 텍스트 생성.
    textElement.appendChild(messageText); // 텍스트 요소에 메시지 텍스트 추가.
    messageElement.appendChild(textElement); // 메시지 요소에 텍스트 요소 추가.

    // 메시지를 보낸 시간 표시.
    var timeElement = document.createElement('span'); // 시간 요소 생성.
    var timeText = document.createTextNode(message.time); // 시간 텍스트 생성.
    timeElement.appendChild(timeText); // 시간 요소에 시간 텍스트 추가.
    messageElement.appendChild(timeElement); // 메시지 요소에 시간 요소 추가.

    messageArea.appendChild(messageElement); // 메시지 영역에 메시지 요소 추가.
    messageArea.scrollTop = messageArea.scrollHeight; // 스크롤을 맨 아래로 이동.
}

// 사용자의 아바타 색상을 가져오는 함수
// function getAvatarColor(messageSender) {
//     var hash = 0;
//     for (var i = 0; i < messageSender.length; i++) {
//         hash = 31 * hash + messageSender.charCodeAt(i);
//     }
//     var index = Math.abs(hash % colors.length);
//     return colors[index];
// }

// 채팅방을 나가는 함수
function leaveRoom() {
    if(stompClient) { // 서버에 연결되어 있다면
        var chatMessage = { // 메시지 객체를 생성.
            sender: username, // 보낸 사람
            type: 'LEAVE' // 메시지 타입
        };
        stompClient.send("/app/chat/"+ studioId + "/leave", {}, JSON.stringify(chatMessage));
        stompClient.disconnect(); // 서버와 연결 끊기
    }

    usernamePage.classList.remove('hidden');
    chatPage.classList.add('hidden');
}

document.querySelector('.leave').addEventListener('click', leaveRoom )
messageForm.addEventListener('submit', sendMessage, true)