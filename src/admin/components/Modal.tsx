import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} bg-[#06140a] border border-[#00ff66]/40 rounded-xl shadow-[0_0_60px_rgba(0,255,102,0.25)] my-auto overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00ff66]/20 bg-[#040e07]">
          <h3 className="text-lg font-bold font-mono tracking-wider text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]"></span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto font-sans">{children}</div>
      </div>
    </div>,
    document.body
  );
};