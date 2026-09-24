require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createFaculty = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash("Faculty@123", 10);

  const user = await User.create({
    name: "Test Faculty",
    email: "faculty@attendance.com",
    passwordHash,
    role: "FACULTY",
  });

  console.log("Faculty user created:", user._id);

  process.exit();
};

createFaculty();
