const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    customNames: {
      type: Map,
      of: String,
      default: {},
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ participants: 1 });
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
