import React, { useState, useEffect } from "react";
import {
  Shield,
  Sun,
  Moon,
  Loader2,
  Palette,
  UserCircle2,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { auth } from "../lib/firebase.ts";
import { useToast } from "../context/ToastContext.tsx";
import { adminFetch } from "../lib/api.ts";
import { useNavigate } from "react-router-dom";

export const SettingsPage: React.FC = () => {
  const firebaseUser = auth.currentUser;
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Website Theme Mode Toggle
  const [allowThemeToggle, setAllowThemeToggle] = useState(true);
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);

  useEffect(() => {
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.map) {
          setAllowThemeToggle(data.map.allow_theme_toggle !== "false");
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleThemeSwitch = async () => {
    const nextVal = !allowThemeToggle;
    setIsUpdatingTheme(true);
    try {
      const res = await adminFetch("/api/admin/content/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ key: "allow_theme_toggle", value: nextVal ? "true" : "false" }],
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAllowThemeToggle(nextVal);
        success(
          nextVal
            ? "Theme switch enabled — users can toggle Dark / Light mode."
            : "Theme switch disabled — website locked in Dark Mode."
        );
      } else {
        error("Failed to update theme mode toggle.");
      }
    } catch {
      error("Network error updating theme setting.");
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-xl font-bold text-white tracking-wider">Settings</h1>
        <p className="font-mono text-xs text-[#88aa90] mt-1">
          Manage your admin account and website configuration.
        </p>
      </div>

      {/* ── Account Section ── */}
      <section className="bg-[#040e06] border border-[#00ff66]/20 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <UserCircle2 className="w-4 h-4 text-[#00ff66]" />
          <h2 className="font-mono text-sm font-bold text-[#00ff66] uppercase tracking-wider">
            Account
          </h2>
        </div>

        {/* Avatar + Info */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#020703] border border-[#00ff66]/15">
          {firebaseUser?.photoURL ? (
            <img
              src={firebaseUser.photoURL}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-[#00ff66]/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#00ff66]/10 border-2 border-[#00ff66]/40 flex items-center justify-center">
              <UserCircle2 className="w-8 h-8 text-[#00ff66]" />
            </div>
          )}
          <div>
            <p className="font-mono text-sm font-bold text-white">
              {firebaseUser?.displayName || "Administrator"}
            </p>
            <p className="font-mono text-xs text-[#88aa90] mt-0.5">
              {firebaseUser?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <CheckCircle2 className="w-3 h-3 text-[#00ff66]" />
              <span className="font-mono text-[10px] text-[#00ff66]">
                Signed in via Google
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-mono text-xs transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </section>

      {/* ── Website Theme Toggle ── */}
      <section className="bg-[#040e06] border border-[#00ff66]/20 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-[#00ff66]" />
          <h2 className="font-mono text-sm font-bold text-[#00ff66] uppercase tracking-wider">
            Website Theme
          </h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#020703] border border-[#00ff66]/15">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <Moon className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="font-mono text-sm font-bold text-white">Theme Switch</span>
            </div>
            <p className="font-mono text-xs text-[#88aa90]">
              {allowThemeToggle
                ? "Users can switch between Dark and Light mode."
                : "Website is locked in Dark Mode only."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleThemeSwitch}
            disabled={isUpdatingTheme}
            className={`relative w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none flex-shrink-0 ml-4 ${
              allowThemeToggle ? "bg-[#00ff66]" : "bg-gray-700"
            }`}
          >
            {isUpdatingTheme ? (
              <Loader2 className="w-4 h-4 text-black animate-spin" />
            ) : (
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  allowThemeToggle ? "translate-x-5" : "translate-x-0"
                }`}
              />
            )}
          </button>
        </div>
      </section>

      {/* ── Security Info ── */}
      <section className="bg-[#040e06] border border-[#00ff66]/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#00ff66]" />
          <h2 className="font-mono text-sm font-bold text-[#00ff66] uppercase tracking-wider">
            Security
          </h2>
        </div>

        <div className="space-y-3 font-mono text-xs text-[#88aa90]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
            <span>Authentication via <span className="text-white">Google OAuth 2.0</span> — no password stored</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
            <span>All API requests use <span className="text-white">Firebase ID Tokens</span> (short-lived, auto-refreshed)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
            <span>Backend verifies every token against <span className="text-white">Firebase Admin SDK</span></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
            <span>Only <span className="text-white">allowlisted email(s)</span> can access the admin panel</span>
          </div>
        </div>
      </section>
    </div>
  );
};