// const websocketUrl = "/spring-boot-tutorial"
// const topic = "/topic/greetings";
// const app = "/app/hello";
// var client = null;
//
// function connect() {
//   const sock = new SockJS(websocketUrl);
//   client = Stomp.over(sock);
//   client.connect({}, ()  => {
//     setConnected(true);
//     client.subscribe(topic, payload => {
//       showMessage(JSON.parse(payload.body).content);
//     });
//   });
//   console.log("Connected");
// };
//
// function disconnect() {
//   if (client !== null ) {
//     client.disconnect();
//     setConnected(false);
//     console.log("Disconnected");
//   };
// }
//
// function showMessage(message) {
//   greetings.innerHTML += "<tr><td>" + message + "</td></tr>";
// }
//
// function sendMessage(){
//   let message = nameInput.value;
//   client.send(app, {}, JSON.stringify({'name': message}));
// };
//
// function setConnected(connected) {
//   buttonConnect.disabled = connected;
//   buttonDisConnect.disabled = !connected;
//   buttonSend.disabled = !connected;
//   if (connected) {
//     conversationDisplay.style.display = "block";
//   }
//   else {
//     conversationDisplay.style.display = "none";
//   }
//   greetings.innerHTML = "";
// }
//
// document.addEventListener("DOMContentLoaded", function() {
//   buttonConnect = document.getElementById("connect");
//   buttonDisConnect = document.getElementById("disconnect");
//   buttonSend = document.getElementById("send");
//   conversationDisplay = document.getElementById("conversation");
//   greetings = document.getElementById("greetings");
//   formInput = document.getElementById("form");
//   nameInput = document.getElementById("name");
//   buttonConnect.addEventListener("click", (e) => {
//     connect();
//     e.preventDefault();});
//   buttonDisConnect.addEventListener("click", (e) => {
//     disconnect();
//     e.preventDefault();});
//   buttonSend.addEventListener("click", (e) => {
//     sendMessage();
//     e.preventDefault();});
//   formInput.addEventListener("submit", (e) => e.preventDefault());
//   setConnected(false);
// });
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

function connect(event) {
  username = document.querySelector('#name').value.trim();

  if(username) {
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}


function onConnected() {
  // Subscribe to the Public Topic
  stompClient.subscribe('/topic/public', onMessageReceived);

  // Tell your username to the server
  stompClient.send("/app/chat.addUser",
      {},
      JSON.stringify({sender: username, type: 'JOIN'})
  )

  connectingElement.classList.add('hidden');
}


function onError(error) {
  connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
  connectingElement.style.color = 'red';
}


function sendMessage(event) {
  var messageContent = messageInput.value.trim();
  if(messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      type: 'CHAT'
    };
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    messageInput.value = '';
  }
  event.preventDefault();
}


function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);

  var messageElement = document.createElement('li');

  if(message.type === 'JOIN') {
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

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)