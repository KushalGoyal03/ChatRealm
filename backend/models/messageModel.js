const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Faster queries by sender
    },
    content: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (value) => value.trim().length > 0, // Ensure non-empty content
        message: "Message cannot be empty.",
      },
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true, // Index for better read performance
        sparse: true, // Reduce index size for messages with no seenBy users
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Indexing chat field to improve query performance
messageSchema.index({ chat: 1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     content: String,
//     timestamp: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);

// module.exports = Message;
