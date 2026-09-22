import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getAllProjects(req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch projects." });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch project." });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const {
      title,
      shortDesc,
      description,
      imageUrl,
      technologies,
      category,
      githubUrl,
      demoUrl,
      teamMembers,
      displayOrder,
      isPublished,
    } = req.body;

    if (!title || !shortDesc) {
      return res.status(400).json({
        success: false,
        message: "Title and short description are required.",
      });
    }

    const techString = Array.isArray(technologies)
      ? JSON.stringify(technologies)
      : typeof technologies === "string"
      ? technologies
      : "[]";

    const project = await prisma.project.create({
      data: {
        title,
        shortDesc,
        description,
        imageUrl,
        technologies: techString,
        category: category || "General",
        githubUrl,
        demoUrl,
        teamMembers,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return res.status(201).json({ success: true, data: project, message: "Project created successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create project." });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      title,
      shortDesc,
      description,
      imageUrl,
      technologies,
      category,
      githubUrl,
      demoUrl,
      teamMembers,
      displayOrder,
      isPublished,
    } = req.body;

    const techString = technologies !== undefined
      ? Array.isArray(technologies)
        ? JSON.stringify(technologies)
        : technologies
      : undefined;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(shortDesc && { shortDesc }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(techString !== undefined && { technologies: techString }),
        ...(category !== undefined && { category }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(demoUrl !== undefined && { demoUrl }),
        ...(teamMembers !== undefined && { teamMembers }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    return res.json({ success: true, data: project, message: "Project updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update project." });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return res.json({ success: true, message: "Project deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete project." });
  }
}

