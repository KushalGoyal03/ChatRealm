const Chat = require("./models/chatModel");
const Message = require("./models/messageModel");

const users = {}; // Store connected users { userId: socketId }

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // User joins the chat
    socket.on("join", ({ userId }) => {
      users[userId] = socket.id;
      console.log(`✅ User ${userId} connected with socket ${socket.id}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ chatId, senderId, content }) => {
      try {
        const message = new Message({
          chat: chatId,
          sender: senderId,
          content,
          seenBy: [senderId], // Sender sees their own message
        });
        await message.save();

        const chat = await Chat.findById(chatId).populate(
          "participants",
          "email username"
        );

        if (!chat) return;

        chat.messages.push(message._id);
        await chat.save();

        chat.participants.forEach((participant) => {
          if (
            users[participant._id] &&
            participant._id.toString() !== senderId
          ) {
            io.to(users[participant._id]).emit("receiveMessage", {
              chatId,
              sender: senderId,
              content,
              messageId: message._id,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle message seen status
    socket.on("messageSeen", async ({ messageId, receiverId }) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.seenBy.addToSet(receiverId);
          await message.save();

          // Notify the sender
          if (users[message.sender]) {
            io.to(users[message.sender]).emit("messageSeen", { messageId });
          }
        }
      } catch (error) {
        console.error("Error updating seen status:", error);
      }
    });

    // Handle updating custom names in chat list
    socket.on("updateCustomName", async ({ chatId, userId, customName }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat) {
          chat.customNames.set(userId, customName); // Update only this user's custom name
          await chat.save();

          // Notify the user
          if (users[userId]) {
            io.to(users[userId]).emit("customNameUpdated", {
              chatId,
              customName,
            });
          }
        }
      } catch (error) {
        console.error("Error updating custom name:", error);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      for (let userId in users) {
        if (users[userId] === socket.id) {
          console.log(`❌ User ${userId} disconnected`);
          delete users[userId];
          break;
        }
      }
    });
  });
};
