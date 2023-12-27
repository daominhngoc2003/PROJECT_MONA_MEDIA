import express from "express";
import multer from "multer";
import {
  deleteImage,
  updateImage,
  uploadImage,
} from "../controllers/upload.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project_fruit",
    format: "jpg",
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage: storage });

router.post("/images/upload", upload.array("images", 10), uploadImage);
router.delete("/images/:publicId", deleteImage);
router.put("/images/:publicId", upload.array("images", 10), updateImage);

export default router;
