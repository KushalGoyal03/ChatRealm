const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/api_routes");
const groupRoutes = require("./routes/groupRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if unable to connect
  });

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("ChatSphere Backend is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const userRoutes = require("./routes/api_routes");
// const groupRoutes = require("./routes/groupRoutes");

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
// app.use("/api/groups", groupRoutes);

// // Server start
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
