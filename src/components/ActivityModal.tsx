import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext.tsx";

export interface ActivityItem {
  id: string;
  numberId: string;
  title: string;
  description?: string;
  photoUrl?: string;
  photos?: string[];
  date?: string;
}

interface ActivityModalProps {
  activity: ActivityItem | null;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentSlide, setCurrentSlide] = useState(0);

  // Swipe / drag state
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const [dragOffset, setDragOffset] = useState(0); // live visual offset while dragging

  useEffect(() => {
    setCurrentSlide(0);
  }, [activity]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    if (activity) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activity, onClose]);

  if (!activity) return null;

  const photos = activity.photos && activity.photos.length > 0
    ? activity.photos
    : activity.photoUrl
    ? [activity.photoUrl]
    : [];

  const totalPhotos = photos.length;

  const nextSlide = () => {
    if (totalPhotos > 1) setCurrentSlide((prev) => (prev + 1) % totalPhotos);
  };

  const prevSlide = () => {
    if (totalPhotos > 1) setCurrentSlide((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  // ── Pointer drag handlers (mouse + touch via Pointer Events API) ──
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (totalPhotos <= 1) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragDistance.current = 0;
    isDragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || dragStartX.current === null || dragStartY.current === null) return;
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    // If primarily vertical drag → let it scroll (don't hijack)
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dragDistance.current) < 10) return;
    dragDistance.current = dx;
    // Rubber-band resistance: feel lighter at edges
    const maxOffset = 80;
    const clamped = Math.max(-maxOffset, Math.min(maxOffset, dx * 0.55));
    setDragOffset(clamped);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const threshold = 40; // px swipe needed to flip slide
    if (dragDistance.current < -threshold) {
      nextSlide();
    } else if (dragDistance.current > threshold) {
      prevSlide();
    } else if (Math.abs(dragDistance.current) < 8) {
      // Tap or click on photo -> advance to next slide with smooth slide transition
      nextSlide();
    }

    setDragOffset(0);
    dragStartX.current = null;
    dragStartY.current = null;
    dragDistance.current = 0;
  };

  const descriptionParagraphs = activity.description
    ? activity.description.split("\n\n").filter(Boolean)
    : [
        "Hands-on technical session hosted by the Cipher Student Association, providing practical exposure and deep-dive problem-solving for CSE students.",
      ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/70 dark:bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Backdrop Click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-gray-200 dark:border-[#00ff66]/30 bg-white dark:bg-[#050f07] text-gray-900 dark:text-white p-6 sm:p-8 md:p-10 shadow-2xl dark:shadow-[0_0_40px_rgba(0,255,102,0.2)] my-auto max-h-[90vh] overflow-y-auto transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl border border-gray-200 dark:border-[#00ff66]/30 text-gray-500 dark:text-[#00ff66] hover:bg-emerald-50 dark:hover:bg-[#00ff66]/20 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-widest text-emerald-600 dark:text-[#00ff66] font-bold">
            CIPHER // ACTIVITIES ARCHIVE
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-[#00ff66]/10 border border-emerald-200 dark:border-[#00ff66]/30 font-mono text-xs font-bold text-emerald-700 dark:text-[#00ff66]">
            ID: {activity.numberId}
          </span>
          {activity.date && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#0a1f0f] border border-gray-200 dark:border-[#00ff66]/20 font-mono text-xs text-gray-600 dark:text-[#88aa90]">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00ff66]" />
              {activity.date}
            </span>
          )}
        </div>

        {/* Modal Layout */}
        <div className={`grid grid-cols-1 ${totalPhotos > 0 ? "lg:grid-cols-12 gap-8" : "gap-6"} items-start`}>
          
          {/* Details Column */}
          <div className={totalPhotos > 0 ? "lg:col-span-7" : "w-full"}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight font-sans leading-tight">
              {activity.title}
            </h2>

            <div className="space-y-4 font-sans text-sm sm:text-base text-gray-700 dark:text-[#c4ded0] leading-relaxed">
              {descriptionParagraphs.map((para, idx) => (
                <p key={idx} className="leading-relaxed whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>

            {/* Department / Club Tag Footer */}
            <div className="mt-8 pt-5 border-t border-gray-100 dark:border-[#00ff66]/15 flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 dark:text-[#88aa90]">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-[#00ff66] font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Department of CSE · SJEC
              </span>
              <span>✦</span>
              <span>Cipher Student Association</span>
            </div>
          </div>

          {/* Photo Gallery Column (if photos exist) */}
          {totalPhotos > 0 && (
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-[#00ff66]/30 bg-gray-50 dark:bg-black shadow-md dark:shadow-[0_0_20px_rgba(0,255,102,0.15)] flex flex-col">
                
                {/* Photo Top Bar */}
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-200 dark:border-[#00ff66]/20 font-mono text-xs tracking-wider text-emerald-700 dark:text-[#00ff66]">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    PHOTO ATTACHMENT
                  </span>
                  {totalPhotos > 1 && (
                    <span>
                      {String(currentSlide + 1).padStart(2, "0")} / {String(totalPhotos).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* ── Swipeable Photo Viewer (Tap or Swipe to slide) ── */}
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 flex items-center justify-center select-none"
                  style={{ cursor: totalPhotos > 1 ? "pointer" : "default" }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  title={totalPhotos > 1 ? "Click or swipe to see next photo" : undefined}
                >
                  {/* Slide strip: smooth translateX sliding animation */}
                  <div
                    className="absolute inset-0 flex"
                    style={{
                      transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
                      transition: isDragging.current ? "none" : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                      width: `${totalPhotos * 100}%`,
                    }}
                  >
                    {photos.map((url, i) => (
                      <div key={i} className="relative flex-shrink-0 h-full" style={{ width: `${100 / totalPhotos}%` }}>
                        <img
                          src={url}
                          alt={`${activity.title} photo ${i + 1}`}
                          className="w-full h-full object-cover select-none pointer-events-none"
                          draggable={false}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/promptops/slide_01.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {totalPhotos > 1 && (
                    <>
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          prevSlide();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-[#00ff66]/40 hover:scale-105 transition-all z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#00ff66]" />
                      </button>
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextSlide();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-[#00ff66]/40 hover:scale-105 transition-all z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4 text-[#00ff66]" />
                      </button>

                      {/* Swipe hint label */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white/50 tracking-widest pointer-events-none select-none bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        TAP OR SWIPE TO EXPLORE →
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails Row */}
                {totalPhotos > 1 && (
                  <div className="p-2.5 bg-gray-100 dark:bg-[#020804] border-t border-gray-200 dark:border-[#00ff66]/20 flex items-center gap-2 overflow-x-auto">
                    {photos.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`relative rounded-md overflow-hidden w-12 h-10 border-2 shrink-0 transition-all ${
                          currentSlide === i
                            ? "border-emerald-500 dark:border-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.5)] scale-105"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
};

