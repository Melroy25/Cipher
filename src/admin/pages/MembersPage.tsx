import React, { useState, useEffect } from "react";
import { adminFetch } from "../lib/api.ts";
import { Plus, Edit2, Trash2, Search, Check, X, ArrowUpDown, Eye, EyeOff, Loader2, Save, Sparkles } from "lucide-react";
import { Modal } from "../components/Modal.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { ImageUploader } from "../components/ImageUploader.tsx";
import { useToast } from "../context/ToastContext.tsx";
import { NEUTRAL_MEMBER_AVATAR } from "../../utils/placeholders.ts";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  teamYear: string;
  bio?: string | null;
  photoUrl: string;
  modalPhotoUrl?: string | null;
  instagram?: string | null;
  github?: string | null;
  linkedin?: string | null;
  otherUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Team Page Header & Display Configuration State
  const [headerTitle, setHeaderTitle] = useState("Core Team");
  const [headerSubtitle, setHeaderSubtitle] = useState(
    "The minds shaping Cipher Club's tech culture at SJEC — elected officers and domain leads driving every initiative."
  );
  const [headerPastSubtitle, setHeaderPastSubtitle] = useState(
    "Former office bearers and alumni domain leads who guided the Cipher student association."
  );
  const [homeTeamYear, setHomeTeamYear] = useState<string>("2026-27");
  const [teamYearsOrder, setTeamYearsOrder] = useState<string[]>(["2026-27", "2025-26"]);
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isSavingDisplay, setIsSavingDisplay] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "",
    photoUrl: "",
    modalPhotoUrl: "",
    instagram: "",
    github: "",
    linkedin: "",
    otherUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  const { success, error } = useToast();

  const loadHeaderSettings = async () => {
    try {
      const res = await fetch("/api/public/content");
      const data = await res.json();
      if (res.ok && data.map) {
        if (data.map.team_title) setHeaderTitle(data.map.team_title);
        if (data.map.team_subtitle) setHeaderSubtitle(data.map.team_subtitle);
        if (data.map.team_past_subtitle) setHeaderPastSubtitle(data.map.team_past_subtitle);
        if (data.map.home_team_year) setHomeTeamYear(data.map.home_team_year);
        if (data.map.team_years_order) {
          const parsed = data.map.team_years_order.split(",").map((s: string) => s.trim()).filter(Boolean);
          if (parsed.length > 0) setTeamYearsOrder(parsed);
        }
      }
    } catch {}
  };

  const saveHeaderSettings = async () => {
    try {
      setIsSavingHeader(true);
      const res = await adminFetch("/api/admin/content/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            { key: "team_title", value: headerTitle, section: "team", label: "Team Main Heading" },
            { key: "team_subtitle", value: headerSubtitle, section: "team", label: "Team Subtitle Description" },
            { key: "team_past_subtitle", value: headerPastSubtitle, section: "team", label: "Past Team Subtitle Description" },
            { key: "home_team_year", value: homeTeamYear, section: "team", label: "Home Page Core Team Year" },
            { key: "team_years_order", value: teamYearsOrder.join(","), section: "team", label: "Team Page Years Order" },
          ],
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success("Team page & display settings saved successfully!");
      } else {
        error(data.message || "Failed to update settings.");
      }
    } catch {
      error("Network error updating settings.");
    } finally {
      setIsSavingHeader(false);
    }
  };

  const saveDisplaySettings = async (overrideHomeYear?: string, overrideOrder?: string[]) => {
    const yr = overrideHomeYear || homeTeamYear;
    const ord = (overrideOrder || teamYearsOrder).join(",");
    try {
      setIsSavingDisplay(true);
      const res = await adminFetch("/api/admin/content/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            { key: "home_team_year", value: yr, section: "team", label: "Home Page Core Team Year" },
            { key: "team_years_order", value: ord, section: "team", label: "Team Page Years Order" },
          ],
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(`Display saved! Home page: ${yr} · Team page order: ${ord}`);
      } else {
        error(data.message || "Failed to save display settings.");
      }
    } catch {
      error("Network error saving display settings.");
    } finally {
      setIsSavingDisplay(false);
    }
  };

  const moveYearOrder = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= teamYearsOrder.length) return;
    const updated = [...teamYearsOrder];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setTeamYearsOrder(updated);
  };


  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/members", { });
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers(data.data || []);
      } else {
        error("Failed to load members.");
      }
    } catch {
      error("Network error while loading members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    loadHeaderSettings();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      department: "Computer Science & Engineering",
      teamYear: "2025-26",
      bio: "",
      photoUrl: "",
      modalPhotoUrl: "",
      instagram: "",
      github: "",
      linkedin: "",
      otherUrl: "",
      displayOrder: members.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      teamYear: member.teamYear || "2025-26",
      bio: member.bio || "",
      photoUrl: member.photoUrl,
      modalPhotoUrl: member.modalPhotoUrl || "",
      instagram: member.instagram || "",
      github: member.github || "",
      linkedin: member.linkedin || "",
      otherUrl: member.otherUrl || "",
      displayOrder: member.displayOrder,
      isActive: member.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.photoUrl) {
      error("Name, designation, and photo are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingMember
        ? `/api/admin/members/${editingMember.id}`
        : "/api/admin/members";
      const method = editingMember ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(editingMember ? "Member updated successfully!" : "Member added successfully!");
        setIsModalOpen(false);
        loadMembers();
      } else {
        error(data.message || "Failed to save member.");
      }
    } catch {
      error("Network error saving member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await adminFetch(`/api/admin/members/${deleteId}`, {
        method: "DELETE",
        });
      const data = await res.json();
      if (res.ok && data.success) {
        success("Member deleted.");
        setDeleteId(null);
        loadMembers();
      } else {
        error(data.message || "Failed to delete member.");
      }
    } catch {
      error("Network error deleting member.");
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const res = await adminFetch(`/api/admin/members/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      if (res.ok) {
        success(`Member ${!member.isActive ? "published" : "unpublished"}.`);
        loadMembers();
      }
    } catch {
      error("Failed to update member status.");
    }
  };

  const [yearFilter, setYearFilter] = useState("ALL");

  const distinctYears = Array.from(
    new Set(["2026-27", "2025-26", ...members.map((m) => m.teamYear || "2026-27")])
  ).sort((a, b) => b.localeCompare(a));

  const availableYears = ["ALL", ...distinctYears];

  useEffect(() => {
    if (distinctYears.length > 0) {
      setTeamYearsOrder((prev) => {
        const missing = distinctYears.filter((y) => !prev.includes(y));
        return missing.length > 0 ? [...prev, ...missing] : prev;
      });
    }
  }, [members]);

  const filteredMembers = members.filter(
    (m) =>
      (yearFilter === "ALL" || (m.teamYear || "2026-27") === yearFilter) &&
      (m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Team Members &amp; Leadership</h2>
          <p className="font-mono text-xs text-[#88aa90]">
            Manage leadership roster by team year — assign each member to their academic year
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-xs tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" /> ADD TEAM MEMBER
        </button>
      </div>

      {/* ── Public Team Page Header & Display Configuration Card ────────────────────── */}
      <div className="bg-[#030905] border border-[#00ff66]/25 rounded-2xl p-5 md:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#00ff66]/15">
          <div>
            <h3 className="text-sm sm:text-base font-bold font-mono text-[#00ff66] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Public Team Page &amp; Home Page Display Settings
            </h3>
            <p className="font-mono text-xs text-[#88aa90]">
              Configure heading text, choose which core team year is featured on the Home page, and arrange year display order
            </p>
          </div>
          <button
            type="button"
            onClick={saveHeaderSettings}
            disabled={isSavingHeader}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,102,0.25)] hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] disabled:opacity-50 shrink-0"
          >
            {isSavingHeader ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save All Settings
          </button>
        </div>

        {/* Text descriptions row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-mono text-xs text-[#88aa90] uppercase mb-1">
              Main Heading Title
            </label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="e.g. Core Team"
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
            <p className="mt-1 font-mono text-[10px] text-[#88aa90]">
              Year badge (e.g. 2026–27) is attached automatically
            </p>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#88aa90] uppercase mb-1">
              Current Year Subtitle Description
            </label>
            <textarea
              rows={2}
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              placeholder="The minds shaping Cipher Club's tech culture at SJEC..."
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#88aa90] uppercase mb-1">
              Past Years Subtitle Description
            </label>
            <textarea
              rows={2}
              value={headerPastSubtitle}
              onChange={(e) => setHeaderPastSubtitle(e.target.value)}
              placeholder="Former office bearers and alumni domain leads who guided the Cipher student association..."
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Display options row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#00ff66]/15">
          {/* Home Page Featured Year Option */}
          <div className="bg-[#020603] p-3.5 rounded-xl border border-[#00ff66]/25">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="font-mono text-xs text-[#00ff66] font-bold uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                Home Page Featured Core Team
              </label>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 font-bold">
                Active: {homeTeamYear}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#88aa90] mb-2.5">
              Choose which academic year's council is shown in the 3D revolving carousel on the main Home page:
            </p>
            <div className="flex items-center gap-2">
              <select
                value={homeTeamYear}
                onChange={(e) => {
                  const val = e.target.value;
                  setHomeTeamYear(val);
                }}
                className="flex-1 bg-[#041006] text-[#00ff66] font-mono font-bold text-xs border border-[#00ff66]/40 focus:border-[#00ff66] rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                {distinctYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Core Team {yr} {yr === homeTeamYear ? "★ (Selected for Home Page)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Page Year Order Option */}
          <div className="bg-[#020603] p-3.5 rounded-xl border border-[#00ff66]/25">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="font-mono text-xs text-[#00ff66] font-bold uppercase flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Team Page Year Display Order
              </label>
              <span className="font-mono text-[10px] text-[#88aa90]">
                Use ◀ ▶ arrows to reorder
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#88aa90] mb-2.5">
              Order in which year sections are presented from top to bottom on the public /team page:
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {teamYearsOrder.map((yr, idx) => (
                <div
                  key={yr}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041006] border border-[#00ff66]/40 text-xs font-mono shadow-sm"
                >
                  <span className="text-[#00ff66] font-bold">#{idx + 1}</span>
                  <span className="text-white font-semibold">{yr}</span>
                  {idx > 0 && (
                    <button
                      type="button"
                      title="Move up (earlier in page)"
                      onClick={() => moveYearOrder(idx, -1)}
                      className="text-[#88aa90] hover:text-[#00ff66] px-1 py-0.5 rounded hover:bg-[#00ff66]/10 font-bold transition-colors"
                    >
                      ▲
                    </button>
                  )}
                  {idx < teamYearsOrder.length - 1 && (
                    <button
                      type="button"
                      title="Move down (later in page)"
                      onClick={() => moveYearOrder(idx, 1)}
                      className="text-[#88aa90] hover:text-[#00ff66] px-1 py-0.5 rounded hover:bg-[#00ff66]/10 font-bold transition-colors"
                    >
                      ▼
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Year Filter Tabs & Quick Action Bar (Right where user circled in red) ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#030905] border border-[#00ff66]/25">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-[#88aa90] mr-1">Roster Filter:</span>
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setYearFilter(yr)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border ${
                yearFilter === yr
                  ? "bg-[#00ff66] text-black border-[#00ff66] font-bold shadow-[0_0_12px_rgba(0,255,102,0.3)]"
                  : "bg-[#041006] text-[#88aa90] border-[#00ff66]/20 hover:text-[#00ff66] hover:border-[#00ff66]/50"
              }`}
            >
              {yr === "ALL" ? "All Years" : yr}
            </button>
          ))}
        </div>

        {/* Display Settings Quick Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Home Page Year Dropdown */}
          <div className="flex items-center gap-2 bg-[#020703] border border-[#00ff66]/35 px-3 py-1.5 rounded-xl">
            <span className="font-mono text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              Home Page Year:
            </span>
            <select
              value={homeTeamYear}
              onChange={(e) => {
                const val = e.target.value;
                setHomeTeamYear(val);
                saveDisplaySettings(val);
              }}
              className="bg-[#041006] text-[#00ff66] font-mono font-bold text-xs border border-[#00ff66]/50 rounded-md px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Team Page Order Buttons */}
          <div className="flex items-center gap-2 bg-[#020703] border border-[#00ff66]/35 px-3 py-1.5 rounded-xl">
            <span className="font-mono text-xs font-semibold text-white whitespace-nowrap">
              Team Page Order:
            </span>
            <div className="flex items-center gap-1.5">
              {teamYearsOrder.map((yr, idx) => (
                <div
                  key={yr}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#041006] border border-[#00ff66]/30 text-xs font-mono"
                >
                  <span className="text-[#00ff66] font-bold">{idx + 1}.</span>
                  <span className="text-white">{yr}</span>
                  {idx > 0 && (
                    <button
                      type="button"
                      title="Move earlier"
                      onClick={() => {
                        const updated = [...teamYearsOrder];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setTeamYearsOrder(updated);
                        saveDisplaySettings(undefined, updated);
                      }}
                      className="text-[#88aa90] hover:text-[#00ff66] font-bold px-0.5"
                    >
                      ◀
                    </button>
                  )}
                  {idx < teamYearsOrder.length - 1 && (
                    <button
                      type="button"
                      title="Move later"
                      onClick={() => {
                        const updated = [...teamYearsOrder];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setTeamYearsOrder(updated);
                        saveDisplaySettings(undefined, updated);
                      }}
                      className="text-[#88aa90] hover:text-[#00ff66] font-bold px-0.5"
                    >
                      ▶
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Status / Button */}
          <button
            type="button"
            onClick={() => saveDisplaySettings()}
            disabled={isSavingDisplay}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,255,102,0.25)] hover:shadow-[0_0_18px_rgba(0,255,102,0.4)] disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSavingDisplay ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save Display
          </button>
        </div>
      </div>


      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-[#030905] p-3 rounded-xl border border-[#00ff66]/20">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, designation, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none"
          />
        </div>
        <span className="font-mono text-xs text-[#88aa90] whitespace-nowrap">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Members Table */}
      <div className="bg-[#030905] rounded-xl border border-[#00ff66]/20 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
            <p className="font-mono text-xs text-[#88aa90]">Loading roster from database...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-[#88aa90]">No team members found.</p>
            <button
              onClick={openAddModal}
              className="mt-3 text-xs font-mono text-[#00ff66] hover:underline"
            >
              Add the first member &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#040e06] border-b border-[#00ff66]/20 text-[#00ff66] uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Member</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Socials</th>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff66]/10">
                {filteredMembers.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-[#051408]/60 transition-colors">
                    <td className="p-4 text-[#88aa90]">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#00ff66]/30 bg-black"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = NEUTRAL_MEMBER_AVATAR;
                          }}
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{m.name}</p>
                          <p className="text-[11px] text-[#88aa90]">{m.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-semibold tracking-wider">
                        {m.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] tracking-wider">
                        {m.teamYear || "2025-26"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#88aa90]">
                        {m.github && m.github.trim() && (
                          <a
                            href={m.github.trim()}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#00ff66]"
                          >
                            GH
                          </a>
                        )}
                        {m.linkedin && m.linkedin.trim() && (
                          <a
                            href={m.linkedin.trim()}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#00ff66]"
                          >
                            LI
                          </a>
                        )}
                        {m.instagram && m.instagram.trim() && (
                          <a
                            href={m.instagram.trim()}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#00ff66]"
                          >
                            IG
                          </a>
                        )}
                        {!m.github?.trim() && !m.linkedin?.trim() && !m.instagram?.trim() && (
                          <span className="text-[#88aa90]/40">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center text-[#88aa90] font-bold">{m.displayOrder}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStatus(m)}
                        title={m.isActive ? "Click to unpublish" : "Click to publish"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-colors ${
                          m.isActive
                            ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {m.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {m.isActive ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                          title="Edit member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(m.id)}
                          className="p-1.5 rounded-lg text-[#88aa90] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Elston Herold Pereira"
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Designation / Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. PRESIDENT, TREASURER, LEAD"
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-cyan-400 uppercase mb-1">
                Team Year *
              </label>
              <input
                type="text"
                required
                value={formData.teamYear}
                onChange={(e) => setFormData({ ...formData, teamYear: e.target.value })}
                placeholder="e.g. 2025-26"
                className="w-full bg-[#020603] border border-cyan-500/30 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
              <p className="text-[10px] font-mono text-[#88aa90] mt-1">Academic year (e.g. 2025-26)</p>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader
              label="Primary Photograph *"
              value={formData.photoUrl}
              onChange={(url) => setFormData({ ...formData, photoUrl: url })}
            />
            <ImageUploader
              label="Modal Spotlight Photograph (Optional)"
              value={formData.modalPhotoUrl}
              onChange={(url) => setFormData({ ...formData, modalPhotoUrl: url })}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
              Short Biography (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief description of contributions or vision..."
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="border-t border-[#00ff66]/15 pt-3">
            <h4 className="font-mono text-xs text-[#00ff66] uppercase mb-3">Social Profiles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#88aa90] mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#88aa90] mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#88aa90] mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="memberActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded bg-black border-[#00ff66]/30 text-[#00ff66] focus:ring-0"
            />
            <label htmlFor="memberActive" className="font-mono text-xs text-white select-none">
              Publish on public website
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#00ff66]/20">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg font-mono text-xs text-[#88aa90] hover:text-white border border-[#00ff66]/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00ff66] hover:bg-[#00e65b] text-black font-mono font-bold text-xs tracking-wider px-5 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                "Save Member"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message="Are you sure you want to remove this team member? They will no longer appear on the leadership roster."
        confirmLabel="Confirm Delete"
      />
    </div>
  );
};