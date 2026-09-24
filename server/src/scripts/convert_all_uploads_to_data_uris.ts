import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
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
  } catch (err) {
    console.error("Compression failed for:", filePath, err);
    return null;
  }
}

function resolveUploadPath(urlStr: string): string | null {
  if (!urlStr || !urlStr.includes("/uploads/")) return null;
  const filename = path.basename(urlStr);
  const possiblePaths = [
    path.resolve(process.cwd(), "public", "uploads", filename),
    path.resolve(process.cwd(), "server", "public", "uploads", filename),
    path.resolve(process.cwd(), "..", "public", "uploads", filename),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function main() {
  console.log("=== CONVERTING ALL DATABASE LOCAL UPLOADS TO COMPRESSED WEBP DATA URIS ===");

  // 1. Team Members
  const members = await prisma.teamMember.findMany();
  for (const m of members) {
    let updated = false;
    let photoUrl = m.photoUrl;
    let modalPhotoUrl = m.modalPhotoUrl;

    if (photoUrl && photoUrl.includes("/uploads/")) {
      const p = resolveUploadPath(photoUrl);
      if (p) {
        const dataUri = await fileToCompressedDataUri(p);
        if (dataUri) {
          photoUrl = dataUri;
          updated = true;
        }
      }
    }

    if (modalPhotoUrl && modalPhotoUrl.includes("/uploads/")) {
      const p = resolveUploadPath(modalPhotoUrl);
      if (p) {
        const dataUri = await fileToCompressedDataUri(p);
        if (dataUri) {
          modalPhotoUrl = dataUri;
          updated = true;
        }
      }
    }

    if (updated) {
      await prisma.teamMember.update({
        where: { id: m.id },
        data: { photoUrl, modalPhotoUrl },
      });
      console.log(`Updated TeamMember [${m.name}] (${m.teamYear}) to compressed WebP Data URI`);
    }
  }

  // 2. Events & Event Slides
  const slides = await prisma.eventSlide.findMany();
  for (const s of slides) {
    if (s.imageUrl && s.imageUrl.includes("/uploads/")) {
      const p = resolveUploadPath(s.imageUrl);
      if (p) {
        const dataUri = await fileToCompressedDataUri(p);
        if (dataUri) {
          await prisma.eventSlide.update({
            where: { id: s.id },
            data: { imageUrl: dataUri },
          });
          console.log(`Updated EventSlide [${s.id}] to compressed WebP Data URI`);
        }
      }
    }
  }

  const events = await prisma.event.findMany();
  for (const ev of events) {
    if (ev.posterUrl && ev.posterUrl.includes("/uploads/")) {
      const p = resolveUploadPath(ev.posterUrl);
      if (p) {
        const dataUri = await fileToCompressedDataUri(p);
        if (dataUri) {
          await prisma.event.update({
            where: { id: ev.id },
            data: { posterUrl: dataUri },
          });
          console.log(`Updated Event Poster [${ev.title}] to compressed WebP Data URI`);
        }
      }
    }
  }

  // 3. Media Assets
  const assets = await prisma.mediaAsset.findMany();
  let deletedOrphanedAssets = 0;

  for (const a of assets) {
    if (a.url && a.url.includes("/uploads/")) {
      const p = resolveUploadPath(a.url);
      if (p) {
        const dataUri = await fileToCompressedDataUri(p);
        if (dataUri) {
          await prisma.mediaAsset.update({
            where: { id: a.id },
            data: { url: dataUri },
          });
          console.log(`Updated MediaAsset [${a.filename}] to compressed WebP Data URI`);
        }
      } else {
        // File doesn't exist on disk -> clean up broken orphaned asset record!
        await prisma.mediaAsset.delete({ where: { id: a.id } });
        deletedOrphanedAssets++;
        console.log(`Removed broken orphaned MediaAsset [${a.filename}] (${a.id})`);
      }
    }
  }

  console.log(`\n=== CONVERSION COMPLETE ===`);
  console.log(`Successfully cleaned up ${deletedOrphanedAssets} broken orphaned media asset(s).`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error running conversion script:", err);
  process.exit(1);
});
