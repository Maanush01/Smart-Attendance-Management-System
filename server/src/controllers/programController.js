const Program = require("../models/Program");

const createProgram = async (req, res) => {
  try {
    const { name, code, departmentId, durationYears } = req.body;

    const program = await Program.create({
      name,
      code,
      departmentId,
      durationYears,
    });

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true });

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProgram,
  getPrograms,
};
