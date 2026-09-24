const AuditLog = require("../models/AuditLog");
const CorrectionRequest = require("../models/CorrectionRequest");
const AttendanceRecord = require("../models/AttendanceRecord");

const createCorrectionRequest = async (req, res) => {
  try {
    const { attendanceRecordId, reason, requestedStatus } = req.body;

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

    const record = await AttendanceRecord.findOne({
      _id: attendanceRecordId,
      studentId: student._id,
    });

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

    const correction = await CorrectionRequest.findById(id).populate({
      path: "attendanceRecordId",
      populate: {
        path: "studentId",
        populate: {
          path: "programId",
          select: "departmentId",
        },
      },
    });

    if (
      req.user.role === "HOD" &&
      correction.attendanceRecordId?.studentId?.programId?.departmentId?.toString() !==
        req.user.departmentId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this correction request",
      });
    }

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
      await AttendanceRecord.findByIdAndUpdate(
        correction.attendanceRecordId._id,
        {
          status: correction.requestedStatus,
          markedBy: req.user.userId,
        },
      );
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

const getCorrectionRequests = async (req, res) => {
  try {
    let requests = await CorrectionRequest.find()
      .populate("requestedBy", "name email")
      .populate("reviewedBy", "name email")
      .populate({
        path: "attendanceRecordId",
        populate: {
          path: "studentId",
          populate: {
            path: "programId",
            select: "departmentId",
          },
        },
      });

    if (req.user.role === "STUDENT") {
      requests = requests.filter(
        (request) =>
          request.requestedBy?._id.toString() === req.user.userId.toString(),
      );
    }

    if (req.user.role === "HOD") {
      requests = requests.filter(
        (request) =>
          request.attendanceRecordId?.studentId?.programId?.departmentId?.toString() ===
          req.user.departmentId?.toString(),
      );
    }

    res.json({
      success: true,
      data: requests,
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
  getCorrectionRequests,
};
