const express = require("express");
const {
  createChat,
  getUserChats,
  updateChatName,
  sendMessage,
  getChatMessages,
  markMessagesAsSeen,
} = require("../controllers/chatController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new chat
router.post("/create", verifyToken, createChat);

// Get all chats for the logged-in user
router.get("/user-chats", verifyToken, getUserChats);

// Update custom chat name (only for the user making the request)
router.patch("/update-name/:chatId", verifyToken, updateChatName);

// Send a message in a chat
router.post("/send-message", verifyToken, sendMessage);

// Get all messages of a specific chat
router.get("/messages/:chatId", verifyToken, getChatMessages);

// Mark messages as seen
router.patch("/mark-seen/:chatId", verifyToken, markMessagesAsSeen);

module.exports = router;
