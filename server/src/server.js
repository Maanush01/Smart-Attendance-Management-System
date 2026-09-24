require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");

const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const departmentRoutes = require("./routes/departmentRoutes");
const programRoutes = require("./routes/programRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const facultyAssignmentRoutes = require("./routes/facultyAssignmentRoutes");
const classSessionRoutes = require("./routes/classSessionRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/faculty-assignments", facultyAssignmentRoutes);
app.use("/api/class-sessions", classSessionRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Smart Attendance API is running",
  });
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
