const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "OPEN", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true },
);

classSessionSchema.index({ facultyId: 1, date: 1 });
classSessionSchema.index({ sectionId: 1, date: 1 });

module.exports = mongoose.model("ClassSession", classSessionSchema);
