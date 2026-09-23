import React, { useState, useEffect } from "react";
import { Contributors3DCarousel } from "../components/Contributors3DCarousel.tsx";
import { ContributorDetailModal, ContributorData } from "../components/ContributorDetailModal.tsx";
import { useTheme } from "../context/ThemeContext.tsx";

const DEFAULT_CONTRIBUTORS: ContributorData[] = [
  {
    id: "chinmayee",
    name: "Chinmayee",
    role: "Event Co-Lead & Track Winner",
    eventName: "Prompt Ops-2K26",
    department: "Computer Science & Engineering",
    batch: "1st Year CSE",
    photoUrl: "/assets/leaders/chaitra.jpg",
    bio: "Top honors in Track 1; assisted in prompt engineering documentation, challenge design, and peer mentoring throughout the workshop.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "chris",
    name: "Chris Royston Monteiro",
    role: "Technical Evaluator",
    eventName: "Prompt Ops-2K26",
    department: "Computer Science & Engineering",
    batch: "2nd Year CSE",
    photoUrl: "/assets/leaders/elston.jpg",
    bio: "Designed multi-layer evaluation rubrics for generative AI image prompt fidelity and prompt injection prevention.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "harimurali",
    name: "Harimurali K S",
    role: "API Security Challenge Lead",
    eventName: "Prompt Ops-2K26",
    department: "Computer Science & Engineering",
    batch: "3rd Year CSE",
    photoUrl: "/assets/leaders/raynell.jpg",
    bio: "Engineered adversarial Gemini API prompt extraction challenges and real-time capture-the-flag scoring systems.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "venus",
    name: "Venus Suhani D'Lima",
    role: "Stage & Logistics Coordinator",
    eventName: "Lumière — The Gala",
    department: "Computer Science & Engineering",
    batch: "2nd Year CSE",
    photoUrl: "/assets/leaders/nazmin.jpg",
    bio: "Coordinated stage arrangements, event timeline scheduling, and hospitality for college leaders and faculty guests.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "deeksha",
    name: "Deeksha Ravi Moger",
    role: "Creative Media & Banner Lead",
    eventName: "Lumière — The Gala",
    department: "Computer Science & Engineering",
    batch: "2nd Year CSE",
    photoUrl: "/assets/leaders/jeslin.jpg",
    bio: "Designed stage banners, aesthetic visual animations, lighting themes, and digital invitations for the gala evening.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "venisha",
    name: "Venisha Snehal D'Souza",
    role: "Workshop Mentor",
    eventName: "Smart Contract Bootcamp",
    department: "Computer Science & Engineering",
    batch: "4th Year CSE",
    photoUrl: "/assets/leaders/chaitra.jpg",
    bio: "Mentored over 60+ junior students through Hardhat testing, Solidity syntax, and testnet smart contract deployments.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export const ContributorsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [contributors, setContributors] = useState<ContributorData[]>(DEFAULT_CONTRIBUTORS);
  const [selectedContributor, setSelectedContributor] = useState<ContributorData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    async function fetchContributors() {
      try {
        const res = await fetch("/api/public/contributors", { signal: controller.signal });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json.data) && json.data.length > 0) {
            setContributors(json.data);
          }
        }
      } catch {
        // Fall back gracefully to DEFAULT_CONTRIBUTORS (already rendered)
      } finally {
        clearTimeout(timeoutId);
      }
    }
    fetchContributors();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-2 pb-16 font-sans">
      <section className="relative">
          {/* ── Section Header (GDG Style) ─────────────────────────── */}
          <div className="text-center mb-2">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-2 font-sans"
              style={{ color: isDark ? "#ffffff" : "#000000" }}
            >
              Our{" "}
              <span
                className={
                  isDark
                    ? "text-[#00ff66] dark:text-glow"
                    : "text-emerald-600"
                }
              >
                CONTRIBUTORS
              </span>
            </h2>

            <p
              className="text-xs sm:text-sm font-sans leading-relaxed max-w-xl mx-auto"
              style={{ color: isDark ? "#a0c0a8" : "#4b5563" }}
            >
              With deep gratitude to the brilliant developers, designers, and contributors who helped bring this portfolio to life.
            </p>
          </div>

          {/* ── 3D Circular Motion Revolving Carousel ─────────────────────── */}
          <div className="w-full flex justify-center mt-2 sm:mt-4">
            <Contributors3DCarousel
              contributors={contributors}
              onSelectContributor={(c) => setSelectedContributor(c)}
            />
          </div>

          {/* ── Pop-Up Contributor Detail Modal ─────────────────────────── */}
          <ContributorDetailModal
            contributor={selectedContributor}
            onClose={() => setSelectedContributor(null)}
          />
        </section>
    </div>
  );
};
