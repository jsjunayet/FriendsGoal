import type { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import config from "../config/index";

export const getCloudinaryCredentials = () => {
  const isProd = process.env.NODE_ENV === "production";
  const cloudinaryUrl = isProd
    ? (process.env.CLOUDINARY_URL_PROD || process.env.CLOUDINARY_URL || process.env.CLOUDINARY_URL_DEV)
    : (process.env.CLOUDINARY_URL_DEV || process.env.CLOUDINARY_URL || process.env.CLOUDINARY_URL_PROD);

  let cloud_name = config.cloudinary_cloud_name || process.env.CLOUDINARY_CLOUD_NAME;
  let api_key = config.cloudinary_api_key || process.env.CLOUDINARY_API_KEY;
  let api_secret = config.cloudinary_api_secret || process.env.CLOUDINARY_API_SECRET;

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

const creds = getCloudinaryCredentials();
cloudinary.config({
  cloud_name: creds.cloud_name,
  api_key: creds.api_key,
  api_secret: creds.api_secret,
  secure: true,
} as any);

/**
 * Generate a signed upload signature for direct client-to-Cloudinary uploads
 */
export const generateCloudinarySignature = (folder: string = "friends_goal") => {
  const activeCreds = getCloudinaryCredentials();
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign: Record<string, any> = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    activeCreds.api_secret
  );

  return {
    signature,
    timestamp,
    apiKey: activeCreds.api_key,
    cloudName: activeCreds.cloud_name,
    folder,
  };
};

/**
 * Upload an in-memory buffer directly to Cloudinary without writing to disk
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: {
    folder?: string;
    filename?: string;
    resource_type?: "image" | "auto" | "raw";
  } = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const activeCreds = getCloudinaryCredentials();
    cloudinary.config({
      cloud_name: activeCreds.cloud_name,
      api_key: activeCreds.api_key,
      api_secret: activeCreds.api_secret,
      secure: true,
    } as any);

    const folder = options.folder || "friends_goal";
    const uploadOptions: Record<string, any> = {
      folder,
      resource_type: options.resource_type || "auto",
    };
    if (options.filename) {
      uploadOptions.public_id =
        options.filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_") + "-" + Date.now();
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Empty response from Cloudinary upload stream"));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Legacy file path upload method (preserved for backward-compatibility)
 */
export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    const activeCreds = getCloudinaryCredentials();
    cloudinary.config({
      cloud_name: activeCreds.cloud_name,
      api_key: activeCreds.api_key,
      api_secret: activeCreds.api_secret,
      secure: true,
    } as any);

    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim(), folder: "friends_goal" },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        if (fs.existsSync(path)) {
          fs.unlink(path, (err) => {
            if (err) console.error("Error deleting local temp file:", err);
          });
        }
      },
    );
  });
};

// Memory storage for serverless-safe in-memory processing
const memoryStorage = multer.memoryStorage();

export const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export const upload = uploadMemory;
