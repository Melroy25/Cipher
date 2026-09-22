import React, { useEffect, useRef, useState } from "react";

interface CyberDecryptedImageProps {
  src: string;
  alt: string;
  isActive: boolean;
  className?: string;
  onDecrypted?: () => void;
  aspectRatio?: string; // e.g. "aspect-[3/4]"
  showStatusBadge?: boolean;
}

const HEX_CHARS = "0123456789ABCDEF!#_<>*%$";

export const CyberDecryptedImage: React.FC<CyberDecryptedImageProps> = ({
  src,
  alt,
  isActive,
  className = "",
  onDecrypted,
  aspectRatio = "aspect-[3/4]",
  showStatusBadge = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [statusText, setStatusText] = useState<string>("ENCRYPTED");
  const [isFullyRevealed, setIsFullyRevealed] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let startTime = 0;
    const TOTAL_DURATION = 1400; // ms
    const GRID_COLS = 12;
    const GRID_ROWS = 16;
    const totalTiles = GRID_COLS * GRID_ROWS;

    // Shuffle array of tile indices for progressive reveal
    const tileOrder: number[] = Array.from({ length: totalTiles }, (_, i) => i);
    for (let i = tileOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tileOrder[i], tileOrder[j]] = [tileOrder[j], tileOrder[i]];
    }

    let isCompleted = false;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / TOTAL_DURATION);

      // Resize canvas to match container
      const width = (canvas.width = canvas.offsetWidth || 300);
      const height = (canvas.height = canvas.offsetHeight || 400);

      // Clear
      ctx.fillStyle = "#020704";
      ctx.fillRect(0, 0, width, height);

      // If inactive, just show dark matrix stream or clean image if already seen
      if (!isActive) {
        if (img.complete && img.naturalWidth > 0) {
          ctx.globalAlpha = 0.35;
          ctx.drawImage(img, 0, 0, width, height);
          ctx.globalAlpha = 1.0;
        }
        // dark tint
        ctx.fillStyle = "rgba(2, 7, 4, 0.7)";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // ── ACTIVE DECRYPTION ANIMATION ──────────────────────────────
      if (progress < 0.25) {
        setStatusText("ACCESSING PROFILE...");
      } else if (progress < 0.85) {
        const pct = Math.floor((progress - 0.25) / 0.6 * 100);
        setStatusText(`DECRYPTING // ${pct}%`);
      } else {
        setStatusText("IDENTITY VERIFIED // L-5");
      }

      // Draw revealed image tiles
      if (img.complete && img.naturalWidth > 0) {
        const tileW = width / GRID_COLS;
        const tileH = height / GRID_ROWS;
        const imgTileW = img.naturalWidth / GRID_COLS;
        const imgTileH = img.naturalHeight / GRID_ROWS;

        // How many tiles are resolved based on progress (accelerates from 20% to 85%)
        let revealedCount = 0;
        if (progress > 0.2) {
          const decryptProgress = Math.min(1, (progress - 0.2) / 0.65);
          revealedCount = Math.floor(decryptProgress * totalTiles);
        }

        const revealedSet = new Set(tileOrder.slice(0, revealedCount));

        for (let row = 0; row < GRID_ROWS; row++) {
          for (let col = 0; col < GRID_COLS; col++) {
            const idx = row * GRID_COLS + col;
            const x = col * tileW;
            const y = row * tileH;

            if (revealedSet.has(idx)) {
              // Draw real image tile
              ctx.drawImage(
                img,
                col * imgTileW,
                row * imgTileH,
                imgTileW,
                imgTileH,
                x,
                y,
                tileW + 0.5,
                tileH + 0.5
              );

              // Subtle glitch border flash on newly resolved tile
              if (Math.random() < 0.08 && progress < 0.95) {
                ctx.strokeStyle = "rgba(0, 255, 102, 0.6)";
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, tileW, tileH);
              }
            } else {
              // Encrypted tile: matrix characters + green digital noise
              ctx.fillStyle = "rgba(3, 10, 5, 0.95)";
              ctx.fillRect(x, y, tileW, tileH);

              // Draw random matrix hex char
              ctx.fillStyle = Math.random() > 0.4 ? "#00ff66" : "#00aa44";
              ctx.font = `${Math.max(10, Math.floor(tileH * 0.55))}px monospace`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              const char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
              ctx.fillText(char, x + tileW / 2, y + tileH / 2);
            }
          }
        }
      }

      // ── SCANLINE LASER SWEEP ────────────────────────────────────
      const scanY = (elapsed % 800) / 800 * height;
      const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      gradient.addColorStop(0, "rgba(0, 255, 102, 0)");
      gradient.addColorStop(0.5, "rgba(0, 255, 102, 0.45)");
      gradient.addColorStop(1, "rgba(0, 255, 102, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 20, width, 40);

      // Bright laser line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // CRT horizontal scanlines overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      // Chromatic aberration glitch flash
      if (Math.random() < 0.12 && progress < 0.9) {
        ctx.fillStyle = "rgba(0, 255, 102, 0.12)";
        const sliceY = Math.random() * height;
        const sliceH = 10 + Math.random() * 20;
        ctx.fillRect(0, sliceY, width, sliceH);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        isCompleted = true;
        setIsFullyRevealed(true);
        if (onDecrypted) onDecrypted();

        // Draw final clean image with subtle cyber edge
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, width, height);
          // Very subtle CRT lines
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 1);
          }
        }
      }
    };

    setIsFullyRevealed(false);
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [src, isActive]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-[#020704] border border-[#00ff66]/30 ${aspectRatio} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block select-none pointer-events-none"
      />

      {/* Futuristic Corner Target Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00ff66] pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00ff66] pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00ff66] pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00ff66] pointer-events-none" />

      {/* Cyber Status HUD Badge */}
      {showStatusBadge && (
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#00ff66]/30 font-mono text-[10px] tracking-wider pointer-events-none">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFullyRevealed
                  ? "bg-[#00ff66] shadow-[0_0_8px_#00ff66]"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            <span
              className={`truncate font-bold ${
                isFullyRevealed ? "text-[#00ff66]" : "text-amber-400"
              }`}
            >
              {statusText}
            </span>
          </div>
          <span className="text-[#88aa90] text-[9px] opacity-70">
            {isFullyRevealed ? "VERIFIED" : "SYNC"}
          </span>
        </div>
      )}
    </div>
  );
};
