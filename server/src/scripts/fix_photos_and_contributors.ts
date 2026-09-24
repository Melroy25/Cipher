import { PrismaClient } from "@prisma/client";
import fs from "fs";
import sharp from "sharp";

const prisma = new PrismaClient();

async function fileToDataUri(filePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(filePath)) return null;
    const buf = await sharp(filePath)
      .resize({ width: 800, height: 1000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    return `data:image/webp;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Fixing Himansh Ullal's photoUrl ===");

  // Fix Himansh: his photoUrl is broken /uploads/ path
  const himansh = await prisma.teamMember.findFirst({ where: { name: "Himansh Ullal" } });
  if (himansh) {
    console.log("Current photoUrl:", himansh.photoUrl?.substring(0, 60));
    // Use the modal photo (already a data URI) as primary photo too, or use the static asset
    const staticPath = "E:/Cipher Website/Cipher/public/assets/leaders/himansh_proper.webp";
    const dataUri = await fileToDataUri(staticPath);
    if (dataUri) {
      await prisma.teamMember.update({
        where: { id: himansh.id },
        data: { photoUrl: dataUri },
      });
      console.log("✅ Updated Himansh photoUrl to data URI from himansh_proper.webp");
    } else {
      // fallback: use same modalPhotoUrl
      if (himansh.modalPhotoUrl && himansh.modalPhotoUrl.startsWith("data:")) {
        await prisma.teamMember.update({
          where: { id: himansh.id },
          data: { photoUrl: himansh.modalPhotoUrl },
        });
        console.log("✅ Updated Himansh photoUrl to match modalPhotoUrl");
      }
    }
  }

  // Fix other team members with broken /uploads/ photoUrls
  const members = await prisma.teamMember.findMany();
  const LEADER_MAP: Record<string, string> = {
    "Raynell Lewis": "/assets/leaders/raynell.jpg",
    "Nazim Ziya": "/assets/leaders/nazmin.jpg",
    "Nazmin Ziya": "/assets/leaders/nazmin.jpg",
    "Parthipan J": "/assets/leaders/parthipan.jpg",
  };
  for (const m of members) {
    if (m.photoUrl && m.photoUrl.includes("/uploads/")) {
      // Check if we have a modalPhotoUrl that is already a data URI
      if (m.modalPhotoUrl && m.modalPhotoUrl.startsWith("data:")) {
        await prisma.teamMember.update({
          where: { id: m.id },
          data: { photoUrl: m.modalPhotoUrl },
        });
        console.log(`✅ Updated ${m.name} photoUrl to match their modalPhotoUrl`);
      } else if (LEADER_MAP[m.name]) {
        await prisma.teamMember.update({
          where: { id: m.id },
          data: { photoUrl: LEADER_MAP[m.name] },
        });
        console.log(`✅ Updated ${m.name} photoUrl to static asset`);
      }
    }
  }

  // Delete fake "Unknown" contributors
  console.log("\n=== Deleting fake Unknown contributors ===");
  const fakeContribs = await prisma.contributor.findMany({
    where: {
      OR: [
        { name: { startsWith: "Unknown" } },
        { name: "" },
      ],
    },
  });
  if (fakeContribs.length > 0) {
    const ids = fakeContribs.map((c) => c.id);
    await prisma.contributor.deleteMany({ where: { id: { in: ids } } });
    console.log(`✅ Deleted ${ids.length} fake/unnamed contributors`);
  } else {
    console.log("No fake contributors found");
  }

  // Also list all remaining contributors
  const allContribs = await prisma.contributor.findMany();
  console.log(`\nRemaining contributors (${allContribs.length}):`);
  for (const c of allContribs) {
    console.log(`  - ${c.name} (${c.role})`);
  }

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
