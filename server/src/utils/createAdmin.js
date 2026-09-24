require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await User.create({
    name: "System Admin",
    email: "admin@attendance.com",
    passwordHash,
    role: "ADMIN",
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
