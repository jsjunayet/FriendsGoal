"use client";

export interface ICloudinarySignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

/**
 * Fetch a cryptographically signed signature from the server to authorize direct client uploads
 */
export async function getUploadSignature(folder: string = "friends_goal"): Promise<ICloudinarySignature> {
  let token: string | null = null;
  try {
    token =
      sessionStorage.getItem("fg_access_token") ||
      localStorage.getItem("fg_access_token");
  } catch (_) {}

  // 1. Try Backend signature endpoint
  try {
    const res = await fetch(`${BASE_URL}/upload/signature?folder=${encodeURIComponent(folder)}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.signature) {
        return json.data as ICloudinarySignature;
      }
    }
  } catch (err) {
    console.warn("Backend signature endpoint unavailable, attempting Next.js local signature route:", err);
  }

  // 2. Fallback to Next.js route /api/upload/sign
  try {
    const localRes = await fetch(`/api/upload/sign?folder=${encodeURIComponent(folder)}`);
    if (localRes.ok) {
      const localJson = await localRes.json();
      if (localJson.success && localJson.data?.signature) {
        return localJson.data as ICloudinarySignature;
      }
    }
  } catch (err) {
    console.warn("Next.js local signature endpoint unavailable:", err);
  }

  throw new Error("Unable to obtain upload signature from backend or local API route.");
}

/**
 * Upload directly from the browser to Cloudinary CDN
 * Bypasses Vercel Serverless Function 4.5MB request payload limits!
 */
export async function uploadDirectToCloudinary(
  fileOrBlob: File | Blob,
  signatureData: ICloudinarySignature,
  filename?: string
): Promise<string> {
  const uploadFormData = new FormData();

  const fileToUpload =
    fileOrBlob instanceof File
      ? fileOrBlob
      : new File([fileOrBlob], filename || `canvas-signature-${Date.now()}.png`, {
          type: fileOrBlob.type || "image/png",
        });

  uploadFormData.append("file", fileToUpload);
  uploadFormData.append("api_key", signatureData.apiKey);
  uploadFormData.append("timestamp", String(signatureData.timestamp));
  uploadFormData.append("signature", signatureData.signature);
  uploadFormData.append("folder", signatureData.folder);

  const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;

  const response = await fetch(cloudinaryEndpoint, {
    method: "POST",
    body: uploadFormData,
  });

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Failed to upload image directly to Cloudinary");
  }

  return data.secure_url as string;
}

/**
 * Fallback to server-side buffer streaming upload in case direct CORS/CDN upload fails
 */
export async function uploadViaBackendFallback(fileOrBlob: File | Blob, filename?: string): Promise<string> {
  let token: string | null = null;
  try {
    token =
      sessionStorage.getItem("fg_access_token") ||
      localStorage.getItem("fg_access_token");
  } catch (_) {}

  const formData = new FormData();
  const fileToUpload =
    fileOrBlob instanceof File
      ? fileOrBlob
      : new File([fileOrBlob], filename || `upload-${Date.now()}.png`, {
          type: fileOrBlob.type || "image/png",
        });

  formData.append("images", fileToUpload);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await res.json();
  if (res.ok && json.success) {
    const url = json.data?.url || (json.data?.urls && json.data.urls[0]);
    if (url) return url;
  }

  throw new Error(json.message || "Failed to upload image via server fallback");
}

/**
 * Master image upload pipeline:
 * Direct-to-Cloudinary (Client-Side) -> Server In-Memory Cloudinary Fallback -> Permanent Secure URL
 */
export async function uploadImageToCloud(
  fileOrBlob: File | Blob,
  options: {
    folder?: string;
    filename?: string;
  } = {}
): Promise<string> {
  const folder = options.folder || "friends_goal";

  try {
    // 1. Fetch pre-signed signature
    const signature = await getUploadSignature(folder);
    // 2. Direct upload to Cloudinary
    return await uploadDirectToCloudinary(fileOrBlob, signature, options.filename);
  } catch (directErr: any) {
    console.warn("Direct Cloudinary upload encountered issue, falling back to server buffer:", directErr?.message || directErr);
    // 3. Fallback to server-side in-memory streaming
    return await uploadViaBackendFallback(fileOrBlob, options.filename);
  }
}

/**
 * Concurrently upload multiple images
 */
export async function uploadMultipleImagesToCloud(
  files: (File | Blob)[],
  options: { folder?: string } = {}
): Promise<string[]> {
  const uploadPromises = Array.from(files).map((f) => uploadImageToCloud(f, options));
  return Promise.all(uploadPromises);
}
