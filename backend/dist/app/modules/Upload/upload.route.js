"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = (0, express_1.Router)();
/**
 * GET or POST /api/v1/upload/signature
 * Returns signed signature and auth credentials so client can upload directly to Cloudinary.
 * Bypasses Vercel serverless 4.5MB payload limit completely!
 */
const handleSignatureRequest = (0, catchAsync_1.default)(async (req, res) => {
    const folder = req.query.folder || req.body?.folder || "friends_goal";
    const signatureData = (0, sendImageToCloudinary_1.generateCloudinarySignature)(folder);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
router.post("/", sendImageToCloudinary_1.uploadMemory.array("images", 10), (0, catchAsync_1.default)(async (req, res) => {
    const files = req.files;
    const singleFile = req.file;
    const filesToUpload = [];
    if (Array.isArray(files) && files.length > 0) {
        filesToUpload.push(...files);
    }
    else if (singleFile) {
        filesToUpload.push(singleFile);
    }
    if (filesToUpload.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "No image file provided for upload",
            data: null,
        });
    }
    // Upload each buffer directly to Cloudinary concurrently
    const uploadPromises = filesToUpload.map(async (file) => {
        const result = await (0, sendImageToCloudinary_1.uploadBufferToCloudinary)(file.buffer, {
            filename: file.originalname,
            folder: "friends_goal",
        });
        return result.secure_url;
    });
    const secureUrls = await Promise.all(uploadPromises);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: secureUrls.length === 1
            ? "Image uploaded successfully to cloud storage"
            : "Images uploaded successfully to cloud storage",
        data: {
            url: secureUrls[0],
            urls: secureUrls,
        },
    });
}));
exports.UploadRoutes = router;
//# sourceMappingURL=upload.route.js.map