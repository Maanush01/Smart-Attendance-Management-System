const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getAttendance,
  getLowAttendance,
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

router.get(
  "/low-attendance",
  protect,
  authorize("ADMIN", "HOD", "FACULTY"),
  getLowAttendance,
);

module.exports = router;
