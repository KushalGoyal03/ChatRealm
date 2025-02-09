const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String, required: true }], // List of emails
});

module.exports = mongoose.model("Group", GroupSchema);
