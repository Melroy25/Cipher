import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Input sanitization helper to prevent XSS / malicious code
function sanitizeInput(val: string): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// ─── Public Submit Contact Message ─────────────────────────────────────────
router.post("/public/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanSubject = sanitizeInput(subject || "General Inquiry");
    const cleanMessage = sanitizeInput(message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required and must not be empty.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    const item = await prisma.contactMessage.create({
      data: {
        name: cleanName.slice(0, 100),
        email: cleanEmail.slice(0, 150),
        subject: cleanSubject.slice(0, 200),
        message: cleanMessage.slice(0, 3000),
        status: "UNREAD",
      },
    });

    res.status(201).json({
      success: true,
      message: "Message received. The Cipher council will review and respond.",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

// ─── Admin View Messages ───────────────────────────────────────────────────
router.get("/admin/messages", requireAuth, async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
});

router.put("/admin/messages/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update message" });
  }
});

router.patch("/admin/messages/:id/read", requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status: "READ" },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to mark message as read" });
  }
});

router.delete("/admin/messages/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete message" });
  }
});

export default router;
