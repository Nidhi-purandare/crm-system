console.log("Auth routes loaded");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey"
    );

    res.json({ token, role: user.role });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;