const express = require("express");
const router = express.Router();
const Group = require("../models/Group");

// Create a new group
router.post("/create", async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Fetch groups for a user
router.get("/", async (req, res) => {
  try {
    const userEmail = req.query.email; // Get logged-in user's email
    const groups = await Group.find({ members: userEmail });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

module.exports = router;
