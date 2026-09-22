import { initializeApp, cert, applicationDefault, getApps, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let _app: App | null = null;

/**
 * Returns an initialised firebase-admin App instance.
 * Uses GOOGLE_APPLICATION_CREDENTIALS env var (path to service account JSON)
 * or falls back to individual env vars for serverless/cloud deployment.
 */
export function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  if (_app) return _app;

  // Option A: service account JSON file path (local dev)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    _app = initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    return _app;
  }

  // Option B: individual env vars (Vercel / production)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin not configured. Set GOOGLE_APPLICATION_CREDENTIALS (dev) " +
        "or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (prod)."
    );
  }

  _app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });

  return _app;
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseAdmin();
  return getAuth(app);
}
