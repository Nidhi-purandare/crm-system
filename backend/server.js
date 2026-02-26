const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ CORS FIX
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/enterprise_crm")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
 

// ✅ Lead routes
const leadRoutes = require("./routes/leadRoutes");
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => res.send("Backend running"));

app.listen(5000, () => console.log("Server running on port 5000"));
