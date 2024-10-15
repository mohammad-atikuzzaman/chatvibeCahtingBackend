const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const port = 4000;

const cors = require("cors");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join-room", (meetingId) => {
    console.log(meetingId);
    socket.join(meetingId);
  });

  socket.on("sendMessage", ({ meetingId, messageObj }) => {
    console.log("Message from client: ", meetingId, messageObj);

    // Optionally, send a message back to the client

    io.to(meetingId).emit("messageFromServer", messageObj);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
