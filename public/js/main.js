"use strict";

// --------------------- VARIABLES ---------------------
let username;

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
	if (!textField.value == "") {
		let messageText = textField.value.replace(/\n/g, "<br>");
		let message = { user: username, text: messageText };
		socket.emit("chat message", message);
		textField.value = "";
	}
};

const mention = (e) => {
	textField.insertAdjacentText("beforeend", "@" + e.srcElement.innerHTML + " ");
};

socket.on("chat message", (msg) => {
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
	if (username) {
		socket.emit("isActive", username);
	}
});

socket.on("updateUsersList", (usersList) => {
	userListSection.innerHTML = "";
	usersList.forEach((user) => {
		let html = `
		<li class="usersection__userlist--user" id="userListField${user}">${user}</li>
		`;
		userListSection.insertAdjacentHTML("beforeend", html);
		const userListField = document.getElementById("userListField" + user);
		userListField.addEventListener("click", mention);
	});
});

sendBtn.addEventListener("click", sendMessage);
loginBtn.addEventListener("click", login);
textField.addEventListener("keypress", (e) => {
	if (e.key === "Enter" && !e.shiftKey) {
		e.preventDefault();
		sendMessage();
	}
});
