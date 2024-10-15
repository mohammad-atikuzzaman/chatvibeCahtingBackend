const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "*", // Replace with your front-end domain
  methods: ["GET", "POST"],
  credentials: true, // Enable credentials if needed
};
// Middleware
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", (meetingId) => {
    console.log(`User joined room: ${meetingId}`);
    socket.join(meetingId);
  });

  socket.on("sendMessage", ({ meetingId, messageObj }) => {
    console.log(`Message in room ${meetingId}:`, messageObj);
    io.to(meetingId).emit("messageFromServer", messageObj);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Server listening with error handling
server.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});
