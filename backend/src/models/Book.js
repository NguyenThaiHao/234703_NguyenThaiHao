const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: [true, "Ma sach la bat buoc"],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, "Ten sach la bat buoc"],
      trim: true
    },
    author: {
      type: String,
      required: [true, "Tac gia la bat buoc"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "The loai la bat buoc"],
      trim: true
    },
    publisher: {
      type: String,
      default: "",
      trim: true
    },
    publishYear: {
      type: Number,
      required: [true, "Nam xuat ban la bat buoc"],
      min: 0,
      max: 2100
    },
    isbn: {
      type: String,
      default: "",
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, "So luong la bat buoc"],
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "So luong phai la so nguyen"
      }
    },
    description: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true,
    collection: "books"
  }
);

module.exports = mongoose.model("Book", bookSchema);