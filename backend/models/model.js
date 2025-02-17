const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Chat Schema
const chatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in the chat
    isGroup: { type: Boolean, default: false }, // true if it's a group chat
    chatName: { type: String, default: "" }, // Name for groups, otherwise user's name
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Chat, Message };

// // model.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
