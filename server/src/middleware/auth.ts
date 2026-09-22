import { Request, Response, NextFunction } from "express";
import { getFirebaseAuth } from "../lib/firebase-admin.js";

export interface AuthenticatedRequest extends Request {
  adminEmail?: string;
  adminName?: string;
  adminUid?: string;
  admin?: {
    id: string;
    email: string;
    name: string;
  };
}

// Emails allowed to access admin routes — comma-separated in ADMIN_EMAILS env var
const ALLOWED_EMAILS = (process.env.ADMIN_EMAILS || "admin@cipher.sjec.ac.in")
  .split(",")
  .map((e) => e.trim().toLowerCase());

/**
 * requireAdminAuth — verifies the Firebase ID token from the Authorization header
 * and checks that the user's email is in the ADMIN_EMAILS allowlist.
 */
export async function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in.",
    });
  }

  const idToken = authHeader.slice(7);

  try {
    const auth = getFirebaseAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase() ?? "";

    if (!ALLOWED_EMAILS.includes(email)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: ${decoded.email} is not an authorised administrator.`,
      });
    }

    req.adminUid = decoded.uid;
    req.adminEmail = decoded.email;
    req.adminName = decoded.name ?? "Administrator";
    req.admin = {
      id: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? "Administrator",
    };

    return next();
  } catch (err: any) {
    console.error("[Auth] Token verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please sign in again.",
    });
  }
}

// Backward-compat alias
export const requireAuth = requireAdminAuth;
