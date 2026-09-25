const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createDepartment,
  getDepartments,
} = require("../controllers/departmentController");

const router = express.Router();

router.get("/", protect, authorize("ADMIN", "HOD", "FACULTY"), getDepartments);

router.post("/", protect, authorize("ADMIN"), createDepartment);

module.exports = router;
