require("dotenv").config();

// Cấu hình DNS để khắc phục lỗi MongoDB Atlas querySrv ECONNREFUSED
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
      : true
  })
);

app.use(express.json({ limit: "1mb" }));

// API kiểm tra trạng thái Backend
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    database: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected"
  });
});

// API quản lý sách
app.use("/api/books", bookRoutes);

// Xử lý endpoint không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint khong ton tai"
  });
});

// Xử lý lỗi hệ thống
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "Loi may chu hoac ket noi co so du lieu"
  });
});

const PORT = process.env.PORT || 5000;

// Khởi động Backend
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend dang chay tai cong ${PORT}`);
    });
  } catch (error) {
    console.error("Khong the khoi dong backend:", error.message);
    process.exit(1);
  }
}

startServer();