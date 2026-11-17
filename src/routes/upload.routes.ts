import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller";

const router = Router();

// use memory storage for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// route to upload image
router.post("/", upload.single("image"), uploadImage);

export default router;