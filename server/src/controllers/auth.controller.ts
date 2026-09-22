import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "cipher-super-secret-dev-key-change-in-prod";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const adminData = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    const token = jwt.sign(adminData, JWT_SECRET, { expiresIn: "7d" });

    // Store in session
    if ((req as any).session) {
      (req as any).session.admin = adminData;
    }

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("cipher_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: "Authentication successful.",
      token,
      user: adminData,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    if ((req as any).session) {
      (req as any).session.destroy(() => {});
    }

    res.clearCookie("cipher_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to log out.",
    });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found" });
    }

    return res.json({
      success: true,
      user: admin,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin?.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password.",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update password." });
  }
}

