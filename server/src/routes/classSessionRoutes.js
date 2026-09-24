const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createSession,
  getSessions,
} = require("../controllers/classSessionController");

const router = express.Router();

router.get("/", protect, getSessions);

router.post("/", protect, authorize("ADMIN", "FACULTY"), createSession);

module.exports = router;
