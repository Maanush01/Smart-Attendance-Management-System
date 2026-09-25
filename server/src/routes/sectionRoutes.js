const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createSection,
  getSections,
} = require("../controllers/sectionController");

const router = express.Router();

router.get("/", protect, authorize("ADMIN", "HOD", "FACULTY"), getSections);

router.post("/", protect, authorize("ADMIN"), createSection);

module.exports = router;
