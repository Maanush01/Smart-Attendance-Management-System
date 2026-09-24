const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const {
      userId,
      rollNumber,
      registerNumber,
      programId,
      sectionId,
      admissionYear,
    } = req.body;

    const student = await Student.create({
      userId,
      rollNumber,
      registerNumber,
      programId,
      sectionId,
      admissionYear,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
};
