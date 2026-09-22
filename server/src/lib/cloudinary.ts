import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

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
  }

  // Fallback: Copy to static uploads directory
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${Date.now()}-${path.basename(filePath)}`;
  const destination = path.join(uploadsDir, filename);
  fs.copyFileSync(filePath, destination);

  const stats = fs.statSync(destination);

  return {
    url: `/uploads/${filename}`,
    publicId: filename,
    format: path.extname(filename).replace(".", ""),
    bytes: stats.size,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  if (isConfigured && publicId && !publicId.includes("uploads")) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  } else {
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

