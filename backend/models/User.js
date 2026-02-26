const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "sales", "viewer"],
    default: "viewer",
  },
});

module.exports = mongoose.model("User", userSchema);