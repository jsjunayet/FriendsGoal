import { Router } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import {
  uploadMemory,
  uploadBufferToCloudinary,
  generateCloudinarySignature,
} from "../../utils/sendImageToCloudinary";

const router = Router();

/**
 * GET or POST /api/v1/upload/signature
 * Returns signed signature and auth credentials so client can upload directly to Cloudinary.
 * Bypasses Vercel serverless 4.5MB payload limit completely!
 */
const handleSignatureRequest = catchAsync(async (req, res) => {
  const folder = (req.query.folder as string) || (req.body?.folder as string) || "friends_goal";
  const signatureData = generateCloudinarySignature(folder);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cloudinary upload signature generated successfully",
    data: signatureData,
  });
});

router.get("/signature", handleSignatureRequest);
router.post("/signature", handleSignatureRequest);

/**
 * POST /api/v1/upload
 * Server-side fallback upload using in-memory streams directly to Cloudinary.
 * Does NOT write any files to local/serverless disk (/public/uploads or /tmp/uploads).
 * Returns permanent Cloudinary public secure_urls.
 */
router.post(
  "/",
  uploadMemory.array("images", 10),
  catchAsync(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    const singleFile = req.file as Express.Multer.File | undefined;

    const filesToUpload: Express.Multer.File[] = [];
    if (Array.isArray(files) && files.length > 0) {
      filesToUpload.push(...files);
    } else if (singleFile) {
      filesToUpload.push(singleFile);
    }

    if (filesToUpload.length === 0) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "No image file provided for upload",
        data: null,
      });
    }

    // Upload each buffer directly to Cloudinary concurrently
    const uploadPromises = filesToUpload.map(async (file) => {
      const result = await uploadBufferToCloudinary(file.buffer, {
        filename: file.originalname,
        folder: "friends_goal",
      });
      return result.secure_url;
    });

    const secureUrls = await Promise.all(uploadPromises);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        secureUrls.length === 1
          ? "Image uploaded successfully to cloud storage"
          : "Images uploaded successfully to cloud storage",
      data: {
        url: secureUrls[0],
        urls: secureUrls,
      },
    });
  })
);

export const UploadRoutes = router;
