import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, ExternalLink, ShieldCheck, Sparkles, Fingerprint } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons.tsx";
import { CyberDecryptedImage } from "./CyberDecryptedImage.tsx";
import { TeamMemberData } from "../data/teamMembers.ts";
import { useTheme } from "../context/ThemeContext.tsx";

interface Team3DWheelProps {
  members: TeamMemberData[];
  onSelectMember: (member: TeamMemberData) => void;
  compact?: boolean; // For Home page preview vs full Team page
  className?: string;
}

export const Team3DWheel: React.FC<Team3DWheelProps> = ({
  members,
  onSelectMember,
  compact = false,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Active floating offset (can be fractional during drag/animation)
  const [offset, setOffset] = useState<number>(0);
  const offsetRef = useRef<number>(0);
  offsetRef.current = offset;

  // Track dragging
  const isDraggingRef = useRef<boolean>(false);
  const startYRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animIdRef = useRef<number | null>(null);

  // User has interacted hint
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Active index rounded
  const activeIndex = Math.round(offset) % members.length;
  const normalizedActive = ((activeIndex % members.length) + members.length) % members.length;
  const activeMember = members[normalizedActive] || members[0];

  const total = members.length;

  // ── Inertia and Snapping Animation Loop ─────────────────────────────────────
  const snapTo = useCallback(
    (targetIndex: number) => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);

      const start = offsetRef.current;
      const change = targetIndex - start;
      const duration = 400; // ms
      const startTime = performance.now();

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const nextVal = start + change * easeOutCubic(progress);
        setOffset(nextVal);

        if (progress < 1) {
          animIdRef.current = requestAnimationFrame(step);
        } else {
          setOffset(targetIndex);
        }
      };

      animIdRef.current = requestAnimationFrame(step);
    },
    []
  );

  const startInertia = useCallback(() => {
    let vel = velocityRef.current;
    const friction = 0.92;

    const tick = () => {
      if (Math.abs(vel) > 0.002) {
        vel *= friction;
        setOffset((prev) => prev + vel);
        animIdRef.current = requestAnimationFrame(tick);
      } else {
        // Snap to closest integer
        const nearest = Math.round(offsetRef.current);
        snapTo(nearest);
      }
    };

    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    animIdRef.current = requestAnimationFrame(tick);
  }, [snapTo]);

  // ── Wheel Event (Prevent unwanted page scroll) ──────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setHasInteracted(true);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);

      const delta = e.deltaY * 0.0035;
      const newOffset = offsetRef.current + delta;
      setOffset(newOffset);

      // Debounced snap
      if (window.wheelTimeout) clearTimeout(window.wheelTimeout);
      window.wheelTimeout = setTimeout(() => {
        snapTo(Math.round(offsetRef.current));
      }, 120);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (window.wheelTimeout) clearTimeout(window.wheelTimeout);
    };
  }, [snapTo]);

  // ── Pointer Drag Handlers ──────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    velocityRef.current = 0;
    lastTimeRef.current = performance.now();
    setHasInteracted(true);

    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dy = e.clientY - lastYRef.current;

    // Movement sensitivity
    const moveOffset = -dy * 0.0045;
    velocityRef.current = moveOffset;

    setOffset((prev) => prev + moveOffset);

    lastYRef.current = e.clientY;
    lastTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    startInertia();
  };

  // ── Step buttons ───────────────────────────────────────────────────────────
  const stepPrev = () => {
    setHasInteracted(true);
    snapTo(Math.round(offset) - 1);
  };

  const stepNext = () => {
    setHasInteracted(true);
    snapTo(Math.round(offset) + 1);
  };

  // Dimensions
  const containerHeight = compact ? "h-[540px]" : "h-[680px] md:h-[720px]";
  const radiusY = compact ? 190 : 250;
  const radiusZ = compact ? 150 : 200;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${containerHeight} select-none overflow-hidden flex items-center justify-center ${className}`}
      style={{ perspective: "1200px" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background Holographic Ring Depth Grid */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full border border-[#00ff66]/10 animate-[spin_60s_linear_infinite]" />
        <div className="w-[360px] h-[360px] rounded-full border border-dashed border-[#00ff66]/15 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="w-[200px] h-[200px] rounded-full bg-radial from-[#00ff66]/10 to-transparent blur-2xl" />
      </div>

      {/* Interactive Guidance Hint (Fades out after user drag/scroll) */}
      <div
        className={`absolute top-4 inset-x-0 z-30 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
          hasInteracted ? "opacity-0" : "opacity-90"
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#00ff66]/40 text-[#00ff66] font-mono text-[11px] tracking-widest uppercase shadow-[0_0_15px_rgba(0,255,102,0.2)]">
          <Fingerprint className="w-3.5 h-3.5 animate-pulse text-[#00ff66]" />
          <span>DRAG VERTICALLY // SCROLL TO ROTATE WHEEL</span>
        </div>
      </div>

      {/* ── 3D Cylindrical Cards Wheel ────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-sm sm:max-w-md h-full flex items-center justify-center pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {members.map((member, index) => {
          // Calculate angle relative to current continuous offset
          // We wrap diff so cards appear in a smooth infinite-feeling cycle
          let diff = index - (offset % total);
          while (diff > total / 2) diff -= total;
          while (diff < -total / 2) diff += total;

          // Cylindrical angle
          const stepAngle = (2 * Math.PI) / Math.max(total, 6);
          const theta = diff * stepAngle;

          // Math transforms for vertical cylindrical curve
          const y = Math.sin(theta) * radiusY;
          const z = Math.cos(theta) * radiusZ - radiusZ;
          const rotateX = -theta * (180 / Math.PI) * 0.45;
          const cosTheta = Math.cos(theta);

          // Card visibility & depth
          const isFront = Math.abs(diff) < 0.45;
          const scale = 0.72 + 0.35 * Math.max(0, cosTheta);
          const opacity = cosTheta > 0 ? Math.pow(cosTheta, 1.4) : 0;
          const zIndex = Math.round(100 + 100 * cosTheta);
          const isVisible = cosTheta > -0.15;

          if (!isVisible) return null;

          return (
            <div
              key={member.id}
              onClick={(e) => {
                e.stopPropagation();
                if (isFront) {
                  onSelectMember(member);
                } else {
                  // Rotate wheel to center this card
                  snapTo(Math.round(offset) + Math.round(diff));
                }
              }}
              style={{
                transform: `translate3d(0px, ${y}px, ${z}px) rotateX(${rotateX}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                transition: isDraggingRef.current
                  ? "none"
                  : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
              }}
              className={`absolute w-[280px] sm:w-[320px] rounded-2xl p-5 cursor-pointer pointer-events-auto backdrop-blur-xl transition-colors duration-300 ${
                isFront
                  ? "bg-[#06140a]/95 border-2 border-[#00ff66] shadow-[0_0_40px_rgba(0,255,102,0.3)] ring-1 ring-[#00ff66]/50"
                  : "bg-[#040e06]/85 border border-[#00ff66]/25 hover:border-[#00ff66]/60 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,102,0.15)]"
              }`}
            >
              {/* Card Top Cyber Header */}
              <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-[#88aa90] mb-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFront
                        ? "bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pulse"
                        : "bg-[#88aa90]/40"
                    }`}
                  />
                  <span>
                    {member.codeName ? `// ${member.codeName}` : `// 0${index + 1}`}
                  </span>
                </div>
                <span className="text-[#00ff66] font-semibold">{member.teamYear}</span>
              </div>

              {/* Decrypted Portrait */}
              <div className="relative mb-4">
                <CyberDecryptedImage
                  src={member.photoUrl}
                  alt={member.name}
                  isActive={isFront}
                  aspectRatio="aspect-[4/3.8]"
                  showStatusBadge={isFront}
                />
              </div>

              {/* Member Identification */}
              <div className="text-center">
                <div className="font-mono text-xs font-bold tracking-widest text-[#00ff66] uppercase mb-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {member.role}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-sans truncate">
                  {member.name}
                </h3>
                <p className="font-mono text-[10px] text-[#88aa90] mt-0.5 truncate">
                  {member.department}
                </p>
              </div>

              {/* Card Footer: Socials & Action */}
              <div className="mt-4 pt-3 border-t border-[#00ff66]/15 flex items-center justify-between">
                <div
                  className="flex items-center gap-3 text-[#88aa90]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#00ff66] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#00ff66] transition-colors"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#00ff66] transition-colors"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Open Dossier Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMember(member);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] font-bold tracking-wider uppercase transition-all ${
                    isFront
                      ? "bg-[#00ff66] text-black hover:bg-[#00e65b] shadow-[0_0_10px_rgba(0,255,102,0.3)]"
                      : "bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66]/20 border border-[#00ff66]/30"
                  }`}
                >
                  <span>Dossier</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Vertical Step Controls on Right Side ─────────────────────────────── */}
      <div className="absolute right-4 sm:right-8 z-30 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={stepPrev}
          aria-label="Previous Team Member"
          className="w-10 h-10 rounded-full bg-[#040e06]/90 backdrop-blur-md border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_#00ff66] active:scale-95"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Mini Wheel Index Counter */}
        <div className="px-2.5 py-1 rounded bg-black/80 border border-[#00ff66]/25 font-mono text-[11px] text-[#00ff66] font-bold">
          {normalizedActive + 1} / {total}
        </div>

        <button
          type="button"
          onClick={stepNext}
          aria-label="Next Team Member"
          className="w-10 h-10 rounded-full bg-[#040e06]/90 backdrop-blur-md border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_#00ff66] active:scale-95"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    wheelTimeout?: NodeJS.Timeout | number;
  }
}
