// members.js
const express = require("express");
const router = express.Router();
const Member = require("../models/member"); // Import the Member model

// Get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create a new member
router.post("/", async (req, res) => {
  const { name, phone, balance } = req.body;
  // Set default balance to 300 if balance is undefined
  const member = new Member({
    name: name,
    phone: phone,
    balance: balance !== undefined ? balance : 300, // Only set balance to 300 if not provided
  });

  try {
    const newMember = await member.save(); // Attempt to save the member
    console.log("New member created:", newMember); // Log the created member
    res.status(201).json(newMember); // Respond with the created member
  } catch (err) {
    console.error("Error saving member:", err); // Log the error for debugging
    res.status(400).json({ message: err.message }); // Respond with the error
  }
});

// Update member balance
router.patch("/:id/balance", async (req, res) => {
  const { amount } = req.body; // The amount to increase or decrease
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.balance += amount; // Update the balance
    const updatedMember = await member.save(); // Save the updated member
    res.json(updatedMember); // Respond with the updated member
  } catch (err) {
    console.error("Error updating balance:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Delete a member
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    await member.deleteOne(); // Remove the member
    res.json({ message: "Member deleted" });
  } catch (err) {
    console.error("Error deleting member:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
