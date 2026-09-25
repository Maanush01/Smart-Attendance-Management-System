const ClassSession = require("../models/ClassSession");
const FacultyAssignment = require("../models/FacultyAssignment");
const User = require("../models/User");
const Section = require("../models/Section");
const Subject = require("../models/Subject");

const createSession = async (req, res) => {
  try {
    const { sectionId, subjectId, facultyId, date, startTime, endTime } =
      req.body;

    if (
      !sectionId ||
      !subjectId ||
      !facultyId ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Section, subject, faculty, date, start time, and end time are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be later than start time",
      });
    }

    const [faculty, section, subject] = await Promise.all([
      User.findOne({ _id: facultyId, role: "FACULTY", isActive: true }),
      Section.findOne({ _id: sectionId, isActive: true }),
      Subject.findOne({ _id: subjectId, isActive: true }),
    ]);

    if (!faculty || !section || !subject) {
      return res.status(400).json({
        success: false,
        message: "Faculty, section, or subject is invalid or inactive",
      });
    }

    if (
      req.user.role === "FACULTY" &&
      facultyId.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Faculty can only create their own sessions",
      });
    }

    const assignment = await FacultyAssignment.findOne({
      facultyId,
      subjectId,
      sectionId,
      semester: section.semester,
      academicYear: section.academicYear,
      isActive: true,
    });

    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: "An active faculty assignment is required for this session",
      });
    }

    const session = await ClassSession.create({
      sectionId,
      subjectId,
      facultyId,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSessions = async (req, res) => {
  try {
    let sessions;

    if (req.user.role === "FACULTY") {
      sessions = await ClassSession.find({ facultyId: req.user.userId });
    } else if (req.user.role === "HOD") {
      const faculty = await User.find({
        role: "FACULTY",
        departmentId: req.user.departmentId,
        isActive: true,
      }).select("_id");
      sessions = await ClassSession.find({
        facultyId: { $in: faculty.map((member) => member._id) },
      });
    } else {
      sessions = await ClassSession.find();
    }

    sessions = await ClassSession.populate(sessions, [
      { path: "subjectId", select: "name code programId" },
      { path: "sectionId", select: "name programId semester academicYear" },
      { path: "facultyId", select: "name email departmentId" },
    ]);

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSessions,
};
