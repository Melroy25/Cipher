import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  Globe2,
  Heart,
  UserCheck,
  Inbox,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  X,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import { auth } from "../lib/firebase.ts";
import { useToast } from "../context/ToastContext.tsx";
import { adminFetch } from "../lib/api.ts";

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const firebaseUser = auth.currentUser;
  const { signOut } = auth;
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [allowThemeToggle, setAllowThemeToggle] = useState(true);
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);

  // Load allow_theme_toggle on mount
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
            ? "Theme switch enabled! Users can now toggle between Dark and Light mode."
            : "Theme switch disabled! Website is now locked in Dark Mode only."
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

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/members", label: "Team Members", icon: Users },
    { to: "/admin/events", label: "Events & Workshops", icon: Calendar },
    { to: "/admin/activities", label: "Activities", icon: Layers },
    { to: "/admin/domains", label: "Domains", icon: Globe2 },
    { to: "/admin/contributors", label: "Contributors", icon: Heart },
    { to: "/admin/applications", label: "Join Requests", icon: UserCheck },
    { to: "/admin/messages", label: "Messages", icon: Inbox },
    { to: "/admin/content", label: "Website Content", icon: FileText },
    { to: "/admin/media", label: "Media Library", icon: ImageIcon },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-[#030905] border-r border-[#00ff66]/20 flex flex-col justify-between select-none">
      {/* Top Header & Nav */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-5 border-b border-[#00ff66]/15 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div>
              <h2 className="font-mono text-base font-extrabold tracking-wider text-[#00ff66] text-glow">
                CIPHER CMS
              </h2>
              <span className="text-[10px] font-mono text-[#88aa90] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00ff66]" /> Admin Console
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 group relative ${
                    isActive
                      ? "bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40 shadow-[0_0_15px_rgba(0,255,102,0.15)] font-semibold"
                      : "text-[#88aa90] hover:text-white hover:bg-[#06140a] hover:border hover:border-[#00ff66]/20"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${
                        isActive ? "text-[#00ff66]" : "text-[#88aa90] group-hover:text-[#00ff66]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Quick Theme Switch Toggle directly under Settings (as indicated in user wireframe) */}
          <div className="pt-2">
            <div className="p-3 rounded-xl bg-[#020703] border border-[#00ff66]/30 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <Moon className="w-3 h-3 text-[#00ff66]" />
                  Theme Switch
                </span>

                <button
                  type="button"
                  onClick={handleToggleThemeSwitch}
                  disabled={isUpdatingTheme}
                  title={
                    allowThemeToggle
                      ? "Turn OFF theme switch (Force Dark Mode only)"
                      : "Turn ON theme switch (Allow Light Mode)"
                  }
                  className={`relative w-9 h-5 rounded-full transition-colors p-0.5 focus:outline-none flex-shrink-0 ${
                    allowThemeToggle ? "bg-[#00ff66]" : "bg-gray-700"
                  }`}
                >
                  {isUpdatingTheme ? (
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                  ) : (
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        allowThemeToggle ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  )}
                </button>
              </div>
              <p className="font-mono text-[9.5px] text-[#88aa90] leading-tight">
                {allowThemeToggle ? (
                  <span className="text-[#00ff66]">Light &amp; Dark active</span>
                ) : (
                  <span className="text-amber-300">Dark mode locked</span>
                )}
              </p>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-[#00ff66]/15 bg-[#020603] space-y-2 flex-shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-mono text-[#88aa90] hover:text-[#00ff66] hover:bg-[#06140a] transition-colors border border-transparent hover:border-[#00ff66]/20"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> View Live Website
          </span>
          <span className="text-[10px] text-[#00ff66]">/</span>
        </a>

        {/* User Card */}
        <div className="p-2.5 rounded-lg bg-[#06140a] border border-[#00ff66]/20 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-mono font-bold text-white truncate">
              {firebaseUser?.displayName || "Administrator"}
            </p>
            <p className="text-[10px] font-mono text-[#88aa90] truncate">
              {firebaseUser?.email || "admin@cipher"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};