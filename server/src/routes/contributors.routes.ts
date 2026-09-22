import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ─── Public ────────────────────────────────────────────────────────────────
router.get("/public/contributors", async (_req: Request, res: Response) => {
  try {
    const contributors = await prisma.contributor.findMany({
      where: { isPublished: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: contributors });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch contributors" });
  }
});

// ─── Admin ─────────────────────────────────────────────────────────────────
router.get("/admin/contributors", requireAuth, async (_req: Request, res: Response) => {
  try {
    const contributors = await prisma.contributor.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: contributors });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch contributors" });
  }
});

router.post("/admin/contributors", requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      name,
      role,
      eventName,
      teamName,
      department,
      batch,
      photoUrl,
      modalPhotoUrl,
      bio,
      github,
      linkedin,
      instagram,
      displayOrder,
      isPublished,
    } = req.body;

    const resolvedTeamName = (teamName || eventName || "").trim();

    if (!name || !role || !resolvedTeamName) {
      return res.status(400).json({ success: false, error: "name, role, and teamName are required" });
    }

    const item = await prisma.contributor.create({
      data: {
        name,
        role,
        eventName: resolvedTeamName,
        department: department || "Computer Science & Engineering",
        batch: batch || null,
        photoUrl: photoUrl || null,
        modalPhotoUrl: modalPhotoUrl || null,
        bio: bio || null,
        github: github || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        displayOrder: Number(displayOrder) || 0,
        isPublished: isPublished !== false,
      },
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create contributor" });
  }
});

router.put("/admin/contributors/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      eventName,
      teamName,
      department,
      batch,
      photoUrl,
      modalPhotoUrl,
      bio,
      github,
      linkedin,
      instagram,
      displayOrder,
      isPublished,
    } = req.body;

    const resolvedTeamName = teamName !== undefined ? teamName : eventName;

    const item = await prisma.contributor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(resolvedTeamName !== undefined && { eventName: resolvedTeamName }),
        ...(department !== undefined && { department }),
        ...(batch !== undefined && { batch: batch || null }),
        ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
        ...(modalPhotoUrl !== undefined && { modalPhotoUrl: modalPhotoUrl || null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(github !== undefined && { github: github || null }),
        ...(linkedin !== undefined && { linkedin: linkedin || null }),
        ...(instagram !== undefined && { instagram: instagram || null }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update contributor" });
  }
});

router.delete("/admin/contributors/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.contributor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete contributor" });
  }
});

export default router;
