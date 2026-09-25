const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createStudent,
  getStudents,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/", protect, authorize("ADMIN", "HOD", "FACULTY"), getStudents);

router.post("/", protect, authorize("ADMIN"), createStudent);

module.exports = router;
