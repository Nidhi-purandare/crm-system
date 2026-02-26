const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");

const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

console.log("Lead routes loaded");

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Lead route working");
});


// ✅ Get all leads (All logged in users)
router.get("/", verifyToken, async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ✅ Add lead (Admin + Sales only)
router.post(
  "/add",
  verifyToken,
  checkRole(["admin", "sales"]),
  async (req, res) => {
    try {
      const newLead = new Lead(req.body);
      await newLead.save();
      res.json({ message: "Lead added successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);


// ✅ Update lead (Admin + Sales)
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "sales"]),
  async (req, res) => {
    try {
      const updatedLead = await Lead.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ✅ Add activity (Admin + Sales)
router.post(
  "/:id/activity",
  verifyToken,
  checkRole(["admin", "sales"]),
  async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      lead.activities.push({
        type: req.body.type || "Note",
        message: req.body.message,
        date: new Date(),
      });

      await lead.save();
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Error adding activity" });
    }
  }
);


// ✅ Delete lead (Admin only)
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const deletedLead = await Lead.findByIdAndDelete(req.params.id);

      if (!deletedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;