const express = require("express");
const {
  createChat,
  getUserChats,
  updateChatName,
  sendMessage,
  getChatMessages,
  getAllUsers,
} = require("../controllers/chatController");

const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", verifyToken, createChat);
router.get("/user-chats", verifyToken, getUserChats);
router.patch("/update-name/:chatId", verifyToken, updateChatName);
router.post("/send-message", verifyToken, sendMessage);
router.get("/messages/:chatId", verifyToken, getChatMessages);
router.get("/users", verifyToken, getAllUsers);

module.exports = router;
