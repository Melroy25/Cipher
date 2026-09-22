import React, { useEffect, useRef } from 'react';

interface RootAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RootAccessModal: React.FC<RootAccessModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 300);

    const chars = "ROOT_ACCESS_0123456789!@#$%^&*()_+{}|:<>?";
    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    let animId: number;

    const render = () => {
      ctx.fillStyle = "rgba(3, 8, 4, 0.25)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.9 ? "#ffffff" : "rgba(0, 255, 102, 0.4)";
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border-2 border-[#00ff66] bg-[#040e06] p-8 sm:p-10 shadow-[0_0_50px_rgba(0,255,102,0.4)] text-center overflow-hidden">
        
        {/* Background matrix canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-4xl sm:text-5xl font-extrabold text-[#00ff66] tracking-wider mb-6 text-glow-lg">
            ROOT ACCESS
          </h3>

          <p className="font-mono text-sm sm:text-base text-[#d0ecd5] leading-relaxed mb-8 max-w-md mx-auto">
            &gt; You found the backdoor. Welcome to the inner circle of <span className="text-[#00ff66] font-bold">CIPHER</span>. The real code was inside you all along.
          </p>

          <button
            onClick={onClose}
            className="font-mono text-xs sm:text-sm tracking-widest text-[#00ff66] hover:text-white px-5 py-2.5 rounded border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/20 transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)]"
          >
            [ CLOSE CONNECTION ]
          </button>
        </div>

      </div>
    </div>
  );
};
