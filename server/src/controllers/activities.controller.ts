import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getAllActivities(req: Request, res: Response) {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: activities });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch activities." });
  }
}

export async function getActivityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found." });
    }
    return res.json({ success: true, data: activity });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch activity." });
  }
}

export async function createActivity(req: Request, res: Response) {
  try {
    const { numberId, title, description, photoUrl, date, displayOrder, isPublished } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }

    const activity = await prisma.activity.create({
      data: {
        numberId: numberId || null,
        title,
        description,
        photoUrl,
        date,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return res.status(201).json({ success: true, data: activity, message: "Activity created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create activity." });
  }
}

export async function updateActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { numberId, title, description, photoUrl, date, displayOrder, isPublished } = req.body;

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        ...(numberId !== undefined && { numberId }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(date !== undefined && { date }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    return res.json({ success: true, data: activity, message: "Activity updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update activity." });
  }
}

export async function deleteActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.activity.delete({ where: { id } });
    return res.json({ success: true, message: "Activity deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete activity." });
  }
}

