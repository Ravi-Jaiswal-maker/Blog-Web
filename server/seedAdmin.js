const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const email = "rjravi7408563153@gmail.com";
    const password = "Ravi@123";

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      console.log("❌ Admin already exists");
    } else {
      await Admin.create({ email, password });
      console.log("✅ Admin seeded successfully");
      console.log(`➡️  Email: ${email}`);
      console.log(`➡️  Password: ${password}`);
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
