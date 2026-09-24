const express = require("express");
const { getAuditLogs } = require("../controllers/auditLogController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getAuditLogs);

module.exports = router;
