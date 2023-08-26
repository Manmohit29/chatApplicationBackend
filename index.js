const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConnection");
require("dotenv").config();
const app = express();
const socket = require("socket.io");
const url = process.env.URL;

//Cors
app.use(cors());

//JSON
app.use(express.json());

//MongoDB connection
connectDB();

//PORT from env file
const port = process.env.PORT || 6000;

//API's
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

const server = app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: url,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log("user connected: ", socket.id);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(data.message);

    console.log("sendUserSocket(receiver) ", sendUserSocket);
    if (sendUserSocket) {
      console.log("msg received is emitted");
      socket.to(sendUserSocket).emit("msg-received", data.message);
    }
  });
});
