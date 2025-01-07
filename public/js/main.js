"use strict";

// --------------------- VARIABLES ---------------------
let username = "Fr4xx";
let isConnected = false;

// ------------------ QUERY SELECTORS ------------------
const chatField = document.querySelector(".chatsection__chatfield");
const textField = document.querySelector(".chatsection__textfield--textbox");
const sendBtn = document.querySelector(".chatsection__textfield--sendbtn");

// --------------------- SOCKET.io ---------------------
var socket = io();

// ----------------------- CODE ------------------------

const sendMessage = () => {
	let messageText = textField.value;
	let message = { user: username, text: messageText };
	console.log(message);
	socket.emit("chat message", message);
	textField.value = "";
	console.log("Sent Message: " + message);
	username = "Ch0r0k0";
};

socket.on("chat message", function (msg) {
	console.log("Received Message: " + msg.user);
	let html;
	if (msg.user == username) {
		html = `
			<div class="sent-message">
				<div class="sent-message__box">
					<div class="sent-message__box--author">${msg.user}</div>
					<div class="sent-message__box--text">${msg.text}</div>
				</div>
			</div>
			`;
	} else if (msg.user != username) {
		html = `
			<div class="received-message">
				<div class="received-message__box">
					<div class="received-message__box--author">${msg.user}</div>
					<div class="received-message__box--text">${msg.text}</div>
				</div>
			</div>
			`;
	}
	chatField.insertAdjacentHTML("afterbegin", html);
});

sendBtn.addEventListener("click", sendMessage);
