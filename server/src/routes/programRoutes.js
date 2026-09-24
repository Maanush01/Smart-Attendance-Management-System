const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createProgram,
  getPrograms,
} = require("../controllers/programController");

const router = express.Router();

router.get("/", protect, getPrograms);

router.post("/", protect, authorize("ADMIN"), createProgram);

module.exports = router;
