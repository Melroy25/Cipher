import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrambleText } from "../hooks/useScrambleText.ts";
import { useTheme } from "../context/ThemeContext.tsx";
import { Team3DCarousel } from "./Team3DCarousel.tsx";
import { DecryptedProfileModal } from "./DecryptedProfileModal.tsx";
import {
  TeamMemberData,
  DEFAULT_TEAM_MEMBERS,
  getCachedTeamMembers,
  fetchTeamMembersOptimized,
} from "../data/teamMembers.ts";

export const Leadership: React.FC = () => {
  const { theme } = useTheme();
  const { displayText, ref } = useScrambleText("Meet the Core Team");
  const [members, setMembers] = useState<TeamMemberData[]>(() => getCachedTeamMembers());
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);

  const [homeYear, setHomeYear] = useState<string>("2026-27");

  useEffect(() => {
    // Fetch dynamic site content for featured home year
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.map?.home_team_year) {
          setHomeYear(json.map.home_team_year);
        }
      })
      .catch(() => {});

    fetchTeamMembersOptimized().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setMembers(data);
      }
    });
  }, []);

  // Filter to show the chosen academic year on the home page (configured in admin CMS)
  const currentYearMembers = members
    .filter((m) => (m.teamYear || "2026-27") === homeYear)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const displayList = currentYearMembers.length > 0 ? currentYearMembers : members.slice(0, 8);


  return (
    <section id="leadership" className="relative py-8 sm:py-12 md:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* ── Section Header with View Full Team button ───────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-sm tracking-widest text-emerald-600 dark:text-[#00ff66] mb-3 font-bold">
              // GOVERNANCE &amp; LEADERSHIP
            </div>
            <h2
              ref={ref}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-sans dark:text-glow text-black dark:text-white"
              style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
            >
              {displayText}{" "}
              <span className="text-emerald-600 dark:text-[#00ff66]">
                {homeYear}
              </span>
            </h2>
          </div>

          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-[#00ff66]/10 dark:text-[#00ff66] dark:border dark:border-[#00ff66]/30 dark:hover:bg-[#00ff66] dark:hover:text-black dark:hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] self-start md:self-auto"
          >
            <span>VIEW FULL TEAM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── 3D Circular Revolving Carousel (Featured Year) ────────────────── */}
        <div className="w-full flex justify-center">
          <Team3DCarousel
            members={displayList}
            onSelectMember={(m) => setSelectedMember(m)}
            year={homeYear}
          />
        </div>
      </div>

      {/* ── Decrypted Profile Popup Modal ────────────────────────────────────── */}
      <DecryptedProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};