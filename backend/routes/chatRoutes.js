const express = require("express");
const {
  createChat,
  getUserChats,
  updateChatName,
  sendMessage,
  getChatMessages,
  getAllUsers,
  deleteChatForMe,
} = require("../controllers/chatController");

const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Chat-related routes
router.post("/create", verifyToken, createChat);
router.get("/user-chats", verifyToken, getUserChats);
router.patch("/update-name/:chatId", verifyToken, updateChatName);
router.patch("/delete/:chatId", verifyToken, deleteChatForMe);

// Message-related routes
router.post("/send-message", verifyToken, sendMessage);
router.get("/messages/:chatId", verifyToken, getChatMessages);

// User list
router.get("/users", verifyToken, getAllUsers);

module.exports = router;
