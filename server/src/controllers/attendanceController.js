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

module.exports = {
  markAttendance,
};
