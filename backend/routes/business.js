const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

// CREATE BUSINESS
router.post("/", async (req, res) => {
  try {
    const newBusiness = new Business({
      ...req.body,
      views: Math.floor(Math.random() * 500) + 1,
      interactions: Math.floor(Math.random() * 100) + 1
    });
    const saved = await newBusiness.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL BUSINESS
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET BUSINESS BY OWNER (for profile)
router.get("/owner/:email", async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.params.email }).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE BUSINESS
router.delete("/:id", async (req, res) => {
  try {
    const deletedBusiness = await Business.findByIdAndDelete(req.params.id);
    if (!deletedBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json({ message: "Business deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;