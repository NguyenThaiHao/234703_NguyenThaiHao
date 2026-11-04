const express = require("express");
const mongoose = require("mongoose");
const Device = require("../models/Device");

const router = express.Router();
const requiredFields = ["deviceId", "name", "deviceType", "room", "quantity", "status"];

function validateDevice(data) {
  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {
      return `Truong ${field} la bat buoc`;
    }
  }

  if (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 0) {
    return "So luong phai la so nguyen khong am";
  }

  return null;
}

function getFilter(id) {
  return mongoose.isValidObjectId(id) ? { _id: id } : { deviceId: id };
}

router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = search
      ? {
          $or: ["deviceId", "name", "deviceType", "room", "brand", "model"].map(
            (field) => ({
              [field]: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
            })
          )
        }
      : {};
    const devices = await Device.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: devices.length, data: devices });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const device = await Device.findOne(getFilter(req.params.id));
    if (!device) {
      return res.status(404).json({ success: false, message: "Khong tim thay thiet bi" });
    }
    res.json({ success: true, data: device });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const errorMessage = validateDevice(req.body);
    if (errorMessage) {
      return res.status(400).json({ success: false, message: errorMessage });
    }
    const device = await Device.create(req.body);
    res.status(201).json({ success: true, message: "Them thiet bi thanh cong", data: device });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Ma thiet bi deviceId da ton tai" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const errorMessage = validateDevice(req.body);
    if (errorMessage) {
      return res.status(400).json({ success: false, message: errorMessage });
    }
    const device = await Device.findOneAndUpdate(getFilter(req.params.id), req.body, {
      new: true,
      runValidators: true
    });
    if (!device) {
      return res.status(404).json({ success: false, message: "Khong tim thay thiet bi" });
    }
    res.json({ success: true, message: "Cap nhat thiet bi thanh cong", data: device });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Ma thiet bi deviceId da ton tai" });
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const device = await Device.findOneAndDelete(getFilter(req.params.id));
    if (!device) {
      return res.status(404).json({ success: false, message: "Khong tim thay thiet bi" });
    }
    res.json({ success: true, message: "Xoa thiet bi thanh cong", data: device });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
