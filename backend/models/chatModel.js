const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],

    customNames: {
      type: Map,
      of: String, // Stores custom names per user (userId -> custom name)
      default: {},
    },

    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

    seenStatus: {
      type: Map,
      of: Boolean, // Tracks if a user has seen the latest message (userId -> true/false)
      default: {},
    },
  },
  { timestamps: true }
);

// Add an index for better performance on participant queries
chatSchema.index({ participants: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
