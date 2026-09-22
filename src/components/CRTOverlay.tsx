import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden dark:block">
      {/* Scanlines - subtle opacity for text readability */}
      <div className="absolute inset-0 crt-scanlines opacity-15" />
      {/* Subtle Vignette */}
      <div className="absolute inset-0 crt-vignette opacity-35" />
      {/* CRT screen glow edge */}
      <div className="absolute inset-0 border border-[#00ff66]/10 pointer-events-none" />
    </div>
  );
};
