const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { markAttendance } = require("../controllers/attendanceController");

const router = express.Router();

router.post(
  "/sessions/:sessionId",
  protect,
  authorize("ADMIN", "FACULTY"),
  markAttendance,
);

module.exports = router;
