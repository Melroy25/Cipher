import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getPublicMembers(_req: Request, res: Response) {
  try {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: members });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load team members." });
  }
}

export async function getPublicProjects(_req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load projects." });
  }
}

export async function getPublicEvents(_req: Request, res: Response) {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
    });
    return res.json({ success: true, data: events });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load events." });
  }
}

export async function getPublicActivities(_req: Request, res: Response) {
  try {
    const activities = await prisma.activity.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: activities });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load activities." });
  }
}

export async function getPublicDomains(_req: Request, res: Response) {
  try {
    const domains = await prisma.domain.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: domains });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load domains." });
  }
}

export async function getPublicContent(_req: Request, res: Response) {
  try {
    const items = await prisma.siteContent.findMany();
    const map: Record<string, string> = {};
    items.forEach((item) => {
      map[item.key] = item.value;
    });
    return res.json({ success: true, data: items, map });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load site content." });
  }
}

export async function getPublicInitialData(_req: Request, res: Response) {
  try {
    const [members, events, activities, domains, contentItems, projects] = await Promise.all([
      prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
      prisma.event.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: "asc" },
        include: { slides: { orderBy: { order: "asc" } } },
      }),
      prisma.activity.findMany({ where: { isPublished: true }, orderBy: { displayOrder: "asc" } }),
      prisma.domain.findMany({ where: { isPublished: true }, orderBy: { displayOrder: "asc" } }),
      prisma.siteContent.findMany(),
      prisma.project.findMany({ where: { isPublished: true }, orderBy: { displayOrder: "asc" } }),
    ]);

    const contentMap: Record<string, string> = {};
    contentItems.forEach((c) => {
      contentMap[c.key] = c.value;
    });

    return res.json({
      success: true,
      data: {
        members,
        events,
        activities,
        domains,
        projects,
        content: contentMap,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load public website data." });
  }
}

