const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createSubject,
  getSubjects,
} = require("../controllers/subjectController");

const router = express.Router();

router.get("/", protect, getSubjects);

router.post("/", protect, authorize("ADMIN"), createSubject);

module.exports = router;
