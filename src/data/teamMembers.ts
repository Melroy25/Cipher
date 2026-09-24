export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  department: string;
  teamYear: string;
  bio: string;
  photoUrl: string;
  modalPhotoUrl?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  clearanceLevel?: string;
  codeName?: string;
  displayOrder: number;
  isActive: boolean;
}

export const DEFAULT_TEAM_MEMBERS: TeamMemberData[] = [
  // ── 2026-27 Core Team ──────────────────────────────────────────────────────
  {
    id: "cmu8n8hc8000269p4kl0ga8il",
    name: "Elston Pereira",
    role: "PRESIDENT",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Guiding the Cipher Club's strategic direction, student initiatives, and university-wide hackathons.",
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://linkedin.com",
    clearanceLevel: "LEVEL 01 // OVERSEER",
    codeName: "SPECTRE",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cmu8n8hey000369p4fex5v93k",
    name: "Raynell Lewis",
    role: "VICE PRESIDENT",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Overseeing technical projects, workshop logistics, and collaboration with regional tech chapters.",
    photoUrl: "/assets/leaders/raynell.jpg",
    modalPhotoUrl: "/assets/leaders/raynell_modal.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://linkedin.com",
    clearanceLevel: "LEVEL 02 // OPERATIONS",
    codeName: "VANGUARD",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cmu8n8hk9000469p4bm2xfdwe",
    name: "Chaitra R M",
    role: "SECRETARY",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Managing club operations, official records, departmental communication, and event scheduling.",
    photoUrl: "/assets/leaders/chaitra.jpg",
    modalPhotoUrl: "/assets/leaders/chaitra.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "",
    clearanceLevel: "LEVEL 03 // REGISTRAR",
    codeName: "PROTOCOL",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cmu9l4y3k00078pi0vwqpq9xx",
    name: "Nazim Ziya",
    role: "Treasurer",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Handling financial planning, event allocations, and resource procurement for competitions.",
    photoUrl: "/assets/leaders/nazmin.jpg",
    modalPhotoUrl: "/assets/leaders/nazmin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 03 // FISCAL SEC",
    codeName: "KEYVAULT",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "cmu8n8h9l000169p438t7725j",
    name: "Jeslin Ninora",
    role: "JOINT TREASURER",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Assisting financial administration, accounts reconciliation, and club funding sponsorships.",
    photoUrl: "/assets/leaders/jeslin.jpg",
    modalPhotoUrl: "/assets/leaders/jeslin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "",
    clearanceLevel: "LEVEL 04 // FISCAL OPS",
    codeName: "LEDGER",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "cmu9l89y2000a8pi0d3jnb1ng",
    name: "Ruben Saldana",
    role: "Operation Head",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Leading departmental operations, workshop environments, and infrastructure.",
    photoUrl: "/assets/leaders/ruben.jpg",
    modalPhotoUrl: "/assets/leaders/ruben.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 02 // OPERATIONS",
    codeName: "OPERATOR",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "cmu9la11b000e8pi0651y71cm",
    name: "Shamita K V",
    role: "Cultural Head",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Directing creative showcases, association galas, and inter-branch cultural events.",
    photoUrl: "/assets/leaders/shamitha.jpg",
    modalPhotoUrl: "/assets/leaders/shamitha.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "",
    clearanceLevel: "LEVEL 03 // CULTURAL",
    codeName: "CREATIVE",
    displayOrder: 8,
    isActive: true,
  },
  {
    id: "cmu9larwm000g8pi0lufy9ata",
    name: "Himansh Ullal",
    role: "Design Head",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Overseeing visual design, cyber aesthetics, posters, and association branding.",
    photoUrl: "/assets/leaders/himansh.jpg",
    modalPhotoUrl: "/assets/leaders/himansh.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 03 // DESIGN",
    codeName: "PIXEL",
    displayOrder: 9,
    isActive: true,
  },
  {
    id: "cmuegl9xu003m962kqz90kzeg",
    name: "Parthipan J",
    role: "Content Head",
    department: "Computer Science & Engineering",
    teamYear: "2026-27",
    bio: "Leading editorial documentation, association newsletters, and publication media.",
    photoUrl: "/assets/leaders/parthipan.jpg",
    modalPhotoUrl: "/assets/leaders/parthipan.jpg",
    github: "",
    linkedin: "",
    instagram: "",
    clearanceLevel: "LEVEL 03 // EDITORIAL",
    codeName: "SCRIBE",
    displayOrder: 11,
    isActive: true,
  },
  // ── 2025-26 Core Team ──────────────────────────────────────────────────────
  {
    id: "cmuecpg7h004qdbils1n9qgff",
    name: "Elston Pereria",
    role: "President",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Guiding the Cipher Club's strategic direction and university hackathons.",
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
    github: "",
    linkedin: "",
    instagram: "",
    clearanceLevel: "LEVEL 01 // OVERSEER",
    codeName: "SPECTRE",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cmuecrmw3004tdbilo6b5fmvy",
    name: "Ruben Saldanha",
    role: "Operation Lead",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Coordinating technical workshops and operational readiness.",
    photoUrl: "/assets/leaders/ruben.jpg",
    modalPhotoUrl: "/assets/leaders/ruben.jpg",
    github: "",
    linkedin: "",
    instagram: "",
    clearanceLevel: "LEVEL 02 // OPERATIONS",
    codeName: "VANGUARD",
    displayOrder: 2,
    isActive: true,
  },
];

// Global in-memory and session cache for instant zero-latency Core Team cards rendering
let memoryTeamCache: TeamMemberData[] | null = null;
let activeFetchPromise: Promise<TeamMemberData[]> | null = null;

export function getCachedTeamMembers(): TeamMemberData[] {
  if (memoryTeamCache && memoryTeamCache.length > 0) {
    return memoryTeamCache;
  }
  try {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cipher_team_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify none of the cached items contain broken ephemeral /uploads/ paths
          const hasBrokenPath = parsed.some((m: any) => m.photoUrl && m.photoUrl.includes("/uploads/"));
          if (!hasBrokenPath) {
            memoryTeamCache = parsed;
            return parsed;
          }
        }
      }
    }
  } catch {
    // Ignore session storage errors
  }
  return DEFAULT_TEAM_MEMBERS;
}

export function setCachedTeamMembers(members: TeamMemberData[]) {
  if (!Array.isArray(members) || members.length === 0) return;
  memoryTeamCache = members;
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cipher_team_cache", JSON.stringify(members));
    }
  } catch {
    // Ignore quota errors
  }
}

export async function fetchTeamMembersOptimized(): Promise<TeamMemberData[]> {
  // If an API request is already in-flight, return the existing promise (deduplication)
  if (activeFetchPromise) {
    return activeFetchPromise;
  }

  activeFetchPromise = (async () => {
    try {
      const res = await fetch("/api/public/members");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: TeamMemberData[] = json.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            department: m.department || "Computer Science & Engineering",
            teamYear: m.teamYear || "2026-27",
            bio: m.bio || "",
            photoUrl: m.photoUrl || "/assets/leaders/elston.jpg",
            modalPhotoUrl: m.modalPhotoUrl || m.photoUrl || "/assets/leaders/elston.jpg",
            github: m.github || "",
            linkedin: m.linkedin || "",
            instagram: m.instagram || "",
            clearanceLevel: m.role.toUpperCase().includes("PRESIDENT") ? "LEVEL 01 // OVERSEER" : "LEVEL 02 // OPERATIONS",
            codeName: m.name.substring(0, 4).toUpperCase(),
            displayOrder: m.displayOrder || 0,
            isActive: m.isActive ?? true,
          }));

          setCachedTeamMembers(mapped);
          return mapped;
        }
      }
    } catch {
      // Fall back gracefully to static DEFAULT_TEAM_MEMBERS
    }

    const cached = getCachedTeamMembers();
    return cached;
  })();

  try {
    return await activeFetchPromise;
  } finally {
    activeFetchPromise = null;
  }
}
