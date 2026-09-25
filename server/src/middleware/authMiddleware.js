const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "departmentId isActive role",
    );

    if (!user || !user.isActive || user.role !== decoded.role) {
      return res.status(401).json({
        success: false,
        message: "User is no longer authorized",
      });
    }

    req.user = {
      ...decoded,
      role: user.role,
      departmentId: user?.departmentId || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;
