const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let activeUser = [];
let activeUserCount = 0;

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
	console.log("[INFO] New connection!");

	// Retrieve the user's IP address
	let rawAddress = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
	
	// If the address is IPv6-mapped IPv4 (starts with "::ffff:"), clean it up
	let address = rawAddress.startsWith("::ffff:") ? rawAddress.slice(7) : rawAddress;
	
	socket.on("chat message", (msg) => {
		console.log("[MSG] " + msg.user + " (" + address + "): " + msg.text);
		io.emit("chat message", msg);
	});

	socket.on("disconnect", () => {
		activeUser = [];
		activeUserCount -= 1;
		console.log("[DISC] User disconnected");
		io.emit("stillActive");
	});

	socket.on("login", (username) => {
		console.log("[IN] " + username + " logged in.");
		io.emit("new user", username);
		activeUser.push(username);
		activeUserCount = activeUser.length;
		io.emit("updateUsersList", activeUser);
		console.log("[INFO] Updated active users");
	});

	socket.on("isActive", (username) => {
		activeUser.push(username);
		if (activeUser.length == activeUserCount) {
			io.emit("updateUsersList", activeUser);
			console.log("[INFO] Updated active users");
		}
	});
});

server.listen(4040, () => {
	console.log("Server is running on http://localhost:4040");
});
