import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ─── Public ────────────────────────────────────────────────────────────────
router.get("/public/blog", async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch blog posts" });
  }
});

// ─── Admin ─────────────────────────────────────────────────────────────────
router.get("/admin/blog", requireAuth, async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch blog posts" });
  }
});

router.post("/admin/blog", requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      title, slug, category, summary, content, coverImage,
      author, authorRole, readTime, publishedAt, displayOrder, isPublished,
    } = req.body;

    if (!title || !slug || !summary) {
      return res.status(400).json({ success: false, error: "title, slug, and summary are required" });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        category: category || "GENERAL",
        summary,
        content: typeof content === "string" ? content : JSON.stringify(content || []),
        coverImage: coverImage || null,
        author: author || "Cipher Team",
        authorRole: authorRole || "Cipher Core",
        readTime: readTime || "3 MIN READ",
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        displayOrder: Number(displayOrder) || 0,
        isPublished: isPublished !== false,
      },
    });
    res.status(201).json({ success: true, data: post });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ success: false, error: "A post with that slug already exists" });
    }
    res.status(500).json({ success: false, error: "Failed to create blog post" });
  }
});

router.put("/admin/blog/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title, slug, category, summary, content, coverImage,
      author, authorRole, readTime, publishedAt, displayOrder, isPublished,
    } = req.body;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(category !== undefined && { category }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && {
          content: typeof content === "string" ? content : JSON.stringify(content),
        }),
        ...(coverImage !== undefined && { coverImage: coverImage || null }),
        ...(author !== undefined && { author }),
        ...(authorRole !== undefined && { authorRole }),
        ...(readTime !== undefined && { readTime }),
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update blog post" });
  }
});

router.delete("/admin/blog/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete blog post" });
  }
});

export default router;
