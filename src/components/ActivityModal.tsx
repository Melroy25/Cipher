import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setCurrentSlide(0);
  }, [activity]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (activity) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
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
    if (totalPhotos > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalPhotos);
    }
  };

  const prevSlide = () => {
    if (totalPhotos > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalPhotos) % totalPhotos);
    }
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

                {/* Photo Viewer */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                  <img
                    src={photos[currentSlide]}
                    alt={`${activity.title} photo ${currentSlide + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/promptops/slide_01.jpg";
                    }}
                  />

                  {/* Navigation Arrows for Multi-image */}
                  {totalPhotos > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-[#00ff66]/40 hover:scale-105 transition-all"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#00ff66]" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-[#00ff66]/40 hover:scale-105 transition-all"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4 text-[#00ff66]" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Row if more than 1 photo */}
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
