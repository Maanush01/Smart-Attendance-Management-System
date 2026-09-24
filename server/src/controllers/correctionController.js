const CorrectionRequest = require("../models/CorrectionRequest");
const AttendanceRecord = require("../models/AttendanceRecord");

const createCorrectionRequest = async (req, res) => {
  try {
    const { attendanceRecordId, reason, requestedStatus } = req.body;

    const record = await AttendanceRecord.findById(attendanceRecordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    const correction = await CorrectionRequest.create({
      attendanceRecordId,
      requestedBy: req.user.userId,
      reason,
      oldStatus: record.status,
      requestedStatus,
    });

    res.status(201).json({
      success: true,
      data: correction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCorrectionRequest,
};
