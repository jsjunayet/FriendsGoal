"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const index_1 = __importDefault(require("../config/index"));
cloudinary_1.v2.config({
    cloud_name: index_1.default.cloudinary_cloud_name,
    api_key: index_1.default.cloudinary_api_key,
    api_secret: index_1.default.cloudinary_api_secret,
});
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { public_id: imageName.trim() }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            fs_1.default.unlink(path, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("File is deleted.");
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const safeUploadsDir = isServerless
    ? path_1.default.join(os_1.default.tmpdir(), "uploads")
    : path_1.default.join(process.cwd(), "uploads");
try {
    if (!fs_1.default.existsSync(safeUploadsDir)) {
        fs_1.default.mkdirSync(safeUploadsDir, { recursive: true });
    }
}
catch (_) { }
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        try {
            if (!fs_1.default.existsSync(safeUploadsDir)) {
                fs_1.default.mkdirSync(safeUploadsDir, { recursive: true });
            }
        }
        catch (_) { }
        cb(null, safeUploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=sendImageToCloudinary.js.map