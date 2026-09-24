import React, { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons.tsx";
import { ContributorData } from "./ContributorDetailModal.tsx";
import { useTheme } from "../context/ThemeContext.tsx";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' fill='%2306140a'/%3E%3Ccircle cx='120' cy='85' r='45' fill='%2300ff66' fill-opacity='0.25' stroke='%2300ff66' stroke-width='2'/%3E%3Cpath d='M40 210 c0 -45 35 -75 80 -75 s80 30 80 75' fill='%2300ff66' fill-opacity='0.18' stroke='%2300ff66' stroke-width='2'/%3E%3C/svg%3E";

interface Contributors3DCarouselProps {
  contributors: ContributorData[];
  onSelectContributor: (c: ContributorData) => void;
  isLoading?: boolean;
}

export const Contributors3DCarousel: React.FC<Contributors3DCarouselProps> = ({
  contributors,
  onSelectContributor,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [angle, setAngle] = useState(0);
  const angleRef = useRef(0);
  angleRef.current = angle;

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const total = contributors.length;

  // Responsive radius carefully calibrated so cards fit on mobile screens without clipping
  const [radius, setRadius] = useState({ rx: 460, rz: 130 });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setRadius({ rx: 300, rz: 80 });
      } else if (w < 640) {
        setRadius({ rx: 360, rz: 100 });
      } else if (w < 1024) {
        setRadius({ rx: 300, rz: 95 });
      } else {
        setRadius({ rx: 460, rz: 130 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Auto-rotation + momentum
  useEffect(() => {
    let lastTime = performance.now();
    const AUTO_SPEED = 0.003; // Smooth continuous auto-spin

    const loop = (now: number) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      if (!document.hidden && !isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.0003) {
          velocityRef.current *= 0.955; // Silky fluid momentum with natural glide
          angleRef.current += velocityRef.current * (dt / 16);
        } else {
          velocityRef.current = 0;
          angleRef.current += AUTO_SPEED * (dt / 16);
        }
        setAngle(angleRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const hasDraggedRef = useRef(false);
  const totalDragDistanceRef = useRef(0);
  const lastTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pointer drag to spin the 3D ring with fast, responsive touch support
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    totalDragDistanceRef.current = 0;
    velocityRef.current = 0;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastTimeRef.current);
    const dx = e.clientX - lastXRef.current;
    totalDragDistanceRef.current += Math.abs(dx);
    if (totalDragDistanceRef.current > 4) {
      hasDraggedRef.current = true;
    }

    // Touch devices require higher angle velocity multiplier for fast, responsive finger swipes
    const isTouch = e.pointerType === "touch" || window.innerWidth < 768;
    const sensitivity = isTouch ? 2.5 : 1.4;
    const deltaAngle = (dx / radius.rx) * sensitivity;

    angleRef.current += deltaAngle;
    setAngle(angleRef.current);

    // Exponential moving average for flick release velocity
    const instantVelocity = (deltaAngle / dt) * 16;
    velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Boost flick momentum on touch release so a quick finger flick spins the cards fast
    const isTouch = e.pointerType === "touch" || window.innerWidth < 768;
    if (isTouch) {
      velocityRef.current = Math.max(-0.11, Math.min(0.11, velocityRef.current * 1.45));
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
      totalDragDistanceRef.current = 0;
    }, 100);
  };

  if (total === 0) {
    if (isLoading) {
      return (
        <div className="py-12 flex items-center justify-center gap-3 text-sm font-mono opacity-50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
        </div>
      );
    }
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-4 opacity-60">
        <Heart className="w-12 h-12 text-emerald-500" />
        <p className="text-sm font-mono text-emerald-400">No contributors yet. Add one!</p>
      </div>
    );
  }


  return (
    <div className="w-full overflow-hidden">
    <div
      ref={containerRef}
      className="relative w-full h-[370px] xs:h-[390px] sm:h-[450px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-visible"
      style={{ perspective: "1000px" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Subtle Holographic Axis Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
        <div
          className="w-[340px] sm:w-[720px] md:w-[960px] h-[140px] sm:h-[220px] md:h-[320px] rounded-full border border-[#00ff66]/20"
          style={{ transform: "rotateX(72deg)" }}
        />
        <div
          className="w-[260px] sm:w-[540px] md:w-[720px] h-[100px] sm:h-[160px] md:h-[220px] rounded-full border border-dashed border-[#00ff66]/25"
          style={{ transform: "rotateX(72deg)" }}
        />
      </div>

      {/* Interactive 3D Orbit Track */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {contributors.map((contributor, i) => {
          const cardAngle = angle + (i * 2 * Math.PI) / total;
          const sin = Math.sin(cardAngle);
          const cos = Math.cos(cardAngle);

          const x = sin * radius.rx;
          const z = cos * radius.rz;
          const normZ = (cos + 1) / 2; // 0 = back, 1 = front

          const scale = 0.58 + 0.45 * normZ;
          const opacity = 0.35 + 0.65 * normZ;
          const zIndex = Math.round(normZ * 100);
          const isFront = cos > 0.72;

          const rotateY = -(sin * 24);

          return (
            <div
              key={contributor.id || i}
              onClick={(e) => {
                e.stopPropagation();
                if (hasDraggedRef.current || totalDragDistanceRef.current > 5) return;
                onSelectContributor(contributor);
              }}
              style={{
                transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: `brightness(${0.5 + 0.55 * normZ})`,
                transition: isDraggingRef.current ? "none" : "filter 0.2s ease",
              }}
              className={`absolute w-[180px] xs:w-[195px] sm:w-[245px] h-[295px] xs:h-[315px] sm:h-[360px] p-3 sm:p-4 rounded-2xl cursor-pointer backdrop-blur-xl transition-shadow duration-300 flex flex-col justify-between ${
                isDark
                  ? isFront
                    ? "bg-[#06140a]/95 border-2 border-[#00ff66] shadow-[0_0_35px_rgba(0,255,102,0.35)] ring-1 ring-[#00ff66]/40"
                    : "bg-[#040e06]/85 border border-[#00ff66]/20 hover:border-[#00ff66]/50 shadow-md"
                  : isFront
                  ? "bg-white border-2 border-emerald-500 shadow-2xl"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              {/* Top part: Rectangular Photo + Event Badge */}
              <div className="w-full">
                <div
                  className={`relative w-full h-28 xs:h-32 sm:h-40 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isFront ? "border-[#00ff66]/70 shadow-[0_0_15px_rgba(0,255,102,0.25)]" : "border-[#00ff66]/20"
                  }`}
                >
                  <img
                    src={contributor.photoUrl || DEFAULT_AVATAR}
                    alt={contributor.name}
                    width={245}
                    height={160}
                    loading={i < 4 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="w-full h-full object-cover object-top pointer-events-none select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Corner cyber reticles */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#00ff66]/80 pointer-events-none" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#00ff66]/80 pointer-events-none" />

                  {/* Team / Category Tag (if present) */}
                  {(contributor.teamName || contributor.eventName) && (
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 truncate">
                      <span className="inline-block max-w-full truncate px-1.5 py-0.5 rounded text-[8px] xs:text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                        {contributor.teamName || contributor.eventName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle part: Name & Role */}
              <div className="text-center my-auto py-1 px-0.5">
                <h3
                  className="text-sm xs:text-base sm:text-lg font-bold leading-tight font-sans line-clamp-1"
                  style={{ color: isDark ? "#ffffff" : "#000000" }}
                >
                  {contributor.name}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase mt-0.5 sm:mt-1 text-emerald-600 dark:text-[#00ff66] line-clamp-1">
                  {contributor.role}
                </p>
                {(contributor.batch || contributor.department) && (
                  <p
                    className="text-[8px] xs:text-[9px] sm:text-[10px] font-sans truncate mt-0.5"
                    style={{ color: isDark ? "#88aa90" : "#6b7280" }}
                  >
                    {contributor.batch || contributor.department}
                  </p>
                )}
              </div>

              {/* Bottom part: Socials (only shown if provided) */}
              <div className="pt-2 border-t border-[#00ff66]/15 flex items-center justify-center gap-2.5 sm:gap-3 min-h-[28px] sm:min-h-[32px]">
                {contributor.linkedin && contributor.linkedin.trim() && (
                  <a
                    href={contributor.linkedin.trim()}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {contributor.github && contributor.github.trim() && (
                  <a
                    href={contributor.github.trim()}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {contributor.instagram && contributor.instagram.trim() && (
                  <a
                    href={contributor.instagram.trim()}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};
