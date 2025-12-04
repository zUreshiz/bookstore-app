import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookstore",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "epub"],
  },
});

const upload = multer({ storage });

router.post("/", upload.single("coverImage"), (req, res) => {
  try {
    console.log(req.file); // xem file nhận được
    res.json({ success: true, url: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "hehe", error: err.message });
  }
});
export default router;
