import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const members = await prisma.teamMember.findMany({ where: { isActive: true } });
  const pubUploads = path.resolve("public/uploads");
  const srvUploads = path.resolve("server/public/uploads");

  console.log("Checking 11 core team member photos...");
  for (const m of members) {
    const filename = path.basename(m.photoUrl);
    const pubPath = path.join(pubUploads, filename);
    const srvPath = path.join(srvUploads, filename);

    const pubExists = fs.existsSync(pubPath);
    const srvExists = fs.existsSync(srvPath);

    console.log(`[${m.name} (${m.teamYear})]: URL="${m.photoUrl}"`);
    console.log(`  - public/uploads/${filename}: ${pubExists ? "EXISTS (" + fs.statSync(pubPath).size + " bytes)" : "MISSING"}`);
    console.log(`  - server/public/uploads/${filename}: ${srvExists ? "EXISTS (" + fs.statSync(srvPath).size + " bytes)" : "MISSING"}`);
  }
}

run().finally(() => prisma.$disconnect());
