import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck, Key, Lock, Cpu, Globe, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons.tsx";
import { CyberDecryptedImage } from "./CyberDecryptedImage.tsx";
import { TeamMemberData } from "../data/teamMembers.ts";

interface ProfileDossierModalProps {
  member: TeamMemberData | null;
  onClose: () => void;
}

export const ProfileDossierModal: React.FC<ProfileDossierModalProps> = ({
  member,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!member) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#040e06] border-2 border-[#00ff66]/50 rounded-2xl shadow-[0_0_80px_rgba(0,255,102,0.3)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Cyber Telemetry Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#020703] border-b border-[#00ff66]/25 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#00ff66]">
            <Terminal className="w-4 h-4 text-[#00ff66] animate-pulse" />
            <span className="tracking-widest font-bold">// CIPHER // PERSONNEL DOSSIER</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] text-[#88aa90] px-2 py-0.5 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">
              SEC-LVL: 05
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
              aria-label="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Decrypted Portrait Column */}
            <div className="w-52 md:w-60 flex-shrink-0">
              <CyberDecryptedImage
                src={member.modalPhotoUrl || member.photoUrl}
                alt={member.name}
                isActive={true}
                aspectRatio="aspect-[3/4]"
                showStatusBadge={true}
              />
            </div>

            {/* Detailed Intelligence Info Column */}
            <div className="flex-1 min-w-0 text-center md:text-left space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-[11px] font-bold tracking-widest uppercase mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{member.role}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
                  {member.name}
                </h2>
                <p className="font-mono text-xs text-[#88aa90] mt-1">
                  {member.department} · {member.teamYear}
                </p>
              </div>

              {/* Bio / Mission statement */}
              <div className="p-4 rounded-xl bg-[#020603] border border-[#00ff66]/15 font-mono text-xs text-[#c2dfc9] leading-relaxed">
                <div className="text-[10px] text-[#00ff66] font-bold uppercase mb-1 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  MISSION DIRECTIVE //
                </div>
                <p>{member.bio || "Active core officer spearheading student development, technical workshops, and competitive programming initiatives."}</p>
              </div>

              {/* Cyber Security Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div className="p-2.5 rounded-lg bg-[#06140a] border border-[#00ff66]/15">
                  <span className="text-[#88aa90] block text-[9px]">CODENAME</span>
                  <span className="text-white font-bold">{member.codeName || "OPERATIVE"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#06140a] border border-[#00ff66]/15">
                  <span className="text-[#88aa90] block text-[9px]">ENCRYPTION STATUS</span>
                  <span className="text-[#00ff66] font-bold">VERIFIED 256-BIT</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06140a] border border-[#00ff66]/20 text-[#88aa90] hover:text-[#00ff66] hover:border-[#00ff66] transition-all font-mono text-xs"
                  >
                    <LinkedinIcon className="w-4 h-4 text-[#00ff66]" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06140a] border border-[#00ff66]/20 text-[#88aa90] hover:text-[#00ff66] hover:border-[#00ff66] transition-all font-mono text-xs"
                  >
                    <GithubIcon className="w-4 h-4 text-[#00ff66]" />
                    <span>GitHub</span>
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06140a] border border-[#00ff66]/20 text-[#88aa90] hover:text-[#00ff66] hover:border-[#00ff66] transition-all font-mono text-xs"
                  >
                    <InstagramIcon className="w-4 h-4 text-[#00ff66]" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#020703] border-t border-[#00ff66]/15 flex items-center justify-between font-mono text-[10px] text-[#88aa90]">
          <span className="flex items-center gap-1.5">
            <Key className="w-3 h-3 text-[#00ff66]" /> CIPHER SECURITY COUNCIL
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#00ff66] text-black font-bold uppercase tracking-wider hover:bg-[#00e65b] transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
