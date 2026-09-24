require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Smart Attendance API is running",
  });
});

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
