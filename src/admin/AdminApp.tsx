import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase.ts";
import { ToastProvider } from "./context/ToastContext.tsx";
import { AdminLayout } from "./components/AdminLayout.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { MembersPage } from "./pages/MembersPage.tsx";
import { EventsPage } from "./pages/EventsPage.tsx";
import { ActivitiesPage } from "./pages/ActivitiesPage.tsx";
import { DomainsPage } from "./pages/DomainsPage.tsx";
import { ContentPage } from "./pages/ContentPage.tsx";
import { ContributorsPage } from "./pages/ContributorsPage.tsx";
import { ApplicationsPage } from "./pages/ApplicationsPage.tsx";
import { MessagesPage } from "./pages/MessagesPage.tsx";
import { MediaPage } from "./pages/MediaPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import { Loader2, ShieldX } from "lucide-react";

// Emails allowed to access the admin panel
const ALLOWED_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS || "admin@cipher.sjec.ac.in"
)
  .split(",")
  .map((e: string) => e.trim().toLowerCase());

// ──────────────────────────────────────────────────────────────────────────────
// Protected Route
// ──────────────────────────────────────────────────────────────────────────────
interface ProtectedRouteProps {
  user: User | null;
  loading: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, loading, children }) => {
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020703] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
        <p className="font-mono text-xs text-[#88aa90]">Verifying credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const email = user.email?.toLowerCase() ?? "";
  if (!ALLOWED_EMAILS.includes(email)) {
    return (
      <div className="min-h-screen bg-[#020703] flex flex-col items-center justify-center gap-4 p-6">
        <ShieldX className="w-16 h-16 text-red-400" />
        <h1 className="font-mono text-xl font-bold text-white tracking-wider">Access Denied</h1>
        <p className="font-mono text-sm text-[#88aa90] text-center max-w-sm">
          <span className="text-red-400">{user.email}</span> is not an authorized administrator.
        </p>
        <button
          onClick={() => auth.signOut()}
          className="mt-2 font-mono text-xs text-[#00ff66]/80 hover:text-[#00ff66] transition-colors"
        >
          Sign out and try another account →
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// ──────────────────────────────────────────────────────────────────────────────
// Admin App Root
// ──────────────────────────────────────────────────────────────────────────────
export const AdminApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("admin-mode");
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => {
      document.body.classList.remove("admin-mode");
      unsub();
    };
  }, []);

  return (
    <div className="admin-app min-h-screen bg-[#020703] text-[#e2fbe8]">
      <ToastProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute user={user} loading={loading}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="domains" element={<DomainsPage />} />
            <Route path="contributors" element={<ContributorsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ToastProvider>
    </div>
  );
};