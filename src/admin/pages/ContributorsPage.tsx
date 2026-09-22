import React, { useState, useEffect } from "react";
import { adminFetch } from "../lib/api.ts";
import {
  Plus, Edit2, Trash2, Search, Eye, EyeOff, Loader2,
  Award, Calendar, User, Link as LinkIcon, Image as ImageIcon,
  Check, X, Heart,
} from "lucide-react";
import { Modal } from "../components/Modal.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { ImageUploader } from "../components/ImageUploader.tsx";
import { useToast } from "../context/ToastContext.tsx";

interface Contributor {
  id: string;
  name: string;
  role: string;
  eventName: string;
  teamName?: string;
  department: string;
  batch?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

const DEFAULT_FORM = {
  name: "",
  role: "",
  teamName: "",
  department: "Computer Science & Engineering",
  batch: "2nd Year CSE",
  photoUrl: "",
  modalPhotoUrl: "",
  bio: "",
  github: "",
  linkedin: "",
  instagram: "",
  displayOrder: 0,
  isPublished: true,
};

export const ContributorsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Contributor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const { success, error } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/contributors", { });
      const data = await res.json();
      if (res.ok && data.success) {
        setContributors(data.data || []);
      } else {
        error(data.error || "Failed to load contributors");
      }
    } catch {
      error("Network error loading contributors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (item: Contributor) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      teamName: item.eventName || item.teamName || "",
      department: item.department || "Computer Science & Engineering",
      batch: item.batch || "",
      photoUrl: item.photoUrl || "",
      modalPhotoUrl: (item as any).modalPhotoUrl || "",
      bio: item.bio || "",
      github: item.github || "",
      linkedin: item.linkedin || "",
      instagram: item.instagram || "",
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.teamName.trim()) {
      error("Name, role, and team name are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `/api/admin/contributors/${editingItem.id}`
        : "/api/admin/contributors";
      const method = editingItem ? "PUT" : "POST";

      const payload = {
        ...formData,
        eventName: formData.teamName, // maps to eventName in DB/API
      };

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(editingItem ? "Contributor updated!" : "Contributor created!");
        setIsModalOpen(false);
        load();
      } else {
        error(data.error || "Failed to save contributor");
      }
    } catch {
      error("Network error saving contributor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await adminFetch(`/api/admin/contributors/${deleteId}`, {
        method: "DELETE",
        });
      const data = await res.json();
      if (res.ok && data.success) {
        success("Contributor deleted");
        setDeleteId(null);
        load();
      } else {
        error(data.error || "Failed to delete");
      }
    } catch {
      error("Network error deleting contributor");
    }
  };

  const togglePublished = async (item: Contributor) => {
    try {
      const res = await adminFetch(`/api/admin/contributors/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(item.isPublished ? "Contributor hidden" : "Contributor published");
        load();
      }
    } catch {
      error("Failed to toggle status");
    }
  };

  const field = (key: keyof typeof formData, value: any) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const filtered = contributors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (c.eventName && c.eventName.toLowerCase().includes(search.toLowerCase())) ||
      (c.teamName && c.teamName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#00ff66]" /> Contributors
          </h1>
          <p className="font-mono text-xs text-[#88aa90] mt-1">
            {contributors.length} contributors · {contributors.filter((c) => c.isPublished).length} visible on site
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff66] text-black font-mono font-bold text-xs rounded-lg hover:bg-[#00ff66]/90 transition-colors shadow-[0_0_15px_rgba(0,255,102,0.3)] self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Contributor
        </button>
      </div>

      {/* ── Search ────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#88aa90] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by contributor name, team, or role..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#041006] border border-[#00ff66]/25 rounded-xl font-mono text-xs text-white placeholder-[#88aa90]/60 focus:outline-none focus:border-[#00ff66] transition-colors"
        />
      </div>

      {/* ── List ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-[#00ff66] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 font-mono">
          <Heart className="w-10 h-10 text-[#00ff66]/30 mx-auto mb-3" />
          <p className="text-[#88aa90] text-sm">
            {search ? "No contributors match your search." : "No contributors yet. Add one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#040e06] border border-[#00ff66]/15 hover:border-[#00ff66]/40 transition-all p-4 flex gap-4 items-start"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#020703] border border-[#00ff66]/25 flex-shrink-0">
                <img
                  src={item.photoUrl || "/assets/leaders/elston.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/leaders/elston.jpg";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 uppercase">
                        {item.teamName || item.eventName}
                      </span>
                      {item.batch && (
                        <span className="font-mono text-[9px] text-[#88aa90]">
                          {item.batch}
                        </span>
                      )}
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white truncate">{item.name}</h3>
                    <p className="font-mono text-xs text-[#00ff66] font-semibold flex items-center gap-1 mt-0.5">
                      <Award className="w-3 h-3" /> {item.role}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => togglePublished(item)}
                      title={item.isPublished ? "Hide from website" : "Make visible"}
                      className="p-1.5 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                    >
                      {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-[#88aa90] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {item.bio && (
                  <p className="font-mono text-[11px] text-[#88aa90] line-clamp-2 mt-2 leading-relaxed">
                    {item.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingItem ? "Edit Contributor" : "Add Contributor"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs text-[#88aa90] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => field("name", e.target.value)}
                placeholder="Student Name"
                className="w-full px-3 py-2 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#88aa90] mb-1">Role / Contribution *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => field("role", e.target.value)}
                placeholder="e.g. Core Developer, Lead Designer"
                className="w-full px-3 py-2 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs text-[#88aa90] mb-1">Team Name *</label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => field("teamName", e.target.value)}
                placeholder="e.g. Core Team, Web Team, Design Team"
                className="w-full px-3 py-2 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#88aa90] mb-1">Batch / Class</label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => field("batch", e.target.value)}
                placeholder="e.g. 2nd Year CSE"
                className="w-full px-3 py-2 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
          </div>

          {/* Photos — 2 side-by-side exactly like Team Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ImageUploader
              label="Carousel Photo *"
              value={formData.photoUrl}
              onChange={(url) => field("photoUrl", url)}
              placeholder="Shown on carousel card"
            />
            <ImageUploader
              label="Modal Spotlight Photo (Optional)"
              value={formData.modalPhotoUrl}
              onChange={(url) => field("modalPhotoUrl", url)}
              placeholder="Shown when card is clicked"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#88aa90] mb-1">Contribution Bio / Note</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => field("bio", e.target.value)}
              placeholder="What did they do to help the event succeed?"
              className="w-full px-3 py-2 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66] resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-mono text-[11px] text-[#88aa90] mb-1">GitHub URL</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => field("github", e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-2.5 py-1.5 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#88aa90] mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => field("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-2.5 py-1.5 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#88aa90] mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => field("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-2.5 py-1.5 bg-[#020703] border border-[#00ff66]/25 rounded-lg font-mono text-xs text-white placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#020703] border border-[#00ff66]/15">
            <button
              type="button"
              onClick={() => field("isPublished", !formData.isPublished)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                formData.isPublished ? "bg-[#00ff66]" : "bg-[#88aa90]/30"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.isPublished ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="font-mono text-xs text-[#88aa90]">
              {formData.isPublished ? "Visible on /contributors page" : "Hidden (Draft)"}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-mono text-xs text-[#88aa90] border border-[#00ff66]/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00ff66] text-black font-mono font-bold text-xs hover:bg-[#00ff66]/90 shadow-[0_0_10px_rgba(0,255,102,0.3)] disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {editingItem ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Dialog ──────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Contributor"
        message="Are you sure you want to remove this contributor from the Hall of Recognition?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
