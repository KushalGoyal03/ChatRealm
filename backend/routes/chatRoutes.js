// chatRoutes.js
const express = require("express");
const {
  createChat,
  sendMessage,
  getMessages,
} = require("../controllers/chatController");

const router = express.Router();

// Route to create a chat
router.post("/create", createChat);

// Route to send a message
router.post("/send", sendMessage);

// Route to get all messages in a chat
router.get("/messages/:chatId", getMessages);

module.exports = router;
