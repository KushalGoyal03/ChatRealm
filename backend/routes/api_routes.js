// api_routes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/controller");

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

module.exports = router;
