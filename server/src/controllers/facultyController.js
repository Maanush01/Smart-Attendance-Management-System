const User = require("../models/User");

const getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: "FACULTY" }).select(
      "-passwordHash",
    );

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
