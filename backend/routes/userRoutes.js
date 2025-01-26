const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser); // Route to register a new user
router.post("/login", loginUser); // Route for user login

module.exports = router;
