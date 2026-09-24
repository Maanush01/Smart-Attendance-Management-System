const FacultyAssignment = require("../models/FacultyAssignment");

const createAssignment = async (req, res) => {
  try {
    const { facultyId, subjectId, sectionId, academicYear, semester } =
      req.body;

    const assignment = await FacultyAssignment.create({
      facultyId,
      subjectId,
      sectionId,
      academicYear,
      semester,
    });

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await FacultyAssignment.find({
      isActive: true,
    });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
};
