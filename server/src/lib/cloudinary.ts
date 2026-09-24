import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  bytes?: number;
}

export async function uploadImage(
  filePath: string,
  folder = "cipher-club"
): Promise<UploadResult> {
  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "image",
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (err) {
      console.error("Cloudinary upload failed, using Data URI fallback:", err);
    }
  }

  // Fallback: Read image file, compress with sharp (max 1000px, WebP 80% quality ~40-90KB), and convert to Base64 Data URI
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".svg" || ext === ".gif") {
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = ext === ".svg" ? "image/svg+xml" : "image/gif";
      return {
        url: `data:${mimeType};base64,${fileBuffer.toString("base64")}`,
        format: ext.replace(".", ""),
        bytes: fileBuffer.length,
      };
    }

    const compressedBuffer = await sharp(filePath)
      .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const dataUrl = `data:image/webp;base64,${compressedBuffer.toString("base64")}`;

    return {
      url: dataUrl,
      publicId: undefined,
      format: "webp",
      bytes: compressedBuffer.length,
    };
  } catch {
    const fileBuffer = fs.readFileSync(filePath);
    return {
      url: `data:image/jpeg;base64,${fileBuffer.toString("base64")}`,
      format: "jpeg",
      bytes: fileBuffer.length,
    };
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  if (isConfigured && publicId && !publicId.includes("uploads") && !publicId.startsWith("data:")) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  } else if (publicId && publicId.includes("uploads")) {
    const localFile = path.resolve(process.cwd(), "public", "uploads", publicId);
    if (fs.existsSync(localFile)) {
      try {
        fs.unlinkSync(localFile);
      } catch (err) {
        console.error("Failed to delete local upload file:", err);
      }
    }
  }
}
