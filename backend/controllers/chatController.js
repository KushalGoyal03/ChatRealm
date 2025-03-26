const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const mongoose = require("mongoose");

// Create a new chat or return existing chat
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

    // Create a new chat with proper custom names for both users
    chat = new Chat({
      participants: [senderId, recipient._id],
      customNames: {
        [senderId]: customName?.trim() || recipient.username, // Sender's view of recipient
        [recipient._id]: req.user.username, // Recipient sees sender’s username
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
        select: "content createdAt sender seenBy",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Get only latest message
      })
      .lean();

    chats.forEach((chat) => {
      chat.customNames = chat.customNames || {}; // Ensure it's an object

      chat.chatName =
        chat.customNames[userId] ||
        chat.participants.find((p) => p._id.toString() !== userId.toString())
          ?.username ||
        "Unknown";

      // ✅ Assign latest message correctly
      chat.lastMessage = chat.messages.length > 0 ? chat.messages[0] : null;
      delete chat.messages; // ❌ Remove messages array to avoid confusion

      if (chat.lastMessage) {
        chat.lastMessage.time = new Date(
          chat.lastMessage.createdAt
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        chat.lastMessage.seen =
          Array.isArray(chat.lastMessage.seenBy) &&
          chat.lastMessage.seenBy.some(
            (seenUserId) => seenUserId.toString() === userId.toString()
          );
      }
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update custom chat name (only for the user who updates it)
const updateChatName = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { customName } = req.body;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Ensure the requesting user is a participant
    if (!chat.participants.some((id) => id.toString() === userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update customNames using Mongoose Map's .set() method
    chat.customNames.set(userId, customName?.trim() || "");

    await chat.save();

    res.status(200).json({ message: "Chat name updated successfully", chat });
  } catch (error) {
    console.error("Error updating chat name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message in a chat
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

    // Convert senderId to ObjectId for correct comparison
    if (!chat.participants.some((id) => id.toString() === senderId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    const newMessage = new Message({
      chat: chatId,
      sender: senderId,
      content: content.trim(),
      seenBy: [senderId], // Marked as seen only by the sender
    });

    await newMessage.save();

    // Add message to chat
    chat.messages.push(newMessage._id);
    await chat.save();

    // Populate sender details before sending response
    const populatedMessage = await newMessage.populate(
      "sender",
      "username email"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Message sending failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all messages for a chat (with seen status and timestamps)
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 })
      .lean();

    if (!messages.length) {
      return res.status(200).json([]);
    }

    let lastDate = "";
    messages.forEach((msg) => {
      if (!msg.createdAt) {
        msg.time = "Unknown Time"; // Prevents Invalid Date
        msg.newDate = null;
      } else {
        const msgDate = new Date(msg.createdAt).toLocaleDateString();
        msg.time = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Only set `newDate` when the date changes
        if (msgDate !== lastDate) {
          msg.newDate = msgDate;
          lastDate = msgDate;
        } else {
          msg.newDate = null;
        }
      }

      // Fix seen status check (Ensure `seenBy` is an array)
      msg.seen =
        Array.isArray(msg.seenBy) &&
        msg.seenBy.some((id) => id.toString() === userId);
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetching messages failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark messages as seen
const markMessagesAsSeen = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Update messages directly without fetching them first
    const result = await Message.updateMany(
      { chat: chatId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: "No new messages to mark as seen." });
    }

    res.status(200).json({ message: "Messages marked as seen." });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createChat,
  getUserChats,
  updateChatName,
  sendMessage,
  getChatMessages,
  markMessagesAsSeen,
};
