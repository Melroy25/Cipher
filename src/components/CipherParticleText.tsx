import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import "./CipherParticles.css";

export const CipherParticleText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    type Particle = {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      char: string;
      size: number;
      baseAlpha: number;
      colorVariation: "neon" | "emerald" | "cyber";
      brightness: number;
      phase: number;
    };

    const particles: Particle[] = [];

    const mouse = {
      x: -2000,
      y: -2000,
      prevX: -2000,
      prevY: -2000,
      vx: 0,
      vy: 0,
      active: false,
      lastTime: 0,
    };

    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[];:/=*+-_~#$";

    const randomChar = () =>
      characters[Math.floor(Math.random() * characters.length)];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offscreen.width = Math.round(width);
      offscreen.height = Math.round(height);

      createParticles();
    };

    const createParticles = () => {
      particles.length = 0;
      offCtx.clearRect(0, 0, width, height);

      const maxPossibleWidth = width - 24;

      // Start with a font size that fills the canvas vertically (desktop style),
      // but shrink it until the full CIPHER text fits horizontally.
      const maxFontSize = Math.min(Math.round(height * 0.86), 235);
      let fontSize = Math.max(30, maxFontSize);

      offCtx.textBaseline = "middle";

      // Shrink-to-fit: measure actual rendered width, shrink until it fits
      let sumWidths = 0;
      let letterWidths: number[] = [];
      let letterGap = 0;
      const letters = "CIPHER".split("");

      for (let attempt = 0; attempt < 30; attempt++) {
        offCtx.font = `900 ${fontSize}px "Arial Black", Impact, "Segoe UI Black", "Inter", sans-serif`;
        letterWidths = letters.map((letter) => offCtx.measureText(letter).width);
        sumWidths = letterWidths.reduce((s, v) => s + v, 0);
        letterGap = Math.max(4, Math.round(fontSize * 0.07));
        const totalWidth = sumWidths + letterGap * (letters.length - 1);
        if (totalWidth <= maxPossibleWidth) break;
        fontSize = Math.max(24, Math.round(fontSize * 0.92)); // shrink 8% each step
      }

      letterGap = Math.max(4, Math.round(fontSize * 0.07));
      const naturalTotalWidth = sumWidths + letterGap * (letters.length - 1);

      // Center horizontally, vertically center in canvas
      let currentX = Math.max(0, (width - naturalTotalWidth) / 2);
      const centerY = height / 2;

      letters.forEach((letter, index) => {
        offCtx.textAlign = "left";
        offCtx.fillStyle = "#ffffff";
        offCtx.fillText(letter, currentX, centerY);
        currentX += letterWidths[index] + letterGap;
      });

      const image = offCtx.getImageData(0, 0, Math.round(width), Math.round(height));
      const data = image.data;

      const stepY = Math.max(8, Math.round(fontSize / 17));
      const stepX = Math.max(6, Math.round(fontSize / 20));
      const charSize = Math.max(6, Math.round(stepY * 0.78));

      const startY = (height % stepY) / 2 + stepY / 2;
      const startX = (width % stepX) / 2 + stepX / 2;

      for (let y = startY; y < height; y += stepY) {
        for (let x = startX; x < width; x += stepX) {
          const idx = (Math.floor(y) * Math.round(width) + Math.floor(x)) * 4;
          if (data[idx + 3] > 115) {
            const rand = Math.random();
            const colorVariation: "neon" | "emerald" | "cyber" =
              rand > 0.55 ? "neon" : rand > 0.25 ? "emerald" : "cyber";
            particles.push({
              x: Math.round(x),
              y: Math.round(y),
              originX: Math.round(x),
              originY: Math.round(y),
              vx: 0,
              vy: 0,
              char: randomChar(),
              size: charSize,
              baseAlpha: 0.65 + Math.random() * 0.35,
              colorVariation,
              brightness: 0.6 + Math.random() * 0.4,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const now = performance.now();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      if (mouse.x > -1000) {
        const dt = Math.max(8, Math.min(60, now - mouse.lastTime));
        mouse.vx = ((currentX - mouse.x) / dt) * 16.6;
        mouse.vy = ((currentY - mouse.y) / dt) * 16.6;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      } else {
        mouse.prevX = currentX;
        mouse.prevY = currentY;
      }

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
      mouse.lastTime = now;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      const now = performance.now();
      const currentX = touch.clientX - rect.left;
      const currentY = touch.clientY - rect.top;

      if (mouse.x > -1000) {
        const dt = Math.max(8, Math.min(60, now - mouse.lastTime));
        mouse.vx = ((currentX - mouse.x) / dt) * 16.6;
        mouse.vy = ((currentY - mouse.y) / dt) * 16.6;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      } else {
        mouse.prevX = currentX;
        mouse.prevY = currentY;
      }

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
      mouse.lastTime = now;
    };

    const handleTouchStart = (event: TouchEvent) => {
      handleTouchMove(event);
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (time: number) => {
      // Pause drawing when tab is in background to save GPU and battery
      if (document.hidden) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isDark = themeRef.current === "dark";

      // Interaction radius tuned to ~110px (within 90-130px specification)
      const radius = 110;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < radius && dist > 0) {
            const factor = 1 - dist / radius;
            const falloff = factor * factor;

            // 1. Softer, slower radial push away from the cursor
            const radialPush = falloff * 1.5;
            const dirX = dx / dist;
            const dirY = dy / dist;

            p.vx += dirX * radialPush;
            p.vy += dirY * radialPush;

            // 2. Gentle sweeping broom force aligned with cursor movement
            const speed = Math.hypot(mouse.vx, mouse.vy);
            const sweepStrength = Math.min(speed, 20) * 0.035;
            p.vx += mouse.vx * falloff * sweepStrength;
            p.vy += mouse.vy * falloff * sweepStrength;

            // 3. Subtle organic sand grain micro-dispersion
            const grainNoise =
              (Math.sin(p.originX * 91.3 + p.originY * 37.7) - 0.5) * 0.35;
            p.vx += grainNoise * falloff;
            p.vy += grainNoise * falloff;
          }
        }

        // Return force to home target position (gentler, slower return)
        const homeDX = p.originX - p.x;
        const homeDY = p.originY - p.y;
        const displacement = Math.hypot(homeDX, homeDY);

        // Limit maximum displacement gently
        if (displacement > 95) {
          const excess = (displacement - 95) * 0.07;
          p.vx += (homeDX / displacement) * excess;
          p.vy += (homeDY / displacement) * excess;
        }

        p.vx += homeDX * 0.015;
        p.vy += homeDY * 0.015;

        // Friction damping creates soft, fluid sand motion with slightly slower reaction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Snap precisely once settled to eliminate idle micro-jitter
        if (
          Math.abs(p.vx) < 0.01 &&
          Math.abs(p.vy) < 0.01 &&
          displacement < 0.25
        ) {
          p.x = p.originX;
          p.y = p.originY;
          p.vx = 0;
          p.vy = 0;
        }

        // Luminous shimmer and disturbance glow
        const shimmer = Math.sin(time * 0.0018 + p.phase) * 0.12;
        const isDisplaced = displacement > 2.5;

        if (isDark) {
          let alpha = Math.min(1, p.baseAlpha * p.brightness + shimmer);
          if (isDisplaced) {
            alpha = Math.min(1, alpha + 0.25);
          }
          ctx.globalAlpha = alpha;
          ctx.font = `${p.size}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          if (p.brightness > 0.88) {
            // Bright luminous matrix highlight glyphs seen in reference image
            ctx.fillStyle = "#bbf7d0";
            ctx.shadowColor = "#00ff88";
            ctx.shadowBlur = isDisplaced ? 8 : 4;
          } else if (p.colorVariation === "neon") {
            ctx.fillStyle = "#00ff88";
            ctx.shadowColor = "#00ff66";
            ctx.shadowBlur = isDisplaced ? 6 : 2;
          } else if (p.colorVariation === "emerald") {
            ctx.fillStyle = "#10b981";
            ctx.shadowColor = "#10b981";
            ctx.shadowBlur = isDisplaced ? 5 : 1;
          } else {
            ctx.fillStyle = "#34d399";
            ctx.shadowColor = "#00ff66";
            ctx.shadowBlur = isDisplaced ? 5 : 2;
          }
        } else {
          // LIGHT MODE: High-contrast, bold font, solid opacity & deep rich emerald tones
          const lightAlpha = isDisplaced
            ? 1.0
            : Math.min(1.0, Math.max(0.88, p.baseAlpha * 0.4 + 0.6 + shimmer * 0.15));
          ctx.globalAlpha = lightAlpha;
          ctx.font = `bold ${p.size}px "JetBrains Mono", Consolas, "Courier New", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowBlur = 0;

          if (isDisplaced) {
            ctx.fillStyle = "#059669"; // active vivid emerald on mouse hover
          } else if (p.brightness > 0.88) {
            ctx.fillStyle = "#022c22"; // deep intense dark emerald-950 for high contrast
          } else if (p.colorVariation === "neon") {
            ctx.fillStyle = "#064e3b"; // rich emerald-900
          } else if (p.colorVariation === "emerald") {
            ctx.fillStyle = "#065f46"; // cyber forest emerald-800
          } else {
            ctx.fillStyle = "#047857"; // bold emerald-700
          }
        }

        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Decay stale cursor velocity
      if (performance.now() - mouse.lastTime > 90) {
        mouse.vx *= 0.6;
        mouse.vy *= 0.6;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cipher-particles"
      aria-label="CIPHER animated particle text"
    />
  );
};

export const CipherParticles = CipherParticleText;
export default CipherParticleText;
