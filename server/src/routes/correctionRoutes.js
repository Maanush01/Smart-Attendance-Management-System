const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createCorrectionRequest,
  reviewCorrectionRequest,
  getCorrectionRequests,
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

router.get(
  "/",
  protect,
  authorize("ADMIN", "HOD", "STUDENT"),
  getCorrectionRequests,
);

module.exports = router;
