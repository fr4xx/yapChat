"use strict";

// --------------------- VARIABLES ---------------------
let username;
let isLoggedIn = false;

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
	if (!/\s/.test(loginUsername.value)) {
		if (loginUsername.value.length >= 3 && loginUsername.value.length <= 16) {
			username = loginUsername.value;
			loginSection.style.display = "none";
			appSection.style.display = "flex";
			socket.emit("login", username);
			isLoggedIn = true;
		} else if (loginUsername.value.length < 3) {
			console.error("🔴🔴🔴 | Username can't contain less than 3 characters!");
			// TO-DO!! | Handle error
		} else if (loginUsername.value.length > 16) {
			console.error("🔴🔴🔴 | Username can't contain more than 16 characters!");
			// TO-DO!! | Handle error
		}
	} else {
		console.error("🔴🔴🔴 | Username can't contain whitespace!");
		// TO-DO!! | Handle error
	}
};

const sendMessage = () => {
	if (!textField.value.trim() == "") {
		let messageText = textField.value.replace(/\n/g, "<br>");
		let message = { user: username, text: messageText };
		socket.emit("chat message", message);
		textField.value = "";
	}
};

const mention = (e) => {
	let afterText = textField.value + "@" + e.srcElement.innerHTML + " ";
	textField.value = "";
	textField.value = afterText;
};

socket.on("chat message", (msg) => {
	if (isLoggedIn) {
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

		if (msg.text.includes("@" + username)) {
			const mentionPattern = new RegExp(`@${username}`, "g");
			html = html.replace(mentionPattern, `<b>@${username}</b>`);
		}

		chatField.insertAdjacentHTML("afterbegin", html);
	}
});

socket.on("stillActive", () => {
	if (isLoggedIn) {
		socket.emit("isActive", username);
	}
});

socket.on("updateUsersList", (usersList) => {
	if (isLoggedIn) {
		userListSection.innerHTML = "";
		usersList.forEach((user) => {
			let html = `
			<li class="usersection__userlist--user" id="userListField${user}">${user}</li>
			`;
			userListSection.insertAdjacentHTML("beforeend", html);
			const userListField = document.getElementById("userListField" + user);
			userListField.addEventListener("click", mention);
		});
	}
});

socket.on("new user", (user) => {
	if (isLoggedIn) {
		let html = `
				<div class="infomessage"><span><b>${user}</b> joined the chat.</span></div>
				`;
		chatField.insertAdjacentHTML("afterbegin", html);
	}
});

sendBtn.addEventListener("click", sendMessage);
loginBtn.addEventListener("click", login);
textField.addEventListener("keypress", (e) => {
	if (e.key === "Enter" && !e.shiftKey) {
		e.preventDefault();
		sendMessage();
	}
});
