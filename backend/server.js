require("dotenv").config(); // Ensure env variables are loaded first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatSocketHandler = require("./socket"); // WebSocket handler

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server for WebSocket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB connection lost:", err);
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Root Route (For API Health Check)
app.get("/", (req, res) => {
  res.send("🚀 ChatSphere API is running...");
});

// WebSocket Event Handling
chatSocketHandler(io);

// Handle WebSocket Errors
io.on("error", (err) => {
  console.error("⚠️ WebSocket Error:", err);
});

// Start Server with WebSocket
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("⚠️ Server shutting down...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});
