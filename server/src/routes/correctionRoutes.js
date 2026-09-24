const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createCorrectionRequest,
} = require("../controllers/correctionController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("STUDENT", "FACULTY"),
  createCorrectionRequest,
);

module.exports = router;
