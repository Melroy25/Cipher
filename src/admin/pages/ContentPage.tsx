import React, { useState, useEffect } from "react";
import { adminFetch } from "../lib/api.ts";
import {
  Save, Loader2, Plus, Trash2, Image as ImageIcon, Sparkles,
  ChevronUp, ChevronDown, BarChart2, Calendar, Sun, Moon, Palette,
  Shield, Rocket, Users, Target, Terminal,
} from "lucide-react";
import { useToast } from "../context/ToastContext.tsx";
import { ImageUploader } from "../components/ImageUploader.tsx";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  section: string;
  label: string;
  type: string;
}

interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  details: string;
}

const DEFAULT_ABOUT_PHOTOS = [
  "/uploads/1790187729008-1790187721402-285837259.jpg",
  "/uploads/1790187989630-1790187988686-975632268.jpg",
  "/uploads/1790187969052-1790187967430-490944588.JPG",
  "/uploads/1790187956411-1790187954806-134957238.JPG",
];

const DEFAULT_TIMELINE_ITEMS: TimelineEvent[] = [
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

export const ContentPage: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [contentValues, setContentValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("brand");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dedicated state for About section photos (up to 8)
  const [aboutPhotos, setAboutPhotos] = useState<string[]>(DEFAULT_ABOUT_PHOTOS);

  // Dedicated state for About section timeline
  const [timeline, setTimeline] = useState<TimelineEvent[]>(DEFAULT_TIMELINE_ITEMS);

  const { success, error } = useToast();

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/content", { });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
        const map = data.map || {};
        setContentValues(map);

        // Parse about photos
        let loadedPhotos: string[] = [];
        if (map.about_photos) {
          try {
            const parsed = JSON.parse(map.about_photos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedPhotos = parsed.filter((p) => typeof p === "string" && p.trim().length > 0);
            }
          } catch {
            // ignore
          }
        }

        if (loadedPhotos.length === 0) {
          for (let i = 1; i <= 8; i++) {
            const val = map[`about_photo_${i}`];
            if (val && val.trim().length > 0) {
              loadedPhotos.push(val.trim());
            }
          }
        }

        if (loadedPhotos.length > 0) {
          setAboutPhotos(loadedPhotos.slice(0, 8));
        }

        // Parse about timeline
        if (map.about_timeline) {
          try {
            const parsedTimeline = JSON.parse(map.about_timeline);
            if (Array.isArray(parsedTimeline) && parsedTimeline.length > 0) {
              setTimeline(parsedTimeline);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      error("Failed to load website content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleChange = (key: string, val: string) => {
    setContentValues((prev) => ({ ...prev, [key]: val }));
  };

  // Update about photos array and synchronize with contentValues
  const updateAboutPhotos = (newPhotos: string[]) => {
    const trimmed = newPhotos.slice(0, 8);
    setAboutPhotos(trimmed);

    setContentValues((prev) => {
      const next = { ...prev };
      next["about_photos"] = JSON.stringify(trimmed);
      for (let i = 1; i <= 8; i++) {
        next[`about_photo_${i}`] = trimmed[i - 1] || "";
      }
      return next;
    });
  };

  const handleAddAboutPhoto = () => {
    if (aboutPhotos.length >= 8) {
      error("Maximum 8 photos allowed in the Who We Are section.");
      return;
    }
    updateAboutPhotos([...aboutPhotos, "/assets/about/about_1.jpg"]);
  };

  const handleRemoveAboutPhoto = (index: number) => {
    const filtered = aboutPhotos.filter((_, i) => i !== index);
    updateAboutPhotos(filtered);
    success("Photo removed. Remember to click 'Save Changes' to publish.");
  };

  const handleAboutPhotoChange = (index: number, url: string) => {
    const updated = [...aboutPhotos];
    updated[index] = url;
    updateAboutPhotos(updated);
  };

  // Timeline Handlers
  const handleAddTimelineItem = () => {
    const newItem: TimelineEvent = {
      id: Date.now().toString(),
      year: new Date().getFullYear().toString(),
      date: "",
      title: "New Milestone Title",
      details: "Add details about this milestone or event...",
    };
    setTimeline((prev) => [newItem, ...prev]);
  };

  const handleTimelineChange = (index: number, field: keyof TimelineEvent, val: string) => {
    setTimeline((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleRemoveTimelineItem = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
    success("Timeline event removed. Remember to save changes.");
  };

  const handleMoveTimelineItem = (index: number, direction: "up" | "down") => {
    setTimeline((prev) => {
      const targetIdx = direction === "up" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const finalValues = { ...contentValues };

      // Ensure about_photos and about_photo_1..8 are synced
      finalValues["about_photos"] = JSON.stringify(aboutPhotos);
      for (let i = 1; i <= 8; i++) {
        finalValues[`about_photo_${i}`] = aboutPhotos[i - 1] || "";
      }

      // Ensure about_timeline is synced
      finalValues["about_timeline"] = JSON.stringify(timeline);

      // Ensure stats defaults are guaranteed if empty
      if (!finalValues["about_stat_1_val"]) finalValues["about_stat_1_val"] = "CSE Dept";
      if (!finalValues["about_stat_1_label"]) finalValues["about_stat_1_label"] = "Founded Under";
      if (!finalValues["about_stat_2_val"]) finalValues["about_stat_2_val"] = "250+";
      if (!finalValues["about_stat_2_label"]) finalValues["about_stat_2_label"] = "Active Members";
      if (!finalValues["about_stat_3_val"]) finalValues["about_stat_3_val"] = "17+";
      if (!finalValues["about_stat_3_label"]) finalValues["about_stat_3_label"] = "Events Hosted";
      if (!finalValues["about_stat_4_val"]) finalValues["about_stat_4_val"] = "SJEC";
      if (!finalValues["about_stat_4_label"]) finalValues["about_stat_4_label"] = "Campus Chapter";

      // Ensure theme toggle setting is preserved
      if (finalValues["allow_theme_toggle"] === undefined) {
        finalValues["allow_theme_toggle"] = "true";
      }

      const payload = Object.keys(finalValues).map((key) => ({
        key,
        value: finalValues[key],
      }));

      const res = await adminFetch("/api/admin/content/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("Website content saved and published!");
      } else {
        error(data.message || "Failed to update content.");
      }
    } catch {
      error("Network error while saving content.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "brand", label: "Logo & Branding" },
    { id: "hero", label: "Hero Section" },
    { id: "about", label: "About Section" },
    { id: "activities", label: "Activities Copy" },
    { id: "join", label: "Join Section" },
    { id: "footer", label: "Footer & Socials" },
  ];

  // Exclude custom-managed keys from generic form
  const currentSectionItems = items.filter(
    (item) =>
      item.section === activeTab &&
      !item.key.startsWith("about_photo") &&
      !item.key.startsWith("about_stat") &&
      !item.key.startsWith("about_mission") &&
      !item.key.startsWith("about_vision") &&
      !item.key.startsWith("about_pillar") &&
      !item.key.startsWith("about_header") &&
      !item.key.startsWith("about_timeline") &&
      item.key !== "allow_theme_toggle"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Website Content Editor</h2>
          <p className="font-mono text-xs text-[#88aa90]">
            Update public headings, narrative text, logo branding, and showcase photos
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-xs tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> PUBLISHING...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> SAVE CHANGES
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#00ff66]/20 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-mono text-xs tracking-wider rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#040e06] text-[#00ff66] border-t-2 border-[#00ff66] font-bold"
                : "text-[#88aa90] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form Fields */}
      <div className="bg-[#030905] rounded-xl border border-[#00ff66]/20 p-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
            <p className="font-mono text-xs text-[#88aa90]">Loading content entries...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
            {/* If on Logo & Branding, show Theme Mode Switch */}
            {activeTab === "brand" && (
              <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00ff66]/15 pb-4">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#00ff66]" />
                      Website Theme Mode Switch
                    </h3>
                    <p className="font-mono text-[11px] text-[#88aa90] mt-1 max-w-xl">
                      Show or hide the Dark/Light mode button in the website navbar. When turned OFF, the toggle button is hidden and the website only shows Dark Mode.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const current = (contentValues.allow_theme_toggle ?? "true") !== "false";
                      handleChange("allow_theme_toggle", current ? "false" : "true");
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                      (contentValues.allow_theme_toggle ?? "true") !== "false"
                        ? "bg-[#00ff66]/15 border-[#00ff66]/50 text-[#00ff66]"
                        : "bg-gray-800/40 border-gray-700 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {(contentValues.allow_theme_toggle ?? "true") !== "false" ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-[#00ff66]" />
                      )}
                      <span className="font-mono text-xs font-bold">
                        {(contentValues.allow_theme_toggle ?? "true") !== "false"
                          ? "THEME SWITCH ON"
                          : "DARK MODE ONLY (OFF)"}
                      </span>
                    </div>

                    <div
                      className={`w-10 h-5 rounded-full transition-colors p-0.5 relative flex-shrink-0 ${
                        (contentValues.allow_theme_toggle ?? "true") !== "false"
                          ? "bg-[#00ff66]"
                          : "bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          (contentValues.allow_theme_toggle ?? "true") !== "false"
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#040e06] border border-[#00ff66]/15 font-mono text-[11px] text-[#88aa90]">
                  <span className="text-[#00ff66] font-bold">&gt; Status: </span>
                  {(contentValues.allow_theme_toggle ?? "true") !== "false" ? (
                    <span>
                      Navbar theme button is <strong className="text-white">VISIBLE</strong>. Visitors can switch to Light mode.
                    </span>
                  ) : (
                    <span>
                      Navbar theme button is <strong className="text-white">HIDDEN</strong>. Visitors can only view <strong className="text-[#00ff66]">Dark mode</strong>.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* If on About Section, show the custom Stats, Timeline, and Photo Managers */}
            {activeTab === "about" && (
              <>
                {/* 1. Header & Intro */}
                <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                  <div className="border-b border-[#00ff66]/15 pb-3">
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#00ff66]" />
                      About Page — Header &amp; Intro
                    </h3>
                    <p className="font-mono text-[11px] text-[#88aa90] mt-0.5">
                      Configure the top headline, badge, and intro narrative on the /about page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                        Top Badge Pill
                      </label>
                      <input
                        type="text"
                        value={contentValues["about_header_badge"] ?? "Association Architecture"}
                        onChange={(e) => handleChange("about_header_badge", e.target.value)}
                        placeholder="Association Architecture"
                        className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                        Main Heading
                      </label>
                      <input
                        type="text"
                        value={contentValues["about_header_title"] ?? "About CIPHER"}
                        onChange={(e) => handleChange("about_header_title", e.target.value)}
                        placeholder="About CIPHER"
                        className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-[#00ff66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                      Intro Paragraph
                    </label>
                    <textarea
                      rows={2}
                      value={
                        contentValues["about_header_desc"] ??
                        "The premier student association of the Department of Computer Science & Engineering at St Joseph Engineering College (SJEC), Vamanjoor, Mangaluru."
                      }
                      onChange={(e) => handleChange("about_header_desc", e.target.value)}
                      placeholder="Intro description..."
                      className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Vital Stats Strip Manager */}
                <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                  <div className="border-b border-[#00ff66]/15 pb-3">
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#00ff66]" />
                      About Page — 4 Highlight Counters
                    </h3>
                    <p className="font-mono text-[11px] text-[#88aa90] mt-0.5">
                      Configure the 4 vital stats displayed directly underneath the About CIPHER header.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { idx: 1, defVal: "CSE Dept", defLbl: "Founded Under" },
                      { idx: 2, defVal: "250+", defLbl: "Active Members" },
                      { idx: 3, defVal: "17+", defLbl: "Events Hosted" },
                      { idx: 4, defVal: "SJEC", defLbl: "Campus Chapter" },
                    ].map(({ idx, defVal, defLbl }) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#040e06] border border-[#00ff66]/20 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#00ff66] font-bold px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">
                            Stat #{idx}
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                            Value (Large Text)
                          </label>
                          <input
                            type="text"
                            value={contentValues[`about_stat_${idx}_val`] ?? defVal}
                            onChange={(e) => handleChange(`about_stat_${idx}_val`, e.target.value)}
                            placeholder={defVal}
                            className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-[#00ff66] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                            Label (Subtext)
                          </label>
                          <input
                            type="text"
                            value={contentValues[`about_stat_${idx}_label`] ?? defLbl}
                            onChange={(e) => handleChange(`about_stat_${idx}_label`, e.target.value)}
                            placeholder={defLbl}
                            className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Our Mission & Our Vision */}
                <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                  <div className="border-b border-[#00ff66]/15 pb-3">
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#00ff66]" />
                      Our Mission &amp; Our Vision
                    </h3>
                    <p className="font-mono text-[11px] text-[#88aa90] mt-0.5">
                      Edit the headline and narrative description for both Mission and Vision cards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Mission Card */}
                    <div className="p-4 rounded-xl bg-[#040e06] border border-[#00ff66]/20 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00ff66]">
                        <Shield className="w-3.5 h-3.5" /> 01 OUR MISSION
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                          Mission Heading
                        </label>
                        <input
                          type="text"
                          value={contentValues["about_mission_title"] ?? "Empowering Engineers Through Creation"}
                          onChange={(e) => handleChange("about_mission_title", e.target.value)}
                          placeholder="Empowering Engineers Through Creation"
                          className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                          Mission Description
                        </label>
                        <textarea
                          rows={3}
                          value={
                            contentValues["about_mission_desc"] ??
                            "CIPHER serves as the catalytic platform for Computer Science & Engineering students to transform theoretical computer science concepts into scalable software products, competitive programming acumen, and impactful community initiatives."
                          }
                          onChange={(e) => handleChange("about_mission_desc", e.target.value)}
                          placeholder="Mission text..."
                          className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Vision Card */}
                    <div className="p-4 rounded-xl bg-[#040e06] border border-[#00ff66]/20 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00ff66]">
                        <Rocket className="w-3.5 h-3.5" /> 02 OUR VISION
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                          Vision Heading
                        </label>
                        <input
                          type="text"
                          value={contentValues["about_vision_title"] ?? "A Legacy of Technical Excellence"}
                          onChange={(e) => handleChange("about_vision_title", e.target.value)}
                          placeholder="A Legacy of Technical Excellence"
                          className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                          Vision Description
                        </label>
                        <textarea
                          rows={3}
                          value={
                            contentValues["about_vision_desc"] ??
                            "To be recognized across technological universities as a beacon of student-driven innovation, producing ethical technologists, visionary startup founders, and research pioneers equipped to solve computing's next grand challenges."
                          }
                          onChange={(e) => handleChange("about_vision_desc", e.target.value)}
                          placeholder="Vision text..."
                          className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. How We Operate (Department Pillars) */}
                <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                  <div className="border-b border-[#00ff66]/15 pb-3">
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00ff66]" />
                      How We Operate — Department Pillars
                    </h3>
                    <p className="font-mono text-[11px] text-[#88aa90] mt-0.5">
                      Configure the section title, badge, and the 4 domain pillar cards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                        Section Badge Pill
                      </label>
                      <input
                        type="text"
                        value={contentValues["about_pillars_badge"] ?? "Department Pillars"}
                        onChange={(e) => handleChange("about_pillars_badge", e.target.value)}
                        placeholder="Department Pillars"
                        className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={contentValues["about_pillars_title"] ?? "How We Operate"}
                        onChange={(e) => handleChange("about_pillars_title", e.target.value)}
                        placeholder="How We Operate"
                        className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                    {[
                      {
                        idx: 1,
                        defTag: "CORE TRACK",
                        defTitle: "Technical & Innovation",
                        defDesc:
                          "Hands-on workshops, algorithmic problem solving, Web3 bootcamps, and adversarial AI prompt engineering challenges.",
                      },
                      {
                        idx: 2,
                        defTag: "COUNCIL",
                        defTitle: "Leadership & Governance",
                        defDesc:
                          "Annual elections, strategic student council initiatives, departmental communication, and university-wide hackathons.",
                      },
                      {
                        idx: 3,
                        defTag: "COMMUNITY",
                        defTitle: "Events & Hackathons",
                        defDesc:
                          "Flagship competitions like PROMPT OPS-2K26, departmental entry galas like Lumière, and inter-college tech summits.",
                      },
                      {
                        idx: 4,
                        defTag: "CAREERS",
                        defTitle: "Industry Readiness",
                        defDesc:
                          "UDAAN mock interviews, resume reviews, placement preparatory drives, and mentorship from senior alumni engineers.",
                      },
                    ].map(({ idx, defTag, defTitle, defDesc }) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#040e06] border border-[#00ff66]/20 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] text-[#00ff66] font-bold px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/20 inline-block">
                            Pillar #{idx}
                          </span>

                          <div>
                            <label className="block text-[10px] font-mono text-[#88aa90] mb-0.5">
                              Tag
                            </label>
                            <input
                              type="text"
                              value={contentValues[`about_pillar_${idx}_tag`] ?? defTag}
                              onChange={(e) => handleChange(`about_pillar_${idx}_tag`, e.target.value)}
                              placeholder={defTag}
                              className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded px-2.5 py-1 text-xs font-mono font-bold text-[#00ff66] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-[#88aa90] mb-0.5">
                              Title
                            </label>
                            <input
                              type="text"
                              value={contentValues[`about_pillar_${idx}_title`] ?? defTitle}
                              onChange={(e) => handleChange(`about_pillar_${idx}_title`, e.target.value)}
                              placeholder={defTitle}
                              className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-[#88aa90] mb-0.5">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={contentValues[`about_pillar_${idx}_desc`] ?? defDesc}
                              onChange={(e) => handleChange(`about_pillar_${idx}_desc`, e.target.value)}
                              placeholder={defDesc}
                              className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded p-2 text-xs font-mono text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Association Timeline Header & Milestones */}
                <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                  <div className="border-b border-[#00ff66]/15 pb-3">
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00ff66]" />
                      Association Timeline — Header &amp; Milestones
                    </h3>
                    <p className="font-mono text-[11px] text-[#88aa90] mt-0.5">
                      Configure the timeline section title, badge, subtext, and chronological milestone events.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                        Timeline Badge Pill
                      </label>
                      <input
                        type="text"
                        value={contentValues["about_timeline_badge"] ?? "Chronological Journey"}
                        onChange={(e) => handleChange("about_timeline_badge", e.target.value)}
                        placeholder="Chronological Journey"
                        className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                        Timeline Section Title
                      </label>
                      <input
                        type="text"
                        value={contentValues["about_timeline_title"] ?? "Association Timeline"}
                        onChange={(e) => handleChange("about_timeline_title", e.target.value)}
                        placeholder="Association Timeline"
                        className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-[#00ff66] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                      Timeline Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={
                        contentValues["about_timeline_desc"] ??
                        "Pivotal milestones, high-impact events, and technical milestones shaping the CIPHER community."
                      }
                      onChange={(e) => handleChange("about_timeline_desc", e.target.value)}
                      placeholder="Timeline subtitle..."
                      className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#00ff66]/15">
                    <span className="font-mono text-xs font-bold text-white">
                      Timeline Milestones ({timeline.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66] hover:text-black font-mono text-xs font-bold transition-colors self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-4">
                    {timeline.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-[#00ff66]/25 text-center text-xs font-mono text-[#88aa90]">
                        No timeline events configured. Click "+ Add Milestone" above to create one.
                      </div>
                    ) : (
                      timeline.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-4 rounded-xl bg-[#040e06] border border-[#00ff66]/20 space-y-3 relative group hover:border-[#00ff66]/40 transition-colors"
                        >
                          <div className="flex items-center justify-between border-b border-[#00ff66]/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-[#00ff66] font-bold px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">
                                Event #{idx + 1}
                              </span>
                              <span className="font-mono text-xs font-bold text-white">
                                {item.year || "Year"} · {item.title || "Untitled"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveTimelineItem(idx, "up")}
                                title="Move Up"
                                className="p-1 rounded text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === timeline.length - 1}
                                onClick={() => handleMoveTimelineItem(idx, "down")}
                                title="Move Down"
                                className="p-1 rounded text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveTimelineItem(idx)}
                                title="Delete Milestone"
                                className="p-1 rounded text-[#88aa90] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                                Year (e.g. 2026)
                              </label>
                              <input
                                type="text"
                                value={item.year}
                                onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                                placeholder="2026"
                                className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                                Date / Month Tag (e.g. March 2026)
                              </label>
                              <input
                                type="text"
                                value={item.date || ""}
                                onChange={(e) => handleTimelineChange(idx, "date", e.target.value)}
                                placeholder="March 2026"
                                className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                              Milestone Title
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                              placeholder="PROMPT OPS-2K26 & AI Security Testbeds"
                              className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[#88aa90] mb-1 font-semibold">
                              Details / Summary
                            </label>
                            <textarea
                              rows={2}
                              value={item.details}
                              onChange={(e) => handleTimelineChange(idx, "details", e.target.value)}
                              placeholder="Description of what was achieved..."
                              className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Floating Photos Manager (for Home page Who We Are) */}
                <div className="p-5 rounded-2xl bg-[#020703] border border-[#00ff66]/25 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff66]/15 pb-3">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00ff66]" />
                        Who We Are — Animated Floating Photos ({aboutPhotos.length} / 8)
                      </h3>
                      <p className="font-mono text-[11px] text-[#88aa90] mt-0.5">
                        Photos pop up one-by-one as the visitor scrolls to the home page About section. Maximum 8 photos.
                      </p>
                    </div>

                    {aboutPhotos.length < 8 && (
                      <button
                        type="button"
                        onClick={handleAddAboutPhoto}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66] hover:text-black font-mono text-xs font-bold transition-colors self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Photo
                      </button>
                    )}
                  </div>

                  {/* Grid of configured photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {aboutPhotos.map((photoUrl, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#040e06] border border-[#00ff66]/20 flex flex-col justify-between space-y-3 relative group hover:border-[#00ff66]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#00ff66] font-bold px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">
                            Photo #{idx + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveAboutPhoto(idx)}
                            title="Delete photo"
                            className="p-1 rounded text-[#88aa90] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Image Preview */}
                        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[#00ff66]/20 bg-[#020703]">
                          <img
                            src={photoUrl || "/assets/about/about_1.jpg"}
                            alt={`Slot ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/about/about_1.jpg";
                            }}
                          />
                        </div>

                        {/* Image Uploader widget for this slot */}
                        <ImageUploader
                          value={photoUrl}
                          onChange={(url) => handleAboutPhotoChange(idx, url)}
                          label={`Upload or Change Photo ${idx + 1}`}
                        />
                      </div>
                    ))}

                    {/* Empty Slot Card to prompt adding when < 8 */}
                    {aboutPhotos.length < 8 && (
                      <button
                        type="button"
                        onClick={handleAddAboutPhoto}
                        className="h-full min-h-[220px] rounded-xl border-2 border-dashed border-[#00ff66]/25 hover:border-[#00ff66] bg-[#020703]/50 hover:bg-[#00ff66]/5 flex flex-col items-center justify-center gap-2 p-4 text-[#88aa90] hover:text-[#00ff66] transition-all font-mono text-xs"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/25 flex items-center justify-center text-[#00ff66]">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="font-bold">Add Photo Slot</span>
                        <span className="text-[10px] opacity-70">
                          Slot {aboutPhotos.length + 1} of 8
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* General Section Items (headings, texts, etc.) */}
            {currentSectionItems.map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-[#00ff66]">&gt;</span> {item.label}
                  </label>
                  <span className="text-[10px] font-mono text-[#88aa90]">{item.key}</span>
                </div>

                {item.type === "image" ? (
                  <div className="p-4 rounded-xl bg-[#020703] border border-[#00ff66]/20 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg bg-[#040e06] border border-[#00ff66]/30 flex items-center justify-center p-2 flex-shrink-0">
                        <img
                          src={contentValues[item.key] ?? item.value}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/logo.png";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-white">Current Logo Preview</p>
                        <p className="font-mono text-[11px] text-[#88aa90]">
                          Displayed in the floating navbar on every page.
                        </p>
                      </div>
                    </div>
                    <ImageUploader
                      value={contentValues[item.key] ?? item.value}
                      onChange={(url) => handleChange(item.key, url)}
                      label="Upload New Logo or Enter URL"
                    />
                  </div>
                ) : item.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={contentValues[item.key] ?? item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                  />
                ) : (
                  <input
                    type={item.type === "url" ? "url" : "text"}
                    value={contentValues[item.key] ?? item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                  />
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-[#00ff66]/15 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#88aa90]">
                Changes are immediately reflected on the live website.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#00ff66] hover:bg-[#00e65b] text-black font-mono font-bold text-xs tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
