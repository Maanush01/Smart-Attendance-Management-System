const Section = require("../models/Section");

const createSection = async (req, res) => {
  try {
    const { name, programId, batchYear, semester, academicYear } = req.body;

    const section = await Section.create({
      name,
      programId,
      batchYear,
      semester,
      academicYear,
    });

    res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSections = async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true });

    res.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSection,
  getSections,
};
