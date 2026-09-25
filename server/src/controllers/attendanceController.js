const AttendanceRecord = require("../models/AttendanceRecord");
const ClassSession = require("../models/ClassSession");
const FacultyAssignment = require("../models/FacultyAssignment");
const Student = require("../models/Student");
const Section = require("../models/Section");
const Program = require("../models/Program");

const markAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { attendance } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance must be a non-empty array",
      });
    }

    const validStatuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];
    if (attendance.some((record) => !validStatuses.includes(record.status))) {
      return res.status(400).json({
        success: false,
        message: "Attendance contains an invalid status",
      });
    }

    const session = await ClassSession.findById(sessionId).select(
      "sectionId subjectId facultyId status",
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Class session not found",
      });
    }

    if (session.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Attendance cannot be marked for a cancelled session",
      });
    }

    if (req.user.role === "FACULTY") {
      if (session.facultyId.toString() !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Faculty can only mark their assigned sessions",
        });
      }

      const assignment = await FacultyAssignment.findOne({
        facultyId: req.user.userId,
        subjectId: session.subjectId,
        sectionId: session.sectionId,
        isActive: true,
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: "An active faculty assignment is required",
        });
      }
    }

    const studentIds = attendance.map((record) => record.studentId);
    const uniqueStudentIds = new Set(studentIds.map((id) => id?.toString()));

    if (uniqueStudentIds.size !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: "Each student may appear only once per submission",
      });
    }

    const students = await Student.find({
      _id: { $in: studentIds },
      sectionId: session.sectionId,
      isActive: true,
    }).select("_id");

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "Every student must be active and belong to the session section",
      });
    }

    const existingRecords = await AttendanceRecord.find({
      sessionId,
      studentId: { $in: studentIds },
    }).select("studentId");

    if (existingRecords.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been recorded for one or more students",
      });
    }

    const records = await AttendanceRecord.insertMany(
      attendance.map((record) => ({
        sessionId,
        studentId: record.studentId,
        status: record.status,
        markedBy: req.user.userId,
      })),
    );

    res.status(201).json({
      success: true,
      data: records,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been recorded for one or more students",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save attendance",
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({
        userId: req.user.userId,
        isActive: true,
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student record not found",
        });
      }

      query.studentId = student._id;
    } else if (req.user.role === "FACULTY") {
      const sessions = await ClassSession.find({
        facultyId: req.user.userId,
      }).select("_id");
      query.sessionId = { $in: sessions.map((session) => session._id) };
    } else if (req.user.role === "HOD") {
      const programs = await Program.find({
        departmentId: req.user.departmentId,
        isActive: true,
      }).select("_id");
      const students = await Student.find({
        programId: { $in: programs.map((program) => program._id) },
      }).select("_id");
      query.studentId = { $in: students.map((student) => student._id) };
    }

    const records = await AttendanceRecord.find(query)
      .populate("studentId")
      .populate({
        path: "sessionId",
        populate: [
          { path: "subjectId", select: "name code" },
          { path: "sectionId", select: "name semester academicYear" },
        ],
      })
      .populate("markedBy", "name email");

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load attendance",
    });
  }
};

const getLowAttendance = async (req, res) => {
  try {
    const threshold = 75;
    const activeSections = await Section.find({ isActive: true }).select("_id");
    const activeStudents = await Student.find({
      isActive: true,
      sectionId: { $in: activeSections.map((section) => section._id) },
    }).select("_id");
    const activeSessions = await ClassSession.find({
      sectionId: { $in: activeSections.map((section) => section._id) },
      status: { $ne: "CANCELLED" },
    }).select("_id");

    const records = await AttendanceRecord.find({
      studentId: { $in: activeStudents.map((student) => student._id) },
      sessionId: { $in: activeSessions.map((session) => session._id) },
    })
      .populate({
        path: "studentId",
        populate: [
          { path: "userId", select: "name email" },
          { path: "programId", select: "departmentId" },
        ],
      })
      .populate({
        path: "sessionId",
        select: "facultyId sectionId subjectId date",
        populate: [
          { path: "subjectId", select: "name code" },
          { path: "sectionId", select: "name semester academicYear" },
        ],
      });

    const scopedRecords = records.filter((record) => {
      if (!record.studentId || !record.sessionId) return false;

      if (req.user.role === "FACULTY") {
        return (
          record.sessionId.facultyId?.toString() === req.user.userId.toString()
        );
      }

      if (req.user.role === "HOD") {
        return (
          record.studentId.programId?.departmentId?.toString() ===
          req.user.departmentId?.toString()
        );
      }

      return true;
    });

    const studentStats = {};

    scopedRecords.forEach((record) => {
      const studentId = record.studentId._id.toString();

      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.studentId,
          total: 0,
          present: 0,
        };
      }

      studentStats[studentId].total += 1;

      if (record.status === "PRESENT") {
        studentStats[studentId].present += 1;
      }
    });

    const lowAttendance = Object.values(studentStats)
      .map((item) => ({
        ...item,
        percentage: item.total === 0 ? 0 : (item.present / item.total) * 100,
      }))
      .filter((item) => item.percentage < threshold);

    res.json({
      success: true,
      threshold,
      data: lowAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load low-attendance report",
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getLowAttendance,
};
