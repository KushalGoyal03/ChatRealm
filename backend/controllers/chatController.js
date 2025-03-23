const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { recipientEmail, customName } = req.body;
    const senderId = req.user.id;

    if (!recipientEmail?.trim()) {
      return res.status(400).json({ message: "Recipient email is required" });
    }

    // Find recipient
    const recipient = await User.findOne({ email: recipientEmail.trim() });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient._id.toString() === senderId) {
      return res
        .status(400)
        .json({ message: "Cannot start a chat with yourself" });
    }

    // Check if chat exists
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipient._id] },
    });

    if (chat) {
      // If a new custom name is provided, update it
      if (customName?.trim() && chat.chatName !== customName.trim()) {
        chat.chatName = customName.trim();
        await chat.save();
      }
      return res.status(200).json(chat);
    }

    // Create new chat
    chat = new Chat({
      participants: [senderId, recipient._id],
      chatName: customName?.trim() || recipient.username,
      messages: [],
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Chat creation failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all chats for the logged-in user
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username email")
      .populate({
        path: "messages",
        select: "content createdAt sender",
        options: { limit: 1 }, // Fetch latest message
      })
      .lean();

    res.status(200).json(chats);
  } catch (error) {
    console.error("Fetching chats failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message in a chat
const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.participants.includes(senderId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    const newMessage = new Message({
      chat: chatId,
      sender: senderId,
      content,
    });

    await newMessage.save();
    chat.messages.push(newMessage._id);
    await chat.save();

    const populatedMessage = await newMessage.populate(
      "sender",
      "username email"
    );
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Message sending failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages for a chat
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 }); // Keep oldest first (change to -1 for newest first)

    if (!messages.length) {
      return res.status(200).json([]); // Explicitly return an empty array
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetching messages failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createChat,
  getUserChats,
  sendMessage,
  getChatMessages,
};

// const Chat = require("../models/chatModel");
// const User = require("../models/userModel");
// const Message = require("../models/messageModel");

// // Create a new chat
// const createChat = async (req, res) => {
//   try {
//     const { recipientEmail } = req.body;
//     const senderId = req.user.id; // Extracted from JWT token

//     // Check if recipient exists
//     const recipient = await User.findOne({ email: recipientEmail });
//     if (!recipient) {
//       return res.status(404).json({ message: "Recipient not found" });
//     }

//     // Check if chat already exists
//     const existingChat = await Chat.findOne({
//       participants: { $all: [senderId, recipient._id] },
//     });

//     if (existingChat) {
//       return res.status(200).json(existingChat);
//     }

//     // Create a new chat
//     const newChat = new Chat({
//       participants: [senderId, recipient._id],
//       messages: [],
//     });

//     await newChat.save();
//     res.status(201).json(newChat);
//   } catch (error) {
//     console.error("Chat creation failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all chats for the logged-in user
// const getUserChats = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const chats = await Chat.find({ participants: userId })
//       .populate("participants", "username email")
//       .populate({
//         path: "messages",
//         options: { sort: { createdAt: -1 }, limit: 1 }, // Get latest message
//       });

//     res.status(200).json(chats);
//   } catch (error) {
//     console.error("Fetching chats failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Send a message in a chat
// const sendMessage = async (req, res) => {
//   try {
//     const { chatId, content } = req.body;
//     const senderId = req.user.id;

//     const chat = await Chat.findById(chatId);
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     const newMessage = new Message({
//       chat: chatId,
//       sender: senderId,
//       content,
//     });

//     await newMessage.save();

//     // Add message reference to chat
//     chat.messages.push(newMessage._id);
//     await chat.save();

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("Message sending failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get all messages for a chat
// const getChatMessages = async (req, res) => {
//   try {
//     const { chatId } = req.params;

//     const messages = await Message.find({ chat: chatId })
//       .populate("sender", "username email")
//       .sort({ createdAt: 1 });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Fetching messages failed:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   createChat,
//   getUserChats,
//   sendMessage,
//   getChatMessages,
// };
