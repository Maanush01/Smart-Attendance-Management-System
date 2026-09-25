const express = require("express");

const {
  login,
  createUser,
  getUsers,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/login", login);

router.post("/users", protect, authorize("ADMIN"), createUser);

router.get("/users", protect, authorize("ADMIN"), getUsers);

module.exports = router;
