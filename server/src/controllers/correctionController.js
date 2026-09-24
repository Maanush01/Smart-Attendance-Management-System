const AuditLog = require("../models/AuditLog");
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

const reviewCorrectionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewComment } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status",
      });
    }

    const correction = await CorrectionRequest.findById(id);

    if (!correction) {
      return res.status(404).json({
        success: false,
        message: "Correction request not found",
      });
    }

    correction.status = status;
    correction.reviewedBy = req.user.userId;
    correction.reviewedAt = new Date();
    correction.reviewComment = reviewComment || "";

    if (status === "APPROVED") {
      await AttendanceRecord.findByIdAndUpdate(correction.attendanceRecordId, {
        status: correction.requestedStatus,
        markedBy: req.user.userId,
      });
    }

    await correction.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: `CORRECTION_${status}`,
      entityType: "CorrectionRequest",
      entityId: correction._id,
      oldValue: {
        status: "PENDING",
      },
      newValue: {
        status: correction.status,
        attendanceStatus: correction.requestedStatus,
      },
    });

    res.json({
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
  reviewCorrectionRequest,
};
