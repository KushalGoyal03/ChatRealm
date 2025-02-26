import express, { json } from "express";
import { connect, connection } from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";

config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true })); // Adjust origin as needed
app.use(json()); // Parses incoming JSON requests

// MongoDB Connection
connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Root Route (For API Health Check)
app.get("/", (req, res) => {
  res.send("🚀 ChatSphere API is running...");
});

// Server Start
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("⚠️ Server shutting down...");
  await connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});

// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");

// dotenv.config(); // Load environment variables from .env

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // for parsing application/json

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/chats", chatRoutes);

// // Server start
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");

// dotenv.config(); // Load environment variables from .env

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // for parsing application/json

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// // Routes
// app.use("/api", userRoutes);

// // Server start
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
