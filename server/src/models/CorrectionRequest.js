const mongoose = require("mongoose");

const correctionRequestSchema = new mongoose.Schema(
  {
    attendanceRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceRecord",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    oldStatus: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "EXCUSED"],
      required: true,
    },
    requestedStatus: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "EXCUSED"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewComment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CorrectionRequest", correctionRequestSchema);
