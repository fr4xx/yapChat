const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});

	socket.on("disconnect", () => {
		console.log("User  disconnected");
	});
});

server.listen(4040, () => {
	console.log("Server is running on http://localhost:4040");
});
