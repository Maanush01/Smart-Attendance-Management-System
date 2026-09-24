const AttendanceRecord = require("../models/AttendanceRecord");

const markAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { attendance } = req.body;

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    let records;

    if (req.user.role === "STUDENT") {
      const Student = require("../models/Student");

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

      records = await AttendanceRecord.find({
        studentId: student._id,
      })
        .populate("studentId")
        .populate({
          path: "sessionId",
          populate: {
            path: "subjectId",
            select: "name code",
          },
        })
        .populate("markedBy", "name email");
    } else if (req.user.role === "FACULTY") {
      records = await AttendanceRecord.find({
        markedBy: req.user.userId,
      })
        .populate("studentId")
        .populate({
          path: "sessionId",
          populate: {
            path: "subjectId",
            select: "name code",
          },
        })
        .populate("markedBy", "name email");
    } else {
      records = await AttendanceRecord.find()
        .populate("studentId")
        .populate({
          path: "sessionId",
          populate: {
            path: "subjectId",
            select: "name code",
          },
        })
        .populate("markedBy", "name email");
    }

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLowAttendance = async (req, res) => {
  try {
    const threshold = 75;

    let records = await AttendanceRecord.find()
      .populate({
        path: "studentId",
        populate: {
          path: "programId",
          select: "departmentId",
        },
      })
      .populate({
        path: "sessionId",
        populate: {
          path: "subjectId",
          select: "name code",
        },
      });

    if (req.user.role === "HOD") {
      records = records.filter(
        (record) =>
          record.studentId?.programId?.departmentId?.toString() ===
          req.user.departmentId?.toString(),
      );
    }

    const studentStats = {};

    records.forEach((record) => {
      const studentId = record.studentId._id.toString();

      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.studentId,
          total: 0,
          present: 0,
        };
      }

      studentStats[studentId].total++;

      if (record.status === "PRESENT" || record.status === "LATE") {
        studentStats[studentId].present++;
      }
    });

    const lowAttendance = Object.values(studentStats)
      .map((item) => ({
        ...item,
        percentage: (item.present / item.total) * 100,
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
      message: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getLowAttendance,
};
