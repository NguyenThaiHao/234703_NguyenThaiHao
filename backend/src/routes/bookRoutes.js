const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();

function validateBook(data) {
  const requiredFields = [
    "bookId",
    "title",
    "author",
    "category",
    "publishYear",
    "quantity"
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {
      return `Truong ${field} la bat buoc`;
    }
  }

  if (
    !Number.isInteger(Number(data.publishYear)) ||
    Number(data.publishYear) < 0 ||
    Number(data.publishYear) > 2100
  ) {
    return "Nam xuat ban khong hop le";
  }

  if (
    !Number.isInteger(Number(data.quantity)) ||
    Number(data.quantity) < 0
  ) {
    return "So luong phai la so nguyen khong am";
  }

  return null;
}

// GET /api/books?search=cloud
router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    let filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safeSearch, "i");

      filter = {
        $or: [
          { title: regex },
          { author: regex },
          { category: regex }
        ]
      };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/books/:id
router.get("/:id", async (req, res, next) => {
  try {
    const book = mongoose.isValidObjectId(req.params.id)
      ? await Book.findById(req.params.id)
      : await Book.findOne({ bookId: req.params.id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay sach"
      });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
});

// POST /api/books
router.post("/", async (req, res, next) => {
  try {
    const errorMessage = validateBook(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: "Them sach thanh cong",
      data: book
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Ma sach bookId da ton tai"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

// PUT /api/books/:id
router.put("/:id", async (req, res, next) => {
  try {
    const errorMessage = validateBook(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const filter = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { bookId: req.params.id };

    const book = await Book.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay sach"
      });
    }

    res.json({
      success: true,
      message: "Cap nhat sach thanh cong",
      data: book
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Ma sach bookId da ton tai"
      });
    }

    next(error);
  }
});

// DELETE /api/books/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const filter = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { bookId: req.params.id };

    const book = await Book.findOneAndDelete(filter);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Khong tim thay sach"
      });
    }

    res.json({
      success: true,
      message: "Xoa sach thanh cong",
      data: book
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
