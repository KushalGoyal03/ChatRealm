const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.MESSAGE_SECRET || "ChatRealmKushalGoyal";

const createChat = async (req, res) => {
  try {
    const { recipientEmail, customName } = req.body;
    const senderId = req.user.id;

    if (!recipientEmail?.trim()) {
      return res.status(400).json({ message: "Recipient email is required" });
    }

    // Find recipient
    const recipient = await User.findOne({
      email: recipientEmail.trim(),
    }).lean();
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient._id.toString() === senderId) {
      return res
        .status(400)
        .json({ message: "Cannot start a chat with yourself" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipient._id] },
    });

    if (chat) {
      return res
        .status(400)
        .json({ message: "Chat already exists between these users" });
    }

    // Create a new chat
    chat = new Chat({
      participants: [senderId, recipient._id],
      customNames: {
        [senderId]: customName?.trim() || recipient.username,
        [recipient._id]: req.user.username,
      },
      messages: [],
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Chat creation failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserChats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username email")
      .populate({
        path: "messages",
        select: "content createdAt sender",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .lean();

    chats.forEach((chat) => {
      chat.customNames = chat.customNames || {};

      chat.chatName =
        chat.customNames[userId] ||
        chat.participants.find((p) => p._id.toString() !== userId.toString())
          ?.username ||
        "Unknown";

      chat.lastMessage = chat.messages.length > 0 ? chat.messages[0] : null;
      delete chat.messages;

      if (chat.lastMessage) {
        chat.lastMessage.time = new Date(
          chat.lastMessage.createdAt
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateChatName = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { customName } = req.body;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.participants.some((id) => id.toString() === userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    chat.customNames.set(userId, customName?.trim() || "");
    await chat.save();

    res.status(200).json({ message: "Chat name updated successfully", chat });
  } catch (error) {
    console.error("Error updating chat name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user.id;

    if (!content?.trim()) {
      return res
        .status(400)
        .json({ message: "Message content cannot be empty" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.participants.some((id) => id.toString() === senderId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    // Encrypt message content
    const encryptedContent = CryptoJS.AES.encrypt(
      content.trim(),
      SECRET_KEY
    ).toString();

    const newMessage = new Message({
      chat: chatId,
      sender: senderId,
      content: encryptedContent,
      isEncrypted: true,
    });

    await newMessage.save();

    chat.messages.push(newMessage._id);
    await chat.save();

    const populatedMessage = await newMessage.populate(
      "sender",
      "username email"
    );

    res.status(201).json({
      ...populatedMessage.toObject(),
      content, // Return decrypted content to client immediately
    });
  } catch (error) {
    console.error("Message sending failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 })
      .lean();

    if (!messages.length) {
      return res.status(200).json([]);
    }

    let lastDate = "";

    const decryptedMessages = messages.map((msg) => {
      try {
        const bytes = CryptoJS.AES.decrypt(msg.content, SECRET_KEY);
        msg.content =
          bytes.toString(CryptoJS.enc.Utf8) || "[Failed to decrypt]";
      } catch {
        msg.content = "[Decryption error]";
      }

      if (!msg.createdAt) {
        msg.time = "Unknown Time";
        msg.newDate = null;
      } else {
        const msgDate = new Date(msg.createdAt).toLocaleDateString();
        msg.time = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        msg.newDate = msgDate !== lastDate ? msgDate : null;
        lastDate = msgDate;
      }

      return msg;
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Fetching messages failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("username email _id")
      .lean();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createChat,
  getUserChats,
  updateChatName,
  sendMessage,
  getChatMessages,
  getAllUsers,
};
