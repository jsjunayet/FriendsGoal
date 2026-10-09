import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

import os from "os";

// On Vercel / serverless environments, the root directory (/var/task) is read-only.
// Writable temporary storage is only available under os.tmpdir() (/tmp).
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsDir = isServerless
  ? path.join(os.tmpdir(), "uploads")
  : path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn("Notice: could not create uploads directory at module init:", err);
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch (_) {}
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

const router = Router();

// POST /api/v1/upload (Single or Multiple File Upload)
router.post(
  "/",
  upload.array("images", 10),
  catchAsync(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      // Check single file fallback
      const file = req.file;
      if (file) {
        const fileUrl = `/uploads/${file.filename}`;
        return sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Image uploaded successfully",
          data: { url: fileUrl, urls: [fileUrl] },
        });
      }
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "No files uploaded",
        data: null,
      });
    }

    const urls = files.map((file) => `/uploads/${file.filename}`);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Images uploaded successfully",
      data: { url: urls[0], urls },
    });
  })
);

export const UploadRoutes = router;
