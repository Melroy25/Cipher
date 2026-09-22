import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getAllDomains(req: Request, res: Response) {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: domains });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch domains." });
  }
}

export async function getDomainById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain) {
      return res.status(404).json({ success: false, message: "Domain not found." });
    }
    return res.json({ success: true, data: domain });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch domain." });
  }
}

export async function createDomain(req: Request, res: Response) {
  try {
    const { name, sessionsLabel, description, iconName, additionalInfo, displayOrder, isPublished } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required." });
    }

    const domain = await prisma.domain.create({
      data: {
        name,
        sessionsLabel: sessionsLabel || "0 SESSIONS",
        description,
        iconName: iconName || "Code2",
        additionalInfo,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return res.status(201).json({ success: true, data: domain, message: "Domain created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create domain." });
  }
}

export async function updateDomain(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, sessionsLabel, description, iconName, additionalInfo, displayOrder, isPublished } = req.body;

    const domain = await prisma.domain.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sessionsLabel !== undefined && { sessionsLabel }),
        ...(description && { description }),
        ...(iconName !== undefined && { iconName }),
        ...(additionalInfo !== undefined && { additionalInfo }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    return res.json({ success: true, data: domain, message: "Domain updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update domain." });
  }
}

export async function deleteDomain(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.domain.delete({ where: { id } });
    return res.json({ success: true, message: "Domain deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete domain." });
  }
}

