const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createProgram,
  getPrograms,
} = require("../controllers/programController");

const router = express.Router();

router.get("/", protect, authorize("ADMIN", "HOD", "FACULTY"), getPrograms);

router.post("/", protect, authorize("ADMIN"), createProgram);

module.exports = router;
