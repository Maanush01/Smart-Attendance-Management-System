const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createAssignment,
  getAssignments,
} = require("../controllers/facultyAssignmentController");

const router = express.Router();

router.get("/", protect, getAssignments);

router.post("/", protect, authorize("ADMIN"), createAssignment);

module.exports = router;
