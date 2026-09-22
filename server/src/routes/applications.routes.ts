import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ─── Public Submit ─────────────────────────────────────────────────────────
router.post("/public/join", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, usn, semester, domain, reason, skills } = req.body;

    if (!name || !email || !reason) {
      return res.status(400).json({ success: false, error: "Name, email, and reason are required" });
    }

    const application = await prisma.joinApplication.create({
      data: {
        name,
        email,
        phone: phone || null,
        usn: usn || null,
        semester: semester || null,
        domain: domain || null,
        reason,
        skills: skills || null,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to submit application" });
  }
});

// ─── Admin Endpoints ───────────────────────────────────────────────────────
router.get("/admin/applications", requireAuth, async (_req: Request, res: Response) => {
  try {
    const list = await prisma.joinApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

router.put("/admin/applications/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await prisma.joinApplication.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update application" });
  }
});

router.delete("/admin/applications/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.joinApplication.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete application" });
  }
});

export default router;
