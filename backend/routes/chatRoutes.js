const express = require("express");
const {
  createChat,
  sendMessage,
  getMessages,
  getUserChats,
} = require("../controllers/chatController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to create a chat (Authenticated)
router.post("/create", verifyToken, createChat);

// Route to send a message (Authenticated)
router.post("/send", verifyToken, sendMessage);

// Route to get all messages in a chat (Authenticated)
router.get("/messages/:chatId", verifyToken, getMessages);

// Get all chats for the logged-in user
router.get("/chats", verifyToken, getUserChats);

module.exports = router;
