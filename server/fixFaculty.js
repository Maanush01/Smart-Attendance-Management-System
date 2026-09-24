require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

async function fixFaculty() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.updateOne(
      { email: "faculty@attendance.com" },
      {
        $set: {
          departmentId: new mongoose.Types.ObjectId("6ab57911d750cc7a2f83aeb4"),
        },
      },
    );

    console.log("Faculty department fixed.");

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

fixFaculty();
