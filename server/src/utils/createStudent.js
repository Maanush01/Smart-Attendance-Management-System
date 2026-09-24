require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createStudent = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash("Student@123", 10);

  const user = await User.create({
    name: "Test Student",
    email: "student@attendance.com",
    passwordHash,
    role: "STUDENT",
  });

  console.log("Student user created:", user._id);

  process.exit();
};

createStudent();
