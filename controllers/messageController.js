const messageModel = require("../models/messageModel");
const Message = require("../models/messageModel");
const asyncHandler = require("express-async-handler");

const addMessage = asyncHandler(async (req, res) => {
  const { from, to, message } = req.body;
  const data = await Message.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });
  if (data) {
    return res.json({ msg: "Message added successfully" });
  }
  return res.json({ msg: "Failed to add message" });
});

const getAllMessages = asyncHandler(async (req, res) => {
  const { from, to } = req.body;
  console.log("Sender", from);
  console.log("to", to);
  const messages = await messageModel
    .find({
      users: {
        $all: [from, to],
      },
    })
    .sort({ updated: 1 });

  const projectMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });
  res.json(projectMessages);
});

module.exports = { addMessage, getAllMessages };
