import React, { useState, useEffect } from "react";
import { adminFetch } from "../lib/api.ts";
import { Upload, Trash2, Copy, Check, ExternalLink, Image as ImageIcon, Loader2, CheckSquare, Square, XCircle } from "lucide-react";
import { ImageUploader } from "../components/ImageUploader.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { useToast } from "../context/ToastContext.tsx";

interface MediaAsset {
  id: string;
  url: string;
  publicId?: string | null;
  filename: string;
  format?: string | null;
  sizeBytes?: number | null;
  createdAt: string;
}

export const MediaPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadValue, setUploadValue] = useState("");

  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const { success, error } = useToast();

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/media", { });
      const data = await res.json();
      if (res.ok && data.success) {
        setAssets(data.data || []);
      }
    } catch {
      error("Failed to load media assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await adminFetch(`/api/admin/media/${deleteId}`, {
        method: "DELETE",
        });
      if (res.ok) {
        success("Media asset deleted.");
        setDeleteId(null);
        loadMedia();
      } else {
        error("Failed to delete media asset.");
      }
    } catch {
      error("Network error deleting media.");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(assets.map((a) => a.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    let failed = 0;
    for (const id of Array.from(selectedIds)) {
      try {
        const res = await adminFetch(`/api/admin/media/${id}`, { method: "DELETE" });
        if (!res.ok) failed++;
      } catch {
        failed++;
      }
    }
    setIsBulkDeleting(false);
    setConfirmBulkDelete(false);
    setSelectedIds(new Set());
    setSelectMode(false);
    if (failed === 0) {
      success(`Deleted ${selectedIds.size} asset(s) successfully.`);
    } else {
      error(`Deleted with ${failed} failure(s). Refresh to check.`);
    }
    loadMedia();
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return "--";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Media Asset Library</h2>
          <p className="font-mono text-xs text-[#88aa90]">
            Upload and manage photographs, logos, posters, and gallery slides
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-[#030905] p-6 rounded-xl border border-[#00ff66]/20">
        <ImageUploader
          label="Upload New Media File to Cloud / Storage"
          value={uploadValue}
          onChange={(url) => {
            setUploadValue(url);
            if (url) {
              loadMedia();
              setUploadValue("");
            }
          }}
        />
      </div>

      {/* Media Grid */}
      <div className="bg-[#030905] p-6 rounded-xl border border-[#00ff66]/20">
        {/* Grid Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-mono text-xs font-bold text-[#00ff66] tracking-wider uppercase">
            Stored Assets ({assets.length})
          </h3>
          {assets.length > 0 && !loading && (
            <div className="flex items-center gap-2">
              {selectMode ? (
                <>
                  <button
                    onClick={selectAll}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#040e06] border border-[#00ff66]/30 font-mono text-[11px] text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#040e06] border border-[#00ff66]/30 font-mono text-[11px] text-[#88aa90] hover:bg-[#00ff66]/10 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    None
                  </button>
                  {selectedIds.size > 0 && (
                    <button
                      onClick={() => setConfirmBulkDelete(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 font-mono text-[11px] text-white font-bold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Selected ({selectedIds.size})
                    </button>
                  )}
                  <button
                    onClick={exitSelectMode}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#040e06] border border-[#00ff66]/20 font-mono text-[11px] text-[#88aa90] hover:text-white transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectMode(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#040e06] border border-[#00ff66]/30 font-mono text-[11px] text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Select
                </button>
              )}
            </div>
          )}
        </div>

        {/* Select mode hint */}
        {selectMode && (
          <p className="font-mono text-[11px] text-[#88aa90] mb-3">
            {selectedIds.size === 0
              ? "Click images to select them"
              : `${selectedIds.size} image${selectedIds.size > 1 ? "s" : ""} selected`}
          </p>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
            <p className="font-mono text-xs text-[#88aa90]">Loading library...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-[#88aa90]">No media uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => selectMode && toggleSelect(item.id)}
                  className={`group relative rounded-xl bg-[#040e06] border transition-all overflow-hidden flex flex-col justify-between ${
                    selectMode ? "cursor-pointer" : ""
                  } ${
                    isSelected
                      ? "border-[#00ff66] ring-2 ring-[#00ff66]/40"
                      : "border-[#00ff66]/20 hover:border-[#00ff66]"
                  }`}
                >
                  <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/logo.png";
                      }}
                    />

                    {/* Select Mode — checkbox overlay */}
                    {selectMode && (
                      <div className="absolute inset-0 flex items-start justify-start p-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-[#00ff66] border-[#00ff66]"
                              : "bg-black/60 border-white/60"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                    )}

                    {/* Normal hover overlay */}
                    {!selectMode && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyUrl(item.id, item.url)}
                          className="p-2 rounded bg-[#00ff66] text-black font-mono text-xs hover:bg-[#00e65b] transition-colors"
                          title="Copy URL"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 border-t border-[#00ff66]/15">
                    <p className="font-mono text-[11px] font-bold text-white truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#88aa90] mt-1">
                      <span className="uppercase">{item.format || "IMG"}</span>
                      <span>{formatSize(item.sizeBytes)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Single delete confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        message="Are you sure you want to delete this media file? Any page referencing this URL directly will be affected."
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        isOpen={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.size} Asset${selectedIds.size > 1 ? "s" : ""}?`}
        message={`This will permanently delete ${selectedIds.size} selected media file${selectedIds.size > 1 ? "s" : ""}. Any pages referencing these URLs will be affected.`}
      />
    </div>
  );
};