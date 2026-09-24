const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.post(
  "/sessions/:sessionId",
  protect,
  authorize("ADMIN", "FACULTY"),
  markAttendance,
);

router.get(
  "/history",
  protect,
  authorize("ADMIN", "HOD", "FACULTY", "STUDENT"),
  getAttendance,
);

module.exports = router;
