const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Chua cau hinh bien MONGODB_URI trong file .env");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log("MongoDB Atlas connected successfully");
}

module.exports = connectDB;