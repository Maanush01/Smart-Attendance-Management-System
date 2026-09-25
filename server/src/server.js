require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://smart-attendance-management-system-ten.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/smart-attendance-management-system.*\.vercel\.app$/.test(
          origin,
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

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
const correctionRoutes = require("./routes/correctionRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/faculty-assignments", facultyAssignmentRoutes);
app.use("/api/class-sessions", classSessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/corrections", correctionRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/audit-logs", auditLogRoutes);

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

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
