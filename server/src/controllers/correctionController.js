const mongoose = require("mongoose");
const AuditLog = require("../models/AuditLog");
const CorrectionRequest = require("../models/CorrectionRequest");
const AttendanceRecord = require("../models/AttendanceRecord");

const createCorrectionRequest = async (req, res) => {
  try {
    const { attendanceRecordId, reason, requestedStatus } = req.body;

    if (!mongoose.isValidObjectId(attendanceRecordId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance record id",
      });
    }

    if (!attendanceRecordId || !reason?.trim() || !requestedStatus) {
      return res.status(400).json({
        success: false,
        message: "Attendance record, reason, and requested status are required",
      });
    }

    if (!["PRESENT", "ABSENT", "LATE", "EXCUSED"].includes(requestedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requested attendance status",
      });
    }

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

    const existingPendingRequest = await CorrectionRequest.findOne({
      attendanceRecordId,
      requestedBy: req.user.userId,
      status: "PENDING",
    });

    if (existingPendingRequest) {
      return res.status(409).json({
        success: false,
        message: "A correction request is already pending for this record",
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
  const dbSession = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { status, reviewComment } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status",
      });
    }

    await dbSession.startTransaction();

    const correction = await CorrectionRequest.findOne({
      _id: id,
      status: "PENDING",
    })
      .session(dbSession)
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

    if (!correction) {
      await dbSession.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Pending correction request not found",
      });
    }

    if (!correction.attendanceRecordId) {
      await dbSession.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Attendance record for this correction was not found",
      });
    }

    if (
      req.user.role === "HOD" &&
      correction.attendanceRecordId?.studentId?.programId?.departmentId?.toString() !==
        req.user.departmentId?.toString()
    ) {
      await dbSession.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this correction request",
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
          markedAt: new Date(),
        },
        { session: dbSession },
      );
    }

    await correction.save({ session: dbSession });

    await AuditLog.create(
      [
        {
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
        },
      ],
      { session: dbSession },
    );

    await dbSession.commitTransaction();

    res.json({
      success: true,
      data: correction,
    });
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }
    res.status(500).json({
      success: false,
      message: "Failed to review correction request",
    });
  } finally {
    await dbSession.endSession();
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
