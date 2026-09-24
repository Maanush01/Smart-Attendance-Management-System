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
    let students;

    if (req.user.role === "HOD") {
      const Program = require("../models/Program");

      const programs = await Program.find({
        departmentId: req.user.departmentId,
        isActive: true,
      }).select("_id");

      const programIds = programs.map((program) => program._id);

      students = await Student.find({
        programId: { $in: programIds },
        isActive: true,
      }).populate("userId", "name email");
    } else {
      students = await Student.find({
        isActive: true,
      }).populate("userId", "name email");
    }

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
