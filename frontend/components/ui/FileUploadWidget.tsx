"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FileUploadWidgetProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label?: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api/v1";

export function FileUploadWidget({
  images,
  onChange,
  multiple = true,
  label = "Upload Images (Drag & Drop or Click)",
}: FileUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      let token = null;
      try {
        token = sessionStorage.getItem("fg_access_token");
      } catch (e) { }

      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const uploadedUrls: string[] = Array.isArray(json.data?.urls)
          ? json.data.urls
          : json.data?.url
          ? [json.data.url]
          : typeof json.data === "string"
          ? [json.data]
          : [];

        if (uploadedUrls.length > 0) {
          if (multiple) {
            const combined = [...images.filter((img) => Boolean(img && img.trim())), ...uploadedUrls];
            onChange(combined);
          } else {
            onChange([uploadedUrls[0]]);
          }
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("No image URL returned from server.");
        }
      } else {
        toast.error(json.message || "Failed to upload images");
      }
    } catch (err: any) {
      toast.error(err.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const validImages = images.filter((img) => Boolean(img && img.trim()));

  return (
    <div className="space-y-3">
      {label && <label className="block text-xs font-bold uppercase text-gray-700">{label}</label>}

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2
          ${dragActive
            ? "border-[#00B074] bg-[#E8F8F5]"
            : "border-gray-200 bg-gray-50/80 hover:bg-gray-100/80 hover:border-[#00B074]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-[#00B074] animate-spin" />
            <p className="text-xs font-bold text-gray-600">Uploading file(s)...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[#E8F8F5] text-[#00B074] flex items-center justify-center shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">
                Drag & Drop photos here, or <span className="text-[#00B074]">Browse</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Supports PNG, JPG, WEBP (Max 10MB per file)</p>
            </div>
          </>
        )}
      </div>

      {/* Image Preview Grid */}
      {validImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {validImages.map((src, i) => (
            <div
              key={src + i}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group shadow-xs"
            >
              <Image src={src} alt={`Uploaded ${i + 1}`} fill sizes="140px" className="object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors z-10"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
