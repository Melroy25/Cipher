import React, { useEffect, useState, useRef } from 'react';

interface IntroBootProps {
  onComplete: () => void;
}

const TERMINAL_LINES = [
  "establishing connection...",
  "authenticating access...",
  "decrypting CIPHER_v1.0...",
  "loading modules... [==========] 100%",
  "access granted"
];

const CIPHER_STEPS = ["C ] Φ", "C ] P H", "C ] P H E R", "C I P H E R"];

export const IntroBoot: React.FC<IntroBootProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'typing' | 'cipher' | 'shutoff'>('typing');
  const [cipherStep, setCipherStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix Rain Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ[]{}<>=+*^";
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    let animId: number;

    const render = () => {
      ctx.fillStyle = "rgba(3, 8, 4, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Highlight head of rain
        if (Math.random() > 0.85) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = "#00ff66";
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Terminal Typing Logic
  useEffect(() => {
    if (phase !== 'typing') return;

    if (currentLineIndex < TERMINAL_LINES.length) {
      const fullLine = TERMINAL_LINES[currentLineIndex];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex <= fullLine.length) {
          setTypedText(fullLine.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setLines(prev => [...prev, fullLine]);
            setTypedText("");
            setCurrentLineIndex(prev => prev + 1);
          }, 180);
        }
      }, 25);

      return () => clearInterval(typeInterval);
    } else {
      // Completed terminal lines -> transition to CIPHER scramble
      const timer = setTimeout(() => {
        setPhase('cipher');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, phase]);

  // Cipher Scramble Steps
  useEffect(() => {
    if (phase !== 'cipher') return;

    if (cipherStep < CIPHER_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCipherStep(prev => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      // Hold the final "C I P H E R" for 800ms, then trigger CRT collapse
      const timer = setTimeout(() => {
        setPhase('shutoff');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [phase, cipherStep]);

  // Handle CRT shutoff completion
  useEffect(() => {
    if (phase === 'shutoff') {
      const timer = setTimeout(() => {
        onComplete();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#030804] select-none ${
        phase === 'shutoff' ? 'animate-crt-off' : ''
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />

      {/* Terminal Content */}
      {phase === 'typing' && (
        <div className="relative z-10 w-full max-w-xl px-8 font-mono text-base md:text-lg text-[#00ff66] text-glow">
          {lines.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              &gt; {line}
            </div>
          ))}
          {currentLineIndex < TERMINAL_LINES.length && (
            <div className="leading-relaxed flex items-center">
              &gt; {typedText}
              <span className="inline-block w-2.5 h-4 ml-1 bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* Scramble Title Reveal */}
      {phase === 'cipher' && (
        <div className="relative z-10 font-serif text-3xl sm:text-5xl md:text-8xl tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.35em] text-[#00ff66] text-glow-lg font-bold whitespace-nowrap px-4">
          {CIPHER_STEPS[cipherStep]}
        </div>
      )}

      {/* CRT Central Collapse Dot while shutoff */}
      {phase === 'shutoff' && (
        <div className="relative z-10 w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_20px_#00ff66]" />
      )}

      {/* Skip Button */}
      {phase !== 'shutoff' && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-20 font-mono text-sm md:text-base text-[#00ff66]/80 hover:text-[#00ff66] tracking-wider transition-colors px-3 py-1 border border-transparent hover:border-[#00ff66]/40 rounded"
        >
          [ SKIP &gt; ]
        </button>
      )}
    </div>
  );
};
