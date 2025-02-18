// chatController.js
const { User, Chat, Message } = require("../models/model");

// Create Chat
const createChat = async (req, res) => {
  const { userId1, userId2 } = req.body; // These are emails, not ObjectIds

  try {
    console.log("Creating chat with users:", userId1, userId2); // Log incoming data

    if (userId1 === userId2) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Fetch users by email
    const user1 = await User.findOne({ email: userId1 });
    const user2 = await User.findOne({ email: userId2 });

    if (!user1 || !user2) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found users:", user1, user2); // Log the found users

    // Ensure consistent ordering of users by their ObjectIds
    const sortedUsers = [user1._id, user2._id].sort();
    console.log("Sorted users' ObjectIds:", sortedUsers); // Log sorted user IDs

    // Check if chat already exists by comparing the ObjectIds
    let chat = await Chat.findOne({ participants: { $all: sortedUsers } });

    if (!chat) {
      // Create a new chat with the sorted user IDs
      chat = new Chat({ participants: sortedUsers });
      await chat.save();
    }

    return res.status(200).json({ chat, message: "Chat created successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Send Message
const sendMessage = async (req, res) => {
  const { chatId, senderId, message } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.users.includes(senderId)) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const newMessage = new Message({
      chatId,
      senderId,
      message,
      timestamp: new Date(),
    });

    await newMessage.save();

    return res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get Messages
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("senderId", "username email"); // Populate sender details

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { createChat, sendMessage, getMessages };
