import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'search'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile / tablet screens (<1024px) or touch-only devices
    if (
      typeof window === 'undefined' ||
      window.innerWidth < 1024 ||
      !window.matchMedia('(pointer: fine)').matches ||
      ('ontouchstart' in window && window.innerWidth < 1024)
    ) {
      return;
    }

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        isVisible = false;
        setVisible(false);
      }
    };

    const handleTouch = () => {
      isVisible = false;
      setVisible(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        setVisible(true);
        currentX = targetX;
        currentY = targetY;
      }

      // Update inner dot immediately via direct transform (0 latency)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isSearchTrigger = target.closest('[data-cursor="search"]');
      const isClickable = target.closest('button, a, [role="button"], input, textarea, .clickable-card');

      const nextType = isSearchTrigger ? 'search' : isClickable ? 'hover' : 'default';
      setCursorType((prev) => (prev !== nextType ? nextType : prev));
    };

    const handleMouseLeave = () => {
      isVisible = false;
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth trailing animation loop using direct DOM transform (no React state updates in RAF!)
    const followMouse = () => {
      if (isVisible && window.innerWidth >= 1024) {
        currentX += (targetX - currentX) * 0.22;
        currentY += (targetY - currentY) * 0.22;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
      }
      animationFrameId = requestAnimationFrame(followMouse);
    };

    animationFrameId = requestAnimationFrame(followMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999999] overflow-hidden">
      {/* Outer Ring (smooth trailing via direct DOM transform) */}
      <div
        ref={ringRef}
        className={`fixed flex items-center justify-center rounded-full will-change-transform ${
          cursorType === 'search'
            ? 'w-10 h-10 -ml-5 -mt-5 border border-emerald-600 dark:border-[#00ff66] bg-emerald-600/15 dark:bg-[#00ff66]/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:shadow-[0_0_15px_#00ff66]'
            : cursorType === 'hover'
            ? 'w-9 h-9 -ml-[18px] -mt-[18px] border border-emerald-600 dark:border-[#00ff66] bg-emerald-600/20 dark:bg-[#00ff66]/15 shadow-[0_0_12px_rgba(16,185,129,0.3)] dark:shadow-[0_0_12px_#00ff66]'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 border border-emerald-600 dark:border-[#00ff66]/80 bg-transparent shadow-sm dark:shadow-[0_0_8px_rgba(0,255,102,0.4)]'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {cursorType === 'search' ? (
          <Search className="w-4 h-4 text-emerald-600 dark:text-[#00ff66] animate-pulse" />
        ) : null}
      </div>

      {/* Inner Dot (Instant tracking) */}
      {cursorType !== 'search' && (
        <div
          ref={dotRef}
          className="fixed w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-emerald-600 dark:bg-[#00ff66] shadow-[0_0_6px_rgba(16,185,129,0.5)] dark:shadow-[0_0_6px_#00ff66] will-change-transform"
          style={{ transform: 'translate3d(-100px, -100px, 0)' }}
        />
      )}
    </div>
  );
};
