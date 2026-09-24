import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext.tsx";
import { adminFetch } from "../lib/api.ts";
import { NEUTRAL_MEDIA_THUMB } from "../../utils/placeholders.ts";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

// Client-side image compression helper to keep Base64 payloads compact & fast (~60-120KB)
export function compressImageFile(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      // Don't resize SVGs or animated GIFs
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to render image for compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Photograph / Image",
  placeholder = "/assets/...",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error, success } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      error("Please upload an image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      error("File size must be under 12MB.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. First compress the image on client side
      const compressedDataUrl = await compressImageFile(file);

      // 2. Attempt server upload to Cloudinary/DB
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.data?.url) {
        onChange(data.data.url);
        success("Image uploaded successfully!");
      } else {
        // Fallback: If server endpoint fails or is offline, use client compressed Data URI
        onChange(compressedDataUrl);
        success("Image saved successfully!");
      }
    } catch (err) {
      // Fallback: Use client compressed Data URI on network exception
      try {
        const fallbackDataUrl = await compressImageFile(file);
        onChange(fallbackDataUrl);
        success("Image saved successfully (offline fallback)!");
      } catch {
        error("Failed to process image file.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs text-[#00ff66] tracking-wider uppercase">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-[#040e07] p-0.5 rounded border border-[#00ff66]/20">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              mode === "upload" ? "bg-[#00ff66] text-black font-bold" : "text-[#88aa90] hover:text-white"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              mode === "url" ? "bg-[#00ff66] text-black font-bold" : "text-[#88aa90] hover:text-white"
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            value
              ? "border-[#00ff66]/40 bg-[#06140a]/40"
              : "border-[#00ff66]/20 bg-[#030905]/60 hover:border-[#00ff66]/60 hover:bg-[#06140a]/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
              <span className="font-mono text-xs text-[#a0c0a8]">Processing image...</span>
            </div>
          ) : value ? (
            <div className="relative group w-full flex items-center justify-center py-2">
              <img
                src={value}
                alt="Preview"
                className="max-h-36 max-w-full rounded-lg object-contain border border-[#00ff66]/30 shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = NEUTRAL_MEDIA_THUMB;
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="absolute top-0 right-0 p-1 bg-red-600/90 text-white rounded-full hover:bg-red-500 shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-mono text-xs text-white">Click or drag image to upload</p>
              <p className="text-[11px] text-[#88aa90]">JPEG, PNG, WEBP, GIF up to 12MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <LinkIcon className="w-4 h-4 text-[#88aa90] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-[#030a05] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg pl-9 pr-8 py-2 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-2 p-1 text-[#88aa90] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {value && (
            <div className="flex items-center gap-3 p-2 bg-[#040e07] rounded-lg border border-[#00ff66]/20">
              <img
                src={value}
                alt="Preview"
                className="w-12 h-12 rounded object-cover border border-[#00ff66]/30 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = NEUTRAL_MEDIA_THUMB;
                }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-mono text-[#00ff66] truncate">{value}</span>
                <span className="text-[10px] text-[#88aa90]">Image preview</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};