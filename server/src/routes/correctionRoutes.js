const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createCorrectionRequest,
  reviewCorrectionRequest,
} = require("../controllers/correctionController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("STUDENT", "FACULTY"),
  createCorrectionRequest,
);

router.patch(
  "/:id/review",
  protect,
  authorize("ADMIN", "HOD"),
  reviewCorrectionRequest,
);

module.exports = router;
