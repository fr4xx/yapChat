"use strict";

// --------------------- VARIABLES ---------------------
let username;
let isConnected = false;

// ------------------ QUERY SELECTORS ------------------
const loginSection = document.querySelector(".loginsection");
const loginUsername = document.querySelector(".loginmodule__form--input");
const loginBtn = document.querySelector(".loginmodule__form--button");

const appSection = document.querySelector("main");
const userListSection = document.querySelector(".usersection__userlist");
const chatField = document.querySelector(".chatsection__chatfield");
const textField = document.querySelector(".chatsection__textfield--textbox");
const sendBtn = document.querySelector(".chatsection__textfield--sendbtn");

// --------------------- SOCKET.io ---------------------
var socket = io();

// ----------------------- CODE ------------------------

const login = () => {
	if (loginUsername.value.length >= 3) {
		username = loginUsername.value;
		loginSection.style.display = "none";
		appSection.style.display = "flex";
		socket.emit("login", username);
	}
};

const sendMessage = () => {
	let messageText = textField.value;
	let message = { user: username, text: messageText };
	console.log(message);
	socket.emit("chat message", message);
	textField.value = "";
	console.log("Sent Message: " + message);
};

socket.on("chat message", (msg) => {
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

socket.on("stillActive", () => {
	console.log("stillActive");
	socket.emit("isActive", username);
});

socket.on("updateUsersList", (usersList) => {
	console.log(usersList);
	userListSection.innerHTML = "";
	usersList.forEach((user) => {
		let html = `
		<li class="usersection__userlist--user" userlistValue="${user}">${user}</li>
		`;
		userListSection.insertAdjacentHTML("beforeend", html);
	});
});

sendBtn.addEventListener("click", sendMessage);
loginBtn.addEventListener("click", login);
