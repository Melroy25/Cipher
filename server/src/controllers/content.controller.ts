import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getAllContent(req: Request, res: Response) {
  try {
    const items = await prisma.siteContent.findMany({
      orderBy: { key: "asc" },
    });
    
    // Also build a fast key-value object map
    const contentMap: Record<string, string> = {};
    items.forEach((item) => {
      contentMap[item.key] = item.value;
    });

    return res.json({ success: true, data: items, map: contentMap });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch site content." });
  }
}

export async function updateContentItem(req: Request, res: Response) {
  try {
    const { key, value, section, label, type } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, message: "Key is required." });
    }

    const item = await prisma.siteContent.upsert({
      where: { key },
      update: {
        value: value !== undefined ? String(value) : "",
        ...(section && { section }),
        ...(label && { label }),
        ...(type && { type }),
      },
      create: {
        key,
        value: value !== undefined ? String(value) : "",
        section: section || "general",
        label: label || key,
        type: type || "text",
      },
    });

    return res.json({ success: true, data: item, message: "Content updated." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update content item." });
  }
}

export async function bulkUpdateContent(req: Request, res: Response) {
  try {
    const { items } = req.body; // array of { key, value }

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Items array is required." });
    }

    const results = [];
    for (const item of items) {
      if (item.key) {
        const updated = await prisma.siteContent.upsert({
          where: { key: item.key },
          update: { value: item.value || "" },
          create: {
            key: item.key,
            value: item.value || "",
            section: item.section || "general",
            label: item.label || item.key,
            type: item.type || "text",
          },
        });
        results.push(updated);
      }
    }

    return res.json({ success: true, count: results.length, message: "Content saved successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update content in bulk." });
  }
}

