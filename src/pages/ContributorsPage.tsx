import React, { useState, useEffect } from "react";
import { Contributors3DCarousel } from "../components/Contributors3DCarousel.tsx";
import { ContributorDetailModal, ContributorData } from "../components/ContributorDetailModal.tsx";
import { useTheme } from "../context/ThemeContext.tsx";

const getInitialContributors = (): ContributorData[] => {
  try {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cipher_contributors_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch {}
  return [];
};

export const ContributorsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [contributors, setContributors] = useState<ContributorData[]>(getInitialContributors);
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
            try {
              sessionStorage.setItem("cipher_contributors_cache", JSON.stringify(json.data));
            } catch {}
          }
        }
      } catch {
        // Fall back gracefully
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
