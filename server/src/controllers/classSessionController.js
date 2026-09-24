const ClassSession = require("../models/ClassSession");

const createSession = async (req, res) => {
  try {
    const { sectionId, subjectId, facultyId, date, startTime, endTime } =
      req.body;

    const session = await ClassSession.create({
      sectionId,
      subjectId,
      facultyId,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await ClassSession.find();

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSessions,
};
