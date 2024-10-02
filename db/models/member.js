// member.js
const mongoose = require("mongoose");

// Define the Member schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
});

// Create the Member model
const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
