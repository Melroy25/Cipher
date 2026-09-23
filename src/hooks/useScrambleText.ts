import { useState, useEffect, useRef } from 'react';

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#@*&$!";

export function useScrambleText(targetText: string, triggerOnView: boolean = true) {
  const [displayText, setDisplayText] = useState(targetText);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayText(targetText);
  }, [targetText]);

  const startScramble = () => {
    let iteration = 0;
    const maxIterations = targetText.length;
    
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return targetText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(targetText);
      }

      iteration += 1 / 2.5;
    }, 35);
  };

  useEffect(() => {
    if (!triggerOnView) {
      startScramble();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startScramble();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [targetText, hasAnimated, triggerOnView]);

  return { displayText, ref, replay: startScramble };
}
