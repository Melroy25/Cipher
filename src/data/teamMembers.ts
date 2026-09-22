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
  {
    id: "elston",
    name: "Elston Herold Pereira",
    role: "PRESIDENT",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Guiding the Cipher Club's strategic direction, student initiatives, and university-wide hackathons. Leads the executive council with a focus on technical innovation and community building.",
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 01 // OVERSEER",
    codeName: "SPECTRE",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "raynell",
    name: "Raynell Lewis",
    role: "VICE PRESIDENT",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Overseeing technical projects, workshop logistics, and collaboration with regional tech chapters. Spearheads inter-college event coordination and campus outreach.",
    photoUrl: "/assets/leaders/raynell.jpg",
    modalPhotoUrl: "/assets/leaders/raynell_modal.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 02 // OPERATIONS",
    codeName: "VANGUARD",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "chaitra",
    name: "Chaitra R M",
    role: "SECRETARY",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Managing club operations, official records, departmental communication, and event scheduling. Ensures every club initiative runs smoothly from planning to execution.",
    photoUrl: "/assets/leaders/chaitra.jpg",
    modalPhotoUrl: "/assets/leaders/chaitra.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 03 // REGISTRAR",
    codeName: "PROTOCOL",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "nazmin",
    name: "Nazmin Ziya",
    role: "TREASURER",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Handling financial planning, event allocations, and resource procurement for competitions. Manages sponsorships and ensures fiscal transparency for all club activities.",
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
    id: "jeslin",
    name: "Jeslin Ninora",
    role: "JOINT TREASURER",
    department: "Computer Science & Engineering",
    teamYear: "2025-26",
    bio: "Assisting financial administration, accounts reconciliation, and club funding sponsorships. Co-manages budget tracking and vendor coordination for all club events.",
    photoUrl: "/assets/leaders/jeslin.jpg",
    modalPhotoUrl: "/assets/leaders/jeslin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 04 // FISCAL OPS",
    codeName: "LEDGER",
    displayOrder: 5,
    isActive: true,
  },
  // ── 2024-25 Core Team ──────────────────────────────────────────────────────
  {
    id: "melroy-2024",
    name: "Melroy Almeida",
    role: "PRESIDENT",
    department: "Computer Science & Engineering",
    teamYear: "2024-25",
    bio: "Pioneered Cipher's regional coding tracks and built the initial club repository architecture.",
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 01 // OVERSEER",
    codeName: "ARCHITECT",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "ananya-2024",
    name: "Ananya Hegde",
    role: "VICE PRESIDENT",
    department: "Computer Science & Engineering",
    teamYear: "2024-25",
    bio: "Headed branding assets, visual identity, and community outreach for Cipher 2024.",
    photoUrl: "/assets/leaders/chaitra.jpg",
    modalPhotoUrl: "/assets/leaders/chaitra.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 02 // OPERATIONS",
    codeName: "AURORA",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "rohan-2024",
    name: "Rohan D'Souza",
    role: "SECRETARY",
    department: "Computer Science & Engineering",
    teamYear: "2024-25",
    bio: "Managed inter-college communications and organized university hackathons.",
    photoUrl: "/assets/leaders/raynell.jpg",
    modalPhotoUrl: "/assets/leaders/raynell_modal.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 03 // REGISTRAR",
    codeName: "CIPHERPUNK",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "shawn-2024",
    name: "Shawn Mendonca",
    role: "TREASURER",
    department: "Computer Science & Engineering",
    teamYear: "2024-25",
    bio: "Managed finance allocations, budget tracking, and event sponsorships.",
    photoUrl: "/assets/leaders/nazmin.jpg",
    modalPhotoUrl: "/assets/leaders/nazmin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 03 // FISCAL SEC",
    codeName: "EXCHEQUER",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "rachel-2024",
    name: "Rachel Pais",
    role: "JOINT TREASURER",
    department: "Computer Science & Engineering",
    teamYear: "2024-25",
    bio: "Assisted budget procurement and financial reporting for departmental competitions.",
    photoUrl: "/assets/leaders/jeslin.jpg",
    modalPhotoUrl: "/assets/leaders/jeslin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    clearanceLevel: "LEVEL 04 // FISCAL OPS",
    codeName: "LEDGER-X",
    displayOrder: 5,
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
          memoryTeamCache = parsed;
          return parsed;
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
            teamYear: m.teamYear || "2025-26",
            bio: m.bio || "",
            photoUrl: m.photoUrl || "/assets/leaders/elston.jpg",
            modalPhotoUrl: m.modalPhotoUrl || m.photoUrl,
            github: m.github || "",
            linkedin: m.linkedin || "",
            instagram: m.instagram || "",
            displayOrder: m.displayOrder || 0,
            isActive: m.isActive !== false,
          }));
          setCachedTeamMembers(mapped);
          return mapped;
        }
      }
    } catch {
      // Fallback
    } finally {
      activeFetchPromise = null;
    }
    return getCachedTeamMembers();
  })();

  return activeFetchPromise;
}

