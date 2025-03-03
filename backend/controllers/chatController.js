import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { User, Chat, Message } from "../models/model.js";

config();

// Middleware to verify JWT and extract user info
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user details in req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Get all chats for a logged-in user
const getUserChats = async (req, res) => {
  try {
    const userEmail = req.user.email; // Logged-in user email

    // Find chats where the user is a participant
    const chats = await Chat.find({ participants: userEmail })
      .populate("participants", "username email")
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Create Chat
const createChat = async (req, res) => {
  const userEmail1 = req.user.email; // Logged-in user email
  const { userEmail2 } = req.body; // Recipient email

  try {
    if (userEmail1 === userEmail2) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
      console.log(userEmail1);
    }

    const user1 = await User.findOne({ email: userEmail1 });
    const user2 = await User.findOne({ email: userEmail2 });

    if (!user1 || !user2) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userEmail1, userEmail2], $size: 2 },
    });

    if (!chat) {
      chat = new Chat({ participants: [userEmail1, userEmail2] });
      await chat.save();
    }

    return res.status(200).json({ chat, message: "Chat created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Send Message
const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderEmail = req.user.email; // Logged-in user email

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.participants.includes(senderEmail)) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    const newMessage = new Message({
      chatId,
      sender: senderEmail,
      content,
      timestamp: new Date(),
    });

    await newMessage.save();

    // Update chat's last activity
    chat.updatedAt = new Date();
    await chat.save();

    return res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get Messages for a Chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId })
      .sort({ timestamp: 1 })
      .populate("sender", "username email");

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  verifyToken,
  getUserChats,
  createChat,
  sendMessage,
  getMessages,
};

// const { User, Chat, Message } = require("../models/model");
// const jwt = require("jsonwebtoken");

// // Middleware to verify JWT and extract user info
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Store user details in req.user
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Create Chat
// const createChat = async (req, res) => {
//   const userId1 = req.user.email; // Logged-in user
//   const { userId2 } = req.body; // Recipient email

//   try {
//     console.log("Creating chat with users:", userId1, userId2);

//     if (userId1 === userId2) {
//       return res.status(400).json({ message: "You cannot chat with yourself" });
//     }

//     // Fetch users by email
//     const user1 = await User.findOne({ email: userId1 });
//     const user2 = await User.findOne({ email: userId2 });

//     if (!user1 || !user2) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Sort users by ObjectId to ensure uniqueness
//     const sortedUsers = [user1._id, user2._id].sort();

//     // Check if chat already exists
//     let chat = await Chat.findOne({
//       participants: { $all: sortedUsers, $size: 2 },
//     });

//     if (!chat) {
//       chat = new Chat({ participants: sortedUsers });
//       await chat.save();
//     }

//     return res.status(200).json({ chat, message: "Chat created successfully" });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // Send Message
// const sendMessage = async (req, res) => {
//   const { chatId, content } = req.body;
//   const senderEmail = req.user.email; // Logged-in user

//   try {
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     // Fetch sender by email
//     const sender = await User.findOne({ email: senderEmail });
//     if (!sender) {
//       return res.status(404).json({ message: "Sender not found" });
//     }

//     if (!chat.participants.map(String).includes(String(sender._id))) {
//       return res.status(403).json({ message: "You are not part of this chat" });
//     }

//     const newMessage = new Message({
//       chatId,
//       sender: sender._id,
//       content,
//     });

//     await newMessage.save();

//     return res.status(201).json({ message: "Message sent", newMessage });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // Get Messages
// const getMessages = async (req, res) => {
//   const { chatId } = req.params;

//   try {
//     const messages = await Message.find({ chatId })
//       .sort({ timestamp: 1 })
//       .populate("sender", "username email");

//     return res.status(200).json(messages);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = {
//   verifyToken,
//   createChat,
//   sendMessage,
//   getMessages,
// };

// // chatController.js
// const { User, Chat, Message } = require("../models/model");

// // Create Chat
// const createChat = async (req, res) => {
//   const { userId1, userId2 } = req.body; // These are emails, not ObjectIds

//   try {
//     console.log("Creating chat with users:", userId1, userId2); // Log incoming data

//     if (userId1 === userId2) {
//       return res.status(400).json({ message: "You cannot chat with yourself" });
//     }

//     // Fetch users by email
//     const user1 = await User.findOne({ email: userId1 });
//     const user2 = await User.findOne({ email: userId2 });

//     if (!user1 || !user2) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("Found users:", user1, user2); // Log the found users

//     // Ensure consistent ordering of users by their ObjectIds
//     const sortedUsers = [user1._id, user2._id].sort();
//     console.log("Sorted users' ObjectIds:", sortedUsers); // Log sorted user IDs

//     // Check if chat already exists by comparing the ObjectIds
//     let chat = await Chat.findOne({ participants: { $all: sortedUsers } });

//     if (!chat) {
//       // Create a new chat with the sorted user IDs
//       chat = new Chat({ participants: sortedUsers });
//       await chat.save();
//     }

//     return res.status(200).json({ chat, message: "Chat created successfully" });
//   } catch (error) {
//     console.error(error); // Log error for debugging
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // Send Message
// const sendMessage = async (req, res) => {
//   const { chatId, senderId, message } = req.body;

//   try {
//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     if (!chat.users.includes(senderId)) {
//       return res.status(403).json({ message: "You are not part of this chat" });
//     }

//     const sender = await User.findById(senderId);
//     if (!sender) {
//       return res.status(404).json({ message: "Sender not found" });
//     }

//     const newMessage = new Message({
//       chatId,
//       senderId,
//       message,
//       timestamp: new Date(),
//     });

//     await newMessage.save();

//     return res.status(201).json({ message: "Message sent", newMessage });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // Get Messages
// const getMessages = async (req, res) => {
//   const { chatId } = req.params;

//   try {
//     const messages = await Message.find({ chatId })
//       .sort({ createdAt: 1 })
//       .populate("senderId", "username email"); // Populate sender details

//     return res.status(200).json(messages);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // Get all users (for chat feature)
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, "id username email"); // Return only necessary fields
//     return res.status(200).json(users);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = { createChat, sendMessage, getMessages, getUsers };
