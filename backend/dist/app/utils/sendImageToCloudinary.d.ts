import type { UploadApiResponse } from "cloudinary";
import multer from "multer";
export declare const getCloudinaryCredentials: () => {
    cloud_name: string;
    api_key: string;
    api_secret: string;
};
/**
 * Generate a signed upload signature for direct client-to-Cloudinary uploads
 */
export declare const generateCloudinarySignature: (folder?: string) => {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
};
/**
 * Upload an in-memory buffer directly to Cloudinary without writing to disk
 */
export declare const uploadBufferToCloudinary: (buffer: Buffer, options?: {
    folder?: string;
    filename?: string;
    resource_type?: "image" | "auto" | "raw";
}) => Promise<UploadApiResponse>;
/**
 * Legacy file path upload method (preserved for backward-compatibility)
 */
export declare const sendImageToCloudinary: (imageName: string, path: string) => Promise<Record<string, unknown>>;
export declare const uploadMemory: multer.Multer;
export declare const upload: multer.Multer;
//# sourceMappingURL=sendImageToCloudinary.d.ts.map