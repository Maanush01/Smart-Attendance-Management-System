const Student = require("../models/Student");
const User = require("../models/User");
const Program = require("../models/Program");
const Section = require("../models/Section");

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

    if (
      !userId ||
      !rollNumber?.trim() ||
      !programId ||
      !sectionId ||
      !admissionYear
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User, roll number, program, section, and admission year are required",
      });
    }

    const [user, program, section] = await Promise.all([
      User.findOne({ _id: userId, role: "STUDENT", isActive: true }),
      Program.findOne({ _id: programId, isActive: true }),
      Section.findOne({ _id: sectionId, isActive: true }),
    ]);

    if (
      !user ||
      !program ||
      !section ||
      section.programId.toString() !== program._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student user, program, and section must be valid and compatible",
      });
    }

    const duplicate = await Student.findOne({
      $or: [{ userId }, { rollNumber: rollNumber.trim() }],
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "A student profile already exists for this user or roll number",
      });
    }

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
    const sectionFilter = req.query.sectionId
      ? { sectionId: req.query.sectionId }
      : {};
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
        ...sectionFilter,
      }).populate("userId", "name email");
    } else {
      students = await Student.find({
        isActive: true,
        ...sectionFilter,
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
