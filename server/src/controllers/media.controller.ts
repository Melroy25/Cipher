import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { uploadImage, deleteImage } from "../lib/cloudinary.js";
import fs from "fs";

export async function getAllMedia(req: Request, res: Response) {
  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: assets });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch media assets." });
  }
}

export async function handleUpload(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No image file provided." });
    }

    const uploadRes = await uploadImage(file.path);

    // Clean up temporary local file if created by multer
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch {}

    const asset = await prisma.mediaAsset.create({
      data: {
        url: uploadRes.url,
        publicId: uploadRes.publicId,
        filename: file.originalname,
        format: uploadRes.format || file.mimetype.split("/")[1],
        sizeBytes: uploadRes.bytes || file.size,
      },
    });

    return res.status(201).json({
      success: true,
      data: asset,
      message: "Image uploaded successfully.",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to upload image.",
    });
  }
}

export async function handleDeleteMedia(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!asset) {
      return res.status(404).json({ success: false, message: "Media asset not found." });
    }

    if (asset.publicId) {
      try {
        await deleteImage(asset.publicId);
      } catch (err) {
        console.error("Failed to delete asset file:", err);
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });

    return res.json({ success: true, message: "Media deleted successfully." });
  } catch (err: any) {
    console.error("Single delete error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to delete media asset." });
  }
}

export async function handleBulkDeleteMedia(req: Request, res: Response) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No media IDs provided." });
    }

    // Find assets so we can clean up any stored files
    const assets = await prisma.mediaAsset.findMany({
      where: { id: { in: ids } },
    });

    for (const asset of assets) {
      if (asset.publicId) {
        try {
          await deleteImage(asset.publicId);
        } catch (e) {
          console.error("Error deleting image file:", e);
        }
      }
    }

    const deleteResult = await prisma.mediaAsset.deleteMany({
      where: { id: { in: ids } },
    });

    return res.json({
      success: true,
      count: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} media asset(s).`,
    });
  } catch (err: any) {
    console.error("Bulk delete error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete media assets.",
    });
  }
}


