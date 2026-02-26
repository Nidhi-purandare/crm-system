const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  status: String,
  stage: String,
  dealValue: Number,

  // ✅ ADD THIS
  activities: [
    {
      type: {
        type: String,
        default: "Note",
      },
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Lead", leadSchema);
