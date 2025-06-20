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
      index: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (value) => value.trim().length > 0,
        message: "Message cannot be empty.",
      },
    },

    // Encryption flag (unchanged)
    isEncrypted: {
      type: Boolean,
      default: true,
    },
    deletedFor: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    isDeletedForEveryone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
