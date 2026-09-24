import { prisma } from "./prisma.js";

const DEFAULT_LEADER_MAP: Record<string, { photoUrl: string; modalPhotoUrl?: string }> = {
  "Himansh Ullal": {
    photoUrl: "/assets/leaders/himansh.jpg",
    modalPhotoUrl: "/assets/leaders/himansh.jpg",
  },
  "Parthipan J": {
    photoUrl: "/assets/leaders/parthipan.jpg",
    modalPhotoUrl: "/assets/leaders/parthipan.jpg",
  },
  "Raynell Lewis": {
    photoUrl: "/assets/leaders/raynell.jpg",
    modalPhotoUrl: "/assets/leaders/raynell_modal.jpg",
  },
  "Nazmin Ziya": {
    photoUrl: "/assets/leaders/nazmin.jpg",
    modalPhotoUrl: "/assets/leaders/nazmin.jpg",
  },
  "Nazim Ziya": {
    photoUrl: "/assets/leaders/nazmin.jpg",
    modalPhotoUrl: "/assets/leaders/nazmin.jpg",
  },
  "Chaitra R M": {
    photoUrl: "/assets/leaders/chaitra.jpg",
    modalPhotoUrl: "/assets/leaders/chaitra.jpg",
  },
  "Jeslin Ninora": {
    photoUrl: "/assets/leaders/jeslin.jpg",
    modalPhotoUrl: "/assets/leaders/jeslin.jpg",
  },
  "Elston Pereira": {
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
  },
  "Elston Herold Pereira": {
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
  },
  "Elston Pereria": {
    photoUrl: "/assets/leaders/elston.jpg",
    modalPhotoUrl: "/assets/leaders/elston.jpg",
  },
  "Ruben Saldana": {
    photoUrl: "/assets/leaders/ruben.webp",
    modalPhotoUrl: "/assets/leaders/ruben.webp",
  },
  "Ruben Saldanha": {
    photoUrl: "/assets/leaders/ruben.webp",
    modalPhotoUrl: "/assets/leaders/ruben.webp",
  },
  "Shamita K V": {
    photoUrl: "/assets/leaders/shamitha.jpg",
    modalPhotoUrl: "/assets/leaders/shamitha.jpg",
  },
  "Shamitha K V": {
    photoUrl: "/assets/leaders/shamitha.jpg",
    modalPhotoUrl: "/assets/leaders/shamitha.jpg",
  },
};

export async function autoMigrateDatabaseImages() {
  try {
    console.log("[AutoMigrate] Verifying database media persistence...");

    // 1. Fix Team Members with broken /uploads/ URLs
    const members = await prisma.teamMember.findMany();
    for (const m of members) {
      const isPhotoBroken = !m.photoUrl || m.photoUrl.includes("/uploads/") || m.photoUrl === "null";
      const isModalBroken = !m.modalPhotoUrl || m.modalPhotoUrl.includes("/uploads/") || m.modalPhotoUrl === "null";

      if (isPhotoBroken || isModalBroken) {
        const defaultData = DEFAULT_LEADER_MAP[m.name];
        if (defaultData) {
          await prisma.teamMember.update({
            where: { id: m.id },
            data: {
              photoUrl: isPhotoBroken ? defaultData.photoUrl : m.photoUrl,
              modalPhotoUrl: isModalBroken ? (defaultData.modalPhotoUrl || defaultData.photoUrl) : m.modalPhotoUrl,
            },
          });
          console.log(`[AutoMigrate] Repaired TeamMember [${m.name}] image URLs.`);
        }
      }
    }

    // 2. Fix Event slides with broken /uploads/ URLs (assigning correct sequential slides per event)
    const slides = await prisma.eventSlide.findMany({
      include: { event: true },
    });
    for (const s of slides) {
      if (!s.imageUrl || s.imageUrl.includes("/uploads/")) {
        const title = (s.event?.title || "").toLowerCase();
        let fallbackUrl = "/assets/lumiere/slide_01.jpg";
        if (title.includes("lumière") || title.includes("lumiere")) {
          const num = String((s.order % 13) + 1).padStart(2, "0");
          fallbackUrl = `/assets/lumiere/slide_${num}.jpg`;
        } else if (title.includes("prompt")) {
          const num = String((s.order % 14) + 1).padStart(2, "0");
          fallbackUrl = `/assets/promptops/slide_${num}.jpg`;
        }

        await prisma.eventSlide.update({
          where: { id: s.id },
          data: { imageUrl: fallbackUrl },
        });
        console.log(`[AutoMigrate] Repaired EventSlide [${s.id}] image URL to ${fallbackUrl}.`);
      }
    }
  } catch (err) {
    console.error("[AutoMigrate] Error verifying database images:", err);
  }
}
