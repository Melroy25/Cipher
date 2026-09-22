import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getAllMembers(req: Request, res: Response) {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return res.json({ success: true, data: members });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch members." });
  }
}

export async function getMemberById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    return res.json({ success: true, data: member });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch member." });
  }
}

export async function createMember(req: Request, res: Response) {
  try {
    const {
      name,
      role,
      department,
      teamYear,
      bio,
      photoUrl,
      modalPhotoUrl,
      instagram,
      github,
      linkedin,
      otherUrl,
      displayOrder,
      isActive,
    } = req.body;

    if (!name || !role || !photoUrl) {
      return res.status(400).json({
        success: false,
        message: "Name, role, and photoUrl are required.",
      });
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        department: department || "Computer Science & Engineering",
        teamYear: teamYear || "2025-26",
        bio,
        photoUrl,
        modalPhotoUrl,
        instagram,
        github,
        linkedin,
        otherUrl,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, data: member, message: "Member added successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create member." });
  }
}

export async function updateMember(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      department,
      teamYear,
      bio,
      photoUrl,
      modalPhotoUrl,
      instagram,
      github,
      linkedin,
      otherUrl,
      displayOrder,
      isActive,
    } = req.body;

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(department !== undefined && { department }),
        ...(teamYear !== undefined && { teamYear }),
        ...(bio !== undefined && { bio }),
        ...(photoUrl && { photoUrl }),
        ...(modalPhotoUrl !== undefined && { modalPhotoUrl }),
        ...(instagram !== undefined && { instagram }),
        ...(github !== undefined && { github }),
        ...(linkedin !== undefined && { linkedin }),
        ...(otherUrl !== undefined && { otherUrl }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return res.json({ success: true, data: member, message: "Member updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update member." });
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.teamMember.delete({ where: { id } });
    return res.json({ success: true, message: "Member deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete member." });
  }
}

