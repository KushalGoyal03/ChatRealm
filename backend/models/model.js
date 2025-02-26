import { Schema, model } from "mongoose";

// User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model("User", userSchema);

// Chat Schema
const chatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Chat = model("Chat", chatSchema);

// Message Schema
const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = model("Message", messageSchema);

export default { User, Chat, Message };

// const mongoose = require("mongoose");

// // User Schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // Chat Schema
// const chatSchema = new mongoose.Schema({
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
// });

// const Chat = mongoose.model("Chat", chatSchema);

// // Message Schema
// const messageSchema = new mongoose.Schema({
//   chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);

// module.exports = { User, Chat, Message };

// // model.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
