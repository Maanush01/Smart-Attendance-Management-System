const User = require("../models/User");

const getFaculty = async (req, res) => {
  try {
    let faculty;

    if (req.user.role === "HOD") {
      faculty = await User.find({
        role: "FACULTY",
        departmentId: req.user.departmentId,
        isActive: true,
      }).select("-passwordHash");
    } else {
      faculty = await User.find({
        role: "FACULTY",
        isActive: true,
      }).select("-passwordHash");
    }

    res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getFaculty };
