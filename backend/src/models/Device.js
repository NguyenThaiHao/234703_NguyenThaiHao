const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, "Ma thiet bi la bat buoc"],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Ten thiet bi la bat buoc"],
      trim: true
    },
    deviceType: {
      type: String,
      required: [true, "Loai thiet bi la bat buoc"],
      trim: true
    },
    room: {
      type: String,
      required: [true, "Phong hoc la bat buoc"],
      trim: true
    },
    brand: { type: String, default: "", trim: true },
    model: { type: String, default: "", trim: true },
    quantity: {
      type: Number,
      required: [true, "So luong la bat buoc"],
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "So luong phai la so nguyen"
      }
    },
    status: {
      type: String,
      enum: ["Dang su dung", "Hu hong", "Dang sua chua", "Ngung su dung"],
      required: [true, "Tinh trang la bat buoc"]
    },
    purchaseDate: { type: Date, default: null },
    description: { type: String, default: "", trim: true }
  },
  { timestamps: true, collection: "devices" }
);

module.exports = mongoose.model("Device", deviceSchema);
