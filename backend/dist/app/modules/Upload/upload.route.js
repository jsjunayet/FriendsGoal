"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const os_1 = __importDefault(require("os"));
// On Vercel / serverless environments, the root directory (/var/task) is read-only.
// Writable temporary storage is only available under os.tmpdir() (/tmp).
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsDir = isServerless
    ? path_1.default.join(os_1.default.tmpdir(), "uploads")
    : path_1.default.join(process.cwd(), "uploads");
try {
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
}
catch (err) {
    console.warn("Notice: could not create uploads directory at module init:", err);
}
// Storage config
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        try {
            if (!fs_1.default.existsSync(uploadsDir)) {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
        }
        catch (_) { }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});
const router = (0, express_1.Router)();
// POST /api/v1/upload (Single or Multiple File Upload)
router.post("/", upload.array("images", 10), (0, catchAsync_1.default)(async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        // Check single file fallback
        const file = req.file;
        if (file) {
            const fileUrl = `/uploads/${file.filename}`;
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Image uploaded successfully",
                data: { url: fileUrl, urls: [fileUrl] },
            });
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "No files uploaded",
            data: null,
        });
    }
    const urls = files.map((file) => `/uploads/${file.filename}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Images uploaded successfully",
        data: { url: urls[0], urls },
    });
}));
exports.UploadRoutes = router;
//# sourceMappingURL=upload.route.js.map