import React, { useState, useEffect } from "react";
import { Team3DCarousel } from "../components/Team3DCarousel.tsx";
import { DecryptedProfileModal } from "../components/DecryptedProfileModal.tsx";
import {
  TeamMemberData,
  getCachedTeamMembers,
  fetchTeamMembersOptimized,
} from "../data/teamMembers.ts";
import { useTheme } from "../context/ThemeContext.tsx";

export const TeamPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Instant frame-1 render from memory cache / fallback
  const [members, setMembers] = useState<TeamMemberData[]>(() => getCachedTeamMembers());
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);

  // Dynamic header settings configurable by admin
  const [headerTitle, setHeaderTitle] = useState("Core Team");
  const [headerSubtitle, setHeaderSubtitle] = useState(
    "The minds shaping Cipher Club's tech culture at SJEC — elected officers and domain leads driving every initiative."
  );
  const [headerPastSubtitle, setHeaderPastSubtitle] = useState(
    "Former office bearers and alumni domain leads who guided the Cipher student association."
  );

  const [yearsOrder, setYearsOrder] = useState<string[]>([]);

  useEffect(() => {
    // Fetch dynamic site content for header customizations and year order
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.map) {
          if (json.map.team_title) setHeaderTitle(json.map.team_title);
          if (json.map.team_subtitle) setHeaderSubtitle(json.map.team_subtitle);
          if (json.map.team_past_subtitle) setHeaderPastSubtitle(json.map.team_past_subtitle);
          if (json.map.team_years_order) {
            const order = json.map.team_years_order
              .split(",")
              .map((y: string) => y.trim())
              .filter(Boolean);
            if (order.length > 0) setYearsOrder(order);
          }
        }
      })
      .catch(() => {});

    // Non-blocking background sync with cached data fallback
    let isMounted = true;
    fetchTeamMembersOptimized().then((data) => {
      if (isMounted && data && data.length > 0) {
        setMembers(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique years from members
  const allUniqueYears = Array.from(
    new Set(members.map((m) => m.teamYear || "2026-27"))
  );

  // Sort years according to yearsOrder if configured in admin CMS, otherwise descending
  const years = [...allUniqueYears].sort((a, b) => {
    const idxA = yearsOrder.indexOf(a);
    const idxB = yearsOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b.localeCompare(a);
  });


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-2 pb-16 font-sans">
      <div className="space-y-16">
          {years.map((year, idx) => {
            const yearMembers = members
              .filter((m) => (m.teamYear || "2025-26") === year)
              .sort((a, b) => a.displayOrder - b.displayOrder);

            if (yearMembers.length === 0) return null;

            const isLatestYear = idx === 0;
            const subtitle = isLatestYear ? headerSubtitle : (headerPastSubtitle || headerSubtitle);

            return (
              <section key={year} className="relative">
                {/* ── Section Header (Compact to fit in one screen view) ────────── */}
                <div className="text-center mb-2">
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-2 font-sans"
                    style={{ color: isDark ? "#ffffff" : "#000000" }}
                  >
                    {headerTitle.includes("{year}") ? (
                      headerTitle.replace("{year}", year)
                    ) : (
                      <>
                        {headerTitle}{" "}
                        <span
                          className={`inline-block px-3 py-0.5 rounded-xl border-2 ${
                            isDark
                              ? "text-[#00ff66] border-[#00ff66] dark:text-glow"
                              : "text-emerald-600 border-emerald-600"
                          }`}
                        >
                          {year}
                        </span>
                      </>
                    )}
                  </h2>

                  <p
                    className="text-xs sm:text-sm font-sans leading-relaxed max-w-lg mx-auto"
                    style={{ color: isDark ? "#a0c0a8" : "#4b5563" }}
                  >
                    {subtitle}
                  </p>
                </div>

                {/* ── 3D Circular Motion Revolving Carousel ─────────────────────── */}
                <div className="w-full flex justify-center">
                  <Team3DCarousel
                    members={yearMembers}
                    onSelectMember={(m) => setSelectedMember(m)}
                    year={year}
                  />
                </div>
              </section>
            );
          })}
        </div>

      {/* ── Pop-Up Cyber Decryption Profile Modal ────────────────────────────── */}
      <DecryptedProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};
