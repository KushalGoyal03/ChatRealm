// userRoutes.js
const express = require("express");
const router = express.Router();
const { User } = require("../models/model");
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

//Get all users
router.get("/users", getUsers);

//fetch username
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
