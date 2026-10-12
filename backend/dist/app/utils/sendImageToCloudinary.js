"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadMemory = exports.sendImageToCloudinary = exports.uploadBufferToCloudinary = exports.generateCloudinarySignature = exports.getCloudinaryCredentials = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const index_1 = __importDefault(require("../config/index"));
const getCloudinaryCredentials = () => {
    const isProd = process.env.NODE_ENV === "production";
    const cloudinaryUrl = isProd
        ? (process.env.CLOUDINARY_URL_PROD || process.env.CLOUDINARY_URL || process.env.CLOUDINARY_URL_DEV)
        : (process.env.CLOUDINARY_URL_DEV || process.env.CLOUDINARY_URL || process.env.CLOUDINARY_URL_PROD);
    let cloud_name = index_1.default.cloudinary_cloud_name || process.env.CLOUDINARY_CLOUD_NAME;
    let api_key = index_1.default.cloudinary_api_key || process.env.CLOUDINARY_API_KEY;
    let api_secret = index_1.default.cloudinary_api_secret || process.env.CLOUDINARY_API_SECRET;
    if (cloudinaryUrl) {
        const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)/);
        if (match) {
            api_key = match[1];
            api_secret = match[2];
            cloud_name = match[3];
        }
    }
    return {
        cloud_name: cloud_name || "dzxzxdsnq",
        api_key: api_key || "347973325524831",
        api_secret: api_secret || "oVX0wOsaxLNjEsFG0b7at_kOM6U",
    };
};
exports.getCloudinaryCredentials = getCloudinaryCredentials;
const creds = (0, exports.getCloudinaryCredentials)();
cloudinary_1.v2.config({
    cloud_name: creds.cloud_name,
    api_key: creds.api_key,
    api_secret: creds.api_secret,
    secure: true,
});
/**
 * Generate a signed upload signature for direct client-to-Cloudinary uploads
 */
const generateCloudinarySignature = (folder = "friends_goal") => {
    const activeCreds = (0, exports.getCloudinaryCredentials)();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
        folder,
        timestamp,
    };
    const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, activeCreds.api_secret);
    return {
        signature,
        timestamp,
        apiKey: activeCreds.api_key,
        cloudName: activeCreds.cloud_name,
        folder,
    };
};
exports.generateCloudinarySignature = generateCloudinarySignature;
/**
 * Upload an in-memory buffer directly to Cloudinary without writing to disk
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const activeCreds = (0, exports.getCloudinaryCredentials)();
        cloudinary_1.v2.config({
            cloud_name: activeCreds.cloud_name,
            api_key: activeCreds.api_key,
            api_secret: activeCreds.api_secret,
            secure: true,
        });
        const folder = options.folder || "friends_goal";
        const uploadOptions = {
            folder,
            resource_type: options.resource_type || "auto",
        };
        if (options.filename) {
            uploadOptions.public_id =
                options.filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_") + "-" + Date.now();
        }
        const uploadStream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Empty response from Cloudinary upload stream"));
            }
            resolve(result);
        });
        uploadStream.end(buffer);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
/**
 * Legacy file path upload method (preserved for backward-compatibility)
 */
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        const activeCreds = (0, exports.getCloudinaryCredentials)();
        cloudinary_1.v2.config({
            cloud_name: activeCreds.cloud_name,
            api_key: activeCreds.api_key,
            api_secret: activeCreds.api_secret,
            secure: true,
        });
        cloudinary_1.v2.uploader.upload(path, { public_id: imageName.trim(), folder: "friends_goal" }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            if (fs_1.default.existsSync(path)) {
                fs_1.default.unlink(path, (err) => {
                    if (err)
                        console.error("Error deleting local temp file:", err);
                });
            }
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
// Memory storage for serverless-safe in-memory processing
const memoryStorage = multer_1.default.memoryStorage();
exports.uploadMemory = (0, multer_1.default)({
    storage: memoryStorage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});
exports.upload = exports.uploadMemory;
//# sourceMappingURL=sendImageToCloudinary.js.map