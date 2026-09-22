import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

export const TopographicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimeout: any;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let t = 0;

    const draw = () => {
      // Pause completely if tab is in the background
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const isDark = themeRef.current === 'dark';
      ctx.fillStyle = isDark ? '#030804' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      t += 0.003;

      // Adapt line count and step size based on viewport width for optimal 60fps
      const isMobile = width < 768;
      const lines = isMobile ? 35 : 55;
      const stepX = isMobile ? 24 : 20;

      for (let i = 0; i < lines; i++) {
        const lineFraction = i / lines;
        const baseY = height * 0.1 + lineFraction * height * 0.9;

        ctx.beginPath();
        if (isDark) {
          ctx.strokeStyle = `rgba(0, 255, 102, ${0.07 + (i % 3 === 0 ? 0.09 : 0.04)})`;
        } else {
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.09 + (i % 3 === 0 ? 0.08 : 0.04)})`;
        }
        ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.8;

        for (let x = 0; x <= width; x += stepX) {
          const nx = x / width;
          // Harmonic wave simulation mimicking Perlin elevation contours
          const wave1 = Math.sin(nx * 4.5 + t + i * 0.15) * 45;
          const wave2 = Math.cos(nx * 2.2 - t * 0.8 + i * 0.25) * 35;
          const wave3 = Math.sin(nx * 7.0 + i * 0.08 + t * 1.5) * 20;

          // Mountainous crest in upper-center & lower sides
          const centerWeight = Math.exp(-Math.pow((nx - 0.45) * 2.8, 2));
          const elevation = (wave1 + wave2 + wave3) * (0.8 + centerWeight * 1.8);

          const y = baseY + elevation;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleVisibility = () => {
      if (!document.hidden && !animationFrameId) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
