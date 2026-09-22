import { auth } from "./firebase.ts";

/**
 * adminFetch — wraps fetch() and automatically attaches the Firebase ID token
 * as a Bearer token on every request to protected admin API endpoints.
 */
export async function adminFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const user = auth.currentUser;
  let token = "";

  if (user) {
    try {
      token = await user.getIdToken();
    } catch {
      // token refresh failed — request will be rejected by server
    }
  }

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(input, { ...init, headers });
}
