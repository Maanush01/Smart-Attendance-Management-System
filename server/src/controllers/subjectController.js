const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
  try {
    const { name, code, programId, semester, credits } = req.body;

    const subject = await Subject.create({
      name,
      code,
      programId,
      semester,
      credits,
    });

    res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true });

    res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
};
