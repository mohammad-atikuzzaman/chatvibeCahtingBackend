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
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// hello testing




// Socket.io logic
io.on("connection", (socket) => {

  socket.on("join-room", (meetingId) => {
    socket.join(meetingId);
  });

  socket.on("sendMessage", ({ meetingId, messageObj }) => {
    io.to(meetingId).emit("messageFromServer", messageObj);
  });

  // socket.on("disconnect", () => {
  //   console.log(`User disconnected: ${socket.id}`);
  // });
});


// Server listening with error handling
server.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});
