import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrambleText } from '../hooks/useScrambleText.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { ActivityModal, ActivityItem } from './ActivityModal.tsx';

const DEFAULT_ACTIVITIES_LIST: ActivityItem[] = [
  {
    id: "cmuebzwp5004cdbilqmvfcn9s",
    numberId: "01",
    title: "Cse Brach Entry",
    description:
      "The programme provided students with an opportunity to interact with peers and take part in a shared departmental event beyond academics. It also highlighted the role of the Cipher Association in organising student-led activities and encouraging participation within the CSE community.",
    photoUrl: "/assets/lumiere/slide_01.jpg",
    photos: [
      "/assets/lumiere/slide_01.jpg",
      "/assets/lumiere/slide_02.jpg",
      "/assets/lumiere/slide_03.jpg",
    ],
    date: "29 October 2025",
  },
  {
    id: "cmuec1s3y004fdbil00m1eikv",
    numberId: "02",
    title: "Competition",
    description:
      "Competitive programming contests, hackathons, and technical design challenges organized by the Cipher Association to foster problem-solving skills.",
    photoUrl: "/assets/promptops/slide_01.jpg",
    photos: [
      "/assets/promptops/slide_01.jpg",
      "/assets/promptops/slide_02.jpg",
    ],
    date: "March 25, 2026",
  },
  {
    id: "cmuec3yl8004gdbilaclnstq6",
    numberId: "03",
    title: "Events",
    description:
      "Departmental flagship events, guest lectures, and student-led collaborative showcases hosted throughout the academic year.",
    date: "2025-2026",
  },
  {
    id: "cmuec4io8004hdbilrt19p9i9",
    numberId: "04",
    title: "Cultural Domains",
    description:
      "Creative arts, media production, and cultural engagement initiatives connecting engineering students with expressive pursuits.",
    date: "2025-2026",
  },
  {
    id: "cmuec50ip004idbil4nhhs2n5",
    numberId: "05",
    title: "Talents and Skills",
    description:
      "Skill development workshops, peer mentoring circles, and industry preparation bootcamps.",
    date: "2025-2026",
  },
];

const getCachedActivities = (): ActivityItem[] => {
  try {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cipher_activities_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Invalidate cache if it contains old fake activities
          const hasFake = parsed.some((a: ActivityItem) =>
            a.title.toLowerCase().includes("applied machine learning")
          );
          if (!hasFake) return parsed;
          sessionStorage.removeItem("cipher_activities_cache");
        }
      }
    }
  } catch {}
  return DEFAULT_ACTIVITIES_LIST;
};

export const Activities: React.FC = () => {
  const { theme } = useTheme();
  const { displayText, ref } = useScrambleText("Activities");
  const [activities, setActivities] = useState<ActivityItem[]>(getCachedActivities);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [introDesc, setIntroDesc] = useState(
    "Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep."
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/public/activities');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: ActivityItem[] = json.data.map((a: any, idx: number) => {
              let photos: string[] = [];
              if (a.photoUrl) {
                try {
                  const parsed = JSON.parse(a.photoUrl);
                  if (Array.isArray(parsed)) photos = parsed.filter(Boolean);
                  else if (typeof a.photoUrl === 'string' && a.photoUrl.trim()) photos = [a.photoUrl.trim()];
                } catch {
                  if (typeof a.photoUrl === 'string' && a.photoUrl.trim()) photos = [a.photoUrl.trim()];
                }
              }

              return {
                id: a.id || String(idx + 1),
                numberId: a.numberId || String(idx + 1).padStart(2, '0'),
                title: a.title,
                description: a.description || "",
                photoUrl: a.photoUrl || "",
                photos,
                date: a.date || "",
              };
            });
            setActivities(mapped);
            try {
              sessionStorage.setItem("cipher_activities_cache", JSON.stringify(mapped));
            } catch {}
          }
        }
      } catch {}

      try {
        const cRes = await fetch('/api/public/content');
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (cJson.map?.activities_desc) {
            setIntroDesc(cJson.map.activities_desc);
          }
        }
      } catch {}
    }

    fetchData();
  }, []);

  return (
    <section id="archive" className="relative py-8 sm:py-12 md:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-12">
          <div className="font-mono text-sm tracking-widest text-emerald-600 dark:text-[#00ff66] mb-3 font-bold">
            // ARCHIVE
          </div>
          <h2
            ref={ref}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-sans dark:text-glow text-black dark:text-white"
            style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
          >
            {displayText}
          </h2>
          <p
            className="font-sans text-base leading-relaxed max-w-2xl text-gray-800 dark:text-[#c4ded0]"
            style={{ color: theme === "dark" ? "#c4ded0" : "#2d3748" }}
          >
            {introDesc}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="clickable-card group relative rounded-xl px-5 py-4 bg-white dark:bg-[#08170c]/70 backdrop-blur-md border border-gray-200 dark:border-[#00ff66]/15 hover:border-emerald-500 dark:hover:border-[#00ff66]/60 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_0_18px_rgba(0,255,102,0.18)] hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span className="font-mono text-xs text-emerald-600 dark:text-[#00ff66] font-bold opacity-80 group-hover:opacity-100">
                  {act.numberId || act.id}
                </span>
                <span
                  className="font-sans text-sm sm:text-base font-semibold group-hover:text-emerald-600 dark:group-hover:text-[#00ff66] transition-colors leading-snug text-black dark:text-white/90"
                  style={{ color: theme === "dark" ? "rgba(255,255,255,0.9)" : "#000000" }}
                >
                  {act.title}
                </span>
              </div>

              <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-[#88aa90] group-hover:text-emerald-600 dark:group-hover:text-[#00ff66] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Activity Details & Photos Modal Popup */}
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />

      </div>
    </section>
  );
};