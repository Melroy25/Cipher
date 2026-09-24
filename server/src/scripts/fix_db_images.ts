import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

async function fileToCompressedDataUri(filePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(filePath)) return null;
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".svg" || ext === ".gif") {
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = ext === ".svg" ? "image/svg+xml" : "image/gif";
      return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
    }

    const compressedBuffer = await sharp(filePath)
      .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return `data:image/webp;base64,${compressedBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== CLEANING DATABASE & REMOVING FAKE/DISCONTINUED DATA ===");

  // Clean up fake "Unknown" contributors in DB
  const fakeContributors = await prisma.contributor.findMany({
    where: {
      OR: [
        { name: { startsWith: "Unknown" } },
        { name: "" },
      ],
    },
  });

  if (fakeContributors.length > 0) {
    const ids = fakeContributors.map((c) => c.id);
    await prisma.contributor.deleteMany({
      where: { id: { in: ids } },
    });
    console.log(`Deleted ${ids.length} fake/unnamed contributor records.`);
  }

  // Delete orphaned MediaAsset records with missing local upload URLs
  const assets = await prisma.mediaAsset.findMany();
  for (const a of assets) {
    if (a.url && a.url.includes("/uploads/")) {
      await prisma.mediaAsset.delete({ where: { id: a.id } });
      console.log(`Deleted outdated local upload MediaAsset [${a.filename}]`);
    }
  }

  console.log("=== DB CLEANUP COMPLETE ===");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error in fix_db_images:", err);
  process.exit(1);
});
