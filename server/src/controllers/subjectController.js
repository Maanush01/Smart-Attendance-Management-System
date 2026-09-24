const Subject = require("../models/Subject");

const getSubjects = async (req, res) => {
  try {
    let subjects;

    if (req.user.role === "HOD") {
      const Program = require("../models/Program");

      const programs = await Program.find({
        departmentId: req.user.departmentId,
        isActive: true,
      }).select("_id");

      const programIds = programs.map((program) => program._id);

      subjects = await Subject.find({
        programId: { $in: programIds },
        isActive: true,
      }).populate("programId", "name code");
    } else {
      subjects = await Subject.find({
        isActive: true,
      }).populate("programId", "name code");
    }

    res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSubjects,
  createSubject,
};
