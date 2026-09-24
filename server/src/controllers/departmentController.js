const Department = require("../models/Department");

const createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;

    const department = await Department.create({
      name,
      code,
    });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });

    res.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
};
