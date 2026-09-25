const FacultyAssignment = require("../models/FacultyAssignment");
const Program = require("../models/Program");
const Subject = require("../models/Subject");
const User = require("../models/User");
const Section = require("../models/Section");

const createAssignment = async (req, res) => {
  try {
    const { facultyId, subjectId, sectionId, academicYear, semester } =
      req.body;

    if (!facultyId || !subjectId || !sectionId || !academicYear || !semester) {
      return res.status(400).json({
        success: false,
        message:
          "Faculty, subject, section, academic year, and semester are required",
      });
    }

    const [faculty, subject, section] = await Promise.all([
      User.findOne({ _id: facultyId, role: "FACULTY", isActive: true }),
      Subject.findOne({ _id: subjectId, isActive: true }),
      Section.findOne({ _id: sectionId, isActive: true }),
    ]);

    if (
      !faculty ||
      !subject ||
      !section ||
      subject.programId.toString() !== section.programId.toString() ||
      section.semester !== Number(semester)
    ) {
      return res.status(400).json({
        success: false,
        message: "Faculty, subject, section, and semester must be compatible",
      });
    }

    const existingAssignment = await FacultyAssignment.findOne({
      facultyId,
      subjectId,
      sectionId,
      academicYear,
      semester,
      isActive: true,
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: "This faculty assignment already exists",
      });
    }

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
    let assignments;

    if (req.user.role === "FACULTY") {
      assignments = await FacultyAssignment.find({
        facultyId: req.user.userId,
        isActive: true,
      });
    } else if (req.user.role === "HOD") {
      const programs = await Program.find({
        departmentId: req.user.departmentId,
        isActive: true,
      }).select("_id");
      const subjects = await Subject.find({
        programId: { $in: programs.map((program) => program._id) },
        isActive: true,
      }).select("_id");

      assignments = await FacultyAssignment.find({
        subjectId: { $in: subjects.map((subject) => subject._id) },
        isActive: true,
      });
    } else {
      assignments = await FacultyAssignment.find({
        isActive: true,
      });
    }

    assignments = await FacultyAssignment.populate(assignments, [
      { path: "facultyId", select: "name email departmentId" },
      { path: "subjectId", select: "name code programId" },
      { path: "sectionId", select: "name programId semester academicYear" },
    ]);

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
