import React, { useState, useEffect } from "react";
import {
  Shield, Code2, Users, Rocket,
  Calendar, Terminal, Sparkles,
} from "lucide-react";

interface TimelineItem {
  id?: string;
  year: string;
  date?: string;
  title: string;
  details: string;
}

const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    id: "1",
    year: "2026",
    date: "March 2026",
    title: "PROMPT OPS-2K26 & AI Security Testbeds",
    details: "Pioneered prompt engineering hackathons treating LLMs as adversarial runtime environments with over 120 participants.",
  },
  {
    id: "2",
    year: "2025",
    date: "October 2025",
    title: "Lumière Gala & Solidity Bootcamp",
    details: "Welcomed 150+ CSE students in the Kalam Auditorium and launched hands-on smart contract deployment workshops.",
  },
  {
    id: "3",
    year: "2024",
    date: "April 2024",
    title: "UDAAN Placement Simulation Drives",
    details: "Conducted multi-round technical interviews bridging alumni mentors in tier-1 product firms with undergraduate candidates.",
  },
  {
    id: "4",
    year: "2023",
    date: "September 2023",
    title: "KSCST Project Sponsorships",
    details: "Guided undergraduate research projects securing state-level funding and publication recognition across regional symposiums.",
  },
];

export const AboutPage: React.FC = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState<TimelineItem[]>(DEFAULT_TIMELINE);

  useEffect(() => {
    fetch("/api/public/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.map) {
          setContent(data.map);
          if (data.map.about_timeline) {
            try {
              const parsed = JSON.parse(data.map.about_timeline);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setTimeline(parsed);
              }
            } catch {
              // fallback
            }
          }
        }
      })
      .catch(() => {
        // use defaults
      });
  }, []);

  // Header texts
  const headerBadge = content.about_header_badge || "Association Architecture";
  const headerTitle = content.about_header_title || "About CIPHER";
  const headerDesc =
    content.about_header_desc ||
    "The premier student association of the Department of Computer Science & Engineering at St Joseph Engineering College (SJEC), Vamanjoor, Mangaluru.";

  // Mission & Vision texts
  const missionTitle =
    content.about_mission_title || "Empowering Engineers Through Creation";
  const missionDesc =
    content.about_mission_desc ||
    "CIPHER serves as the catalytic platform for Computer Science & Engineering students to transform theoretical computer science concepts into scalable software products, competitive programming acumen, and impactful community initiatives.";

  const visionTitle =
    content.about_vision_title || "A Legacy of Technical Excellence";
  const visionDesc =
    content.about_vision_desc ||
    "To be recognized across technological universities as a beacon of student-driven innovation, producing ethical technologists, visionary startup founders, and research pioneers equipped to solve computing's next grand challenges.";

  // How We Operate (Pillars)
  const pillarsBadge = content.about_pillars_badge || "Department Pillars";
  const pillarsTitle = content.about_pillars_title || "How We Operate";

  const domains = [
    {
      title: content.about_pillar_1_title || "Technical & Innovation",
      icon: Code2,
      tag: content.about_pillar_1_tag || "CORE TRACK",
      desc:
        content.about_pillar_1_desc ||
        "Hands-on workshops, algorithmic problem solving, Web3 bootcamps, and adversarial AI prompt engineering challenges.",
    },
    {
      title: content.about_pillar_2_title || "Leadership & Governance",
      icon: Shield,
      tag: content.about_pillar_2_tag || "COUNCIL",
      desc:
        content.about_pillar_2_desc ||
        "Annual elections, strategic student council initiatives, departmental communication, and university-wide hackathons.",
    },
    {
      title: content.about_pillar_3_title || "Events & Hackathons",
      icon: Calendar,
      tag: content.about_pillar_3_tag || "COMMUNITY",
      desc:
        content.about_pillar_3_desc ||
        "Flagship competitions like PROMPT OPS-2K26, departmental entry galas like Lumière, and inter-college tech summits.",
    },
    {
      title: content.about_pillar_4_title || "Industry Readiness",
      icon: Rocket,
      tag: content.about_pillar_4_tag || "CAREERS",
      desc:
        content.about_pillar_4_desc ||
        "UDAAN mock interviews, resume reviews, placement preparatory drives, and mentorship from senior alumni engineers.",
    },
  ];

  // Stats
  const stats = [
    {
      val: content.about_stat_1_val || "CSE Dept",
      label: content.about_stat_1_label || "Founded Under",
    },
    {
      val: content.about_stat_2_val || "250+",
      label: content.about_stat_2_label || "Active Members",
    },
    {
      val: content.about_stat_3_val || "17+",
      label: content.about_stat_3_label || "Events Hosted",
    },
    {
      val: content.about_stat_4_val || "SJEC",
      label: content.about_stat_4_label || "Campus Chapter",
    },
  ];

  // Timeline Header
  const timelineBadge = content.about_timeline_badge || "Chronological Journey";
  const timelineTitle = content.about_timeline_title || "Association Timeline";
  const timelineDesc =
    content.about_timeline_desc ||
    "Pivotal milestones, high-impact events, and technical milestones shaping the CIPHER community.";

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 font-sans select-none">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-[#00ff66]/10 border border-emerald-200 dark:border-[#00ff66]/30 text-emerald-700 dark:text-[#00ff66] text-xs font-semibold tracking-wider uppercase mb-5">
          <Terminal className="w-3.5 h-3.5" />
          <span>{headerBadge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          {headerTitle.includes("CIPHER") ? (
            <>
              {headerTitle.replace("CIPHER", "").trim()}{" "}
              <span className="text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                CIPHER
              </span>
            </>
          ) : (
            headerTitle
          )}
        </h1>
        <p className="text-base text-gray-600 dark:text-[#a0c0a8] leading-relaxed">
          {headerDesc}
        </p>

        {/* Vital Stats Strip (Dynamic & CMS-managed) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gray-50 dark:bg-[#040e06] border border-gray-200 dark:border-[#00ff66]/20 text-center shadow-sm hover:border-emerald-500 dark:hover:border-[#00ff66]/50 transition-colors"
            >
              <p className="text-2xl font-black text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                {s.val}
              </p>
              <p className="text-xs text-gray-500 dark:text-[#88aa90] font-medium mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission & Vision ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-2xl bg-white dark:bg-[#040e06] border border-gray-200 dark:border-[#00ff66]/20 relative overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="absolute top-2 right-3 text-6xl text-gray-100 dark:text-[#00ff66]/5 font-black select-none pointer-events-none">
            01
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-700 dark:text-[#00ff66] font-bold uppercase tracking-widest mb-3">
              <Shield className="w-4 h-4" /> Our Mission
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {missionTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#c4ded0] leading-relaxed">
              {missionDesc}
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-white dark:bg-[#040e06] border border-gray-200 dark:border-[#00ff66]/20 relative overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="absolute top-2 right-3 text-6xl text-gray-100 dark:text-[#00ff66]/5 font-black select-none pointer-events-none">
            02
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-700 dark:text-[#00ff66] font-bold uppercase tracking-widest mb-3">
              <Rocket className="w-4 h-4" /> Our Vision
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {visionTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#c4ded0] leading-relaxed">
              {visionDesc}
            </p>
          </div>
        </div>
      </div>

      {/* ── Core Domains ("How We Operate") ───────────────────────── */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-700 dark:text-[#00ff66] uppercase tracking-widest mb-2 font-bold">
            <Users className="w-3.5 h-3.5" /> {pillarsBadge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {pillarsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="p-6 rounded-2xl bg-white dark:bg-[#040e06] border border-gray-200 dark:border-[#00ff66]/20 hover:border-emerald-500 dark:hover:border-[#00ff66] transition-all shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-[0_0_25px_rgba(0,255,102,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#00ff66]/10 border border-emerald-200 dark:border-[#00ff66]/30 flex items-center justify-center text-emerald-600 dark:text-[#00ff66] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-emerald-700 dark:text-[#00ff66] font-bold tracking-wider uppercase block mb-1">
                    {d.tag}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{d.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-[#a0c0a8] leading-relaxed">{d.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Timeline (Glassy Container with Connected Linked Design) ──────── */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-950/20 to-teal-500/5 dark:from-[#00ff66]/10 dark:via-[#020d04]/60 dark:to-[#00f0ff]/5 backdrop-blur-xl border border-emerald-500/20 dark:border-[#00ff66]/25 shadow-xl p-6 sm:p-10 md:p-14 relative overflow-hidden">
        {/* Subtle Cyber Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 dark:bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Section Heading */}
        <div className="text-center mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-700 dark:text-[#00ff66] uppercase tracking-widest mb-2 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> {timelineBadge}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {timelineTitle.includes("Timeline") ? (
              <>
                {timelineTitle.replace("Timeline", "").trim()}{" "}
                <span className="text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                  Timeline
                </span>
              </>
            ) : (
              timelineTitle
            )}
          </h2>
          <p className="text-sm text-gray-600 dark:text-[#a0c0a8] max-w-xl mx-auto mt-2">
            {timelineDesc}
          </p>
        </div>

        {/* Linked Timeline Track */}
        <div className="relative max-w-4xl mx-auto z-10">
          {/* Vertical Glowing Line */}
          <div className="absolute left-4 sm:left-6 md:left-8 top-3 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-[#00ff66] to-emerald-500/20 dark:from-[#00ff66] dark:via-[#00f0ff] dark:to-[#00ff66]/20 shadow-[0_0_12px_rgba(0,255,102,0.4)]" />

          <div className="space-y-8 sm:space-y-10">
            {timeline.map((item, idx) => (
              <div key={item.id || idx} className="relative flex items-start gap-5 sm:gap-8 group">
                {/* Linked Circular Node on the vertical track */}
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-8 sm:w-12 md:w-16">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#020904] border-2 border-emerald-500 dark:border-[#00ff66] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.35)] group-hover:scale-110 group-hover:border-[#00f0ff] transition-all duration-300">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-600 dark:bg-[#00ff66] group-hover:bg-[#00f0ff] shadow-[0_0_8px_rgba(0,255,102,0.8)] transition-colors" />
                  </div>
                </div>

                {/* Event Card with horizontal connector */}
                <div className="flex-1 p-5 sm:p-7 rounded-2xl bg-white/80 dark:bg-[#030d05]/80 backdrop-blur-md border border-emerald-500/20 dark:border-[#00ff66]/20 hover:border-emerald-500/50 dark:hover:border-[#00ff66]/50 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-[0_0_25px_rgba(0,255,102,0.12)] transition-all duration-300 relative group-hover:translate-x-1">
                  {/* Connector Stem */}
                  <div className="absolute -left-5 sm:-left-8 top-4 sm:top-5 w-5 sm:w-8 h-0.5 bg-emerald-500/30 dark:bg-[#00ff66]/30 group-hover:bg-[#00ff66] transition-colors" />

                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 dark:bg-[#00ff66]/15 border border-emerald-500/30 dark:border-[#00ff66]/30 text-emerald-700 dark:text-[#00ff66] text-xs font-mono font-bold tracking-wider">
                      {item.year}
                    </span>
                    {item.date && (
                      <span className="text-xs font-mono text-gray-500 dark:text-[#88aa90]">
                        {item.date}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-[#00ff66] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-[#a0c0a8] leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
