const express = require("express");
const { getFaculty } = require("../controllers/facultyController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getFaculty);

module.exports = router;
