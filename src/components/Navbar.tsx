import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.tsx";
import { Sun, Moon, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/assets/logo.png");
  const { theme, toggleTheme, allowThemeToggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch dynamic logo from SiteContent
  useEffect(() => {
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          const logoItem = data.data.find(
            (item: { key: string; value: string }) => item.key === "site_logo_url"
          );
          if (logoItem && logoItem.value) {
            setLogoUrl(logoItem.value);
          }
        }
      })
      .catch(() => {
        // Fallback silently to default logo
      });
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "EVENTS", path: "/events" },
    { name: "TEAM", path: "/team" },
    { name: "JOIN / CONTACT", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Outer Floating Bar — Sleek Thin Rectangle */}
      <div
        className={`site-navbar fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] md:w-[92%] lg:w-[90%] max-w-6xl rounded-lg transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,255,102,0.35)] scale-[0.99]"
            : "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,255,102,0.20)]"
        }`}
        style={{ isolation: "isolate" }}
      >
        {/* Shimmer border layer — dark mode only */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none hidden dark:block"
          style={{ zIndex: 0 }}
        >
          <div className="cyber-shimmer-bg absolute inset-0 rounded-lg" />
        </div>

        {/* Light mode subtle border — shown only in light mode */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none block dark:hidden border border-gray-200"
          style={{ zIndex: 0 }}
        />

        {/* 1.5px inset mask to show thin border with glass transparency */}
        <div
          className="absolute inset-[1.5px] rounded-[6px] transition-colors pointer-events-none"
          style={{
            zIndex: 1,
            backgroundColor:
              theme === "dark" ? "rgba(3, 8, 4, 0.3)" : "rgba(255, 255, 255, 0.35)",
          }}
        />

        {/* Inner Glassmorphic Header (frosted glass like GDG) */}
        <header
          className="relative w-full rounded-[6px] backdrop-blur-2xl border transition-all duration-300"
          style={{
            zIndex: 2,
            backgroundColor:
              theme === "dark" ? "rgba(3, 12, 6, 0.65)" : "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderColor:
              theme === "dark" ? "rgba(0, 255, 102, 0.25)" : "rgba(229, 231, 235, 0.8)",
          }}
        >
          {/* Subtle Cyber Corner Reticles */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-emerald-500/40 dark:border-[#00ff66]/60 pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-emerald-500/40 dark:border-[#00ff66]/60 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-emerald-500/40 dark:border-[#00ff66]/60 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-emerald-500/40 dark:border-[#00ff66]/60 pointer-events-none" />

          <div className="flex items-center justify-between px-4 md:px-6 py-2">
            {/* Left: Dynamic Club Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
                src={logoUrl}
                alt="Cipher Logo"
                className="h-7 md:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]"
                onError={() => setLogoUrl("/assets/logo.png")}
              />
              <span
                className="font-sans text-xs tracking-wider hidden sm:inline-block font-extrabold"
                style={{ color: theme === "dark" ? "#00ff66" : "#000000" }}
              >
                CIPHER
              </span>
            </Link>

            {/* Center: Nav Buttons */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-sans text-xs font-semibold tracking-wider">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`corner-link uppercase py-1.5 px-3 rounded transition-colors ${
                      active ? "active font-extrabold" : "font-semibold"
                    }`}
                    style={{
                      color: theme === "dark" ? (active ? "#00ff66" : "#88aa90") : "#000000",
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Theme Toggle & Mobile Menu Trigger */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* GDG-Style Light / Dark Toggle Button (hidden on mobile, shown on tablet/desktop) */}
              {allowThemeToggle && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark/light theme"
                  title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
                  className="hidden md:flex relative w-[52px] h-7 rounded-full bg-gray-100 dark:bg-[#07170c] border border-gray-300 dark:border-[#00ff66]/40 items-center p-0.5 transition-colors duration-300 focus:outline-none shadow-inner"
                >
                  {/* Track Icons */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <Sun
                      className={`w-3.5 h-3.5 transition-opacity duration-300 ${
                        theme === "light" ? "opacity-0" : "text-gray-500 opacity-40"
                      }`}
                    />
                    <Moon
                      className={`w-3.5 h-3.5 transition-opacity duration-300 ${
                        theme === "dark" ? "opacity-0" : "text-gray-400 opacity-50"
                      }`}
                    />
                  </div>

                  {/* Sliding Indicator Knob with Icon Inside */}
                  <div
                    className={`w-5 h-5 rounded-full transition-transform duration-300 ease-out z-10 flex items-center justify-center ${
                      theme === "dark"
                        ? "translate-x-6 bg-[#00ff66] shadow-[0_0_10px_#00ff66]"
                        : "translate-x-0 bg-white shadow-md border border-gray-200"
                    }`}
                  >
                    {theme === "dark" ? (
                      <Moon className="w-3 h-3 text-[#030804] fill-[#030804]" />
                    ) : (
                      <Sun className="w-3 h-3 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </button>
              )}

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="md:hidden p-1.5 rounded-md text-gray-700 dark:text-[#00ff66] hover:bg-gray-100 dark:hover:bg-[#00ff66]/10 border border-gray-300 dark:border-[#00ff66]/20 transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Dropdown — Backdrop + Menu */}
      {mobileMenuOpen && (
        <>
          {/* Fullscreen transparent backdrop — tap anywhere outside to close */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <nav
            className="fixed md:hidden top-[4.8rem] sm:top-[5.2rem] left-1/2 -translate-x-1/2 w-[92%] max-w-sm rounded-2xl
            text-gray-900 dark:text-white font-sans shadow-[0_16px_50px_rgba(0,0,0,0.65)]
            border border-gray-200/80 dark:border-[#00ff66]/25 p-5 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor:
                theme === "dark" ? "rgba(4, 14, 7, 0.65)" : "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(24px) saturate(190%)",
              WebkitBackdropFilter: "blur(24px) saturate(190%)",
            }}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-3 rounded-xl text-sm tracking-wider uppercase font-semibold transition-all ${
                    isActive(link.path)
                      ? "bg-emerald-500/15 dark:bg-[#00ff66]/15 text-emerald-600 dark:text-[#00ff66] font-bold border border-emerald-400/40 dark:border-[#00ff66]/30 shadow-[0_0_15px_rgba(0,255,102,0.15)]"
                      : "text-gray-700 dark:text-white/85 hover:text-emerald-600 dark:hover:text-[#00ff66] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {allowThemeToggle && (
              <div className="pt-3 border-t border-gray-200/60 dark:border-[#00ff66]/20 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 dark:text-[#88aa90]">Theme Mode:</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-[#00ff66]/10 border border-emerald-300 dark:border-[#00ff66]/30 text-xs font-sans font-bold text-emerald-600 dark:text-[#00ff66] uppercase hover:bg-emerald-100 dark:hover:bg-[#00ff66]/20 transition-all active:scale-95"
                >
                  Switch to {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            )}
          </nav>
        </>
      )}
    </>
  );
};
