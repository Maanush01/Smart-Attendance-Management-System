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
    const records = await AttendanceRecord.find()
      .populate("studentId")
      .populate("sessionId")
      .populate("markedBy", "name email");

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

    const records = await AttendanceRecord.find()
      .populate("studentId")
      .populate("sessionId");

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
