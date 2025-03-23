const express = require("express");
const {
  createChat,
  getUserChats,
  sendMessage,
  getChatMessages,
} = require("../controllers/chatController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new chat
router.post("/create", verifyToken, createChat);

// Get all chats for the logged-in user
router.get("/user-chats", verifyToken, getUserChats);

// Send a message in a chat
router.post("/send-message", verifyToken, sendMessage);

// Get all messages of a specific chat
router.get("/messages/:chatId", verifyToken, getChatMessages);

module.exports = router;
