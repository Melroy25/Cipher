import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function run() {
  const himansh = await prisma.teamMember.findFirst({
    where: { name: "Himansh Ullal" },
  });
  if (himansh && himansh.modalPhotoUrl && himansh.modalPhotoUrl.startsWith("data:image")) {
    const base64Data = himansh.modalPhotoUrl.split(",")[1];
    fs.writeFileSync("E:/Cipher Website/Cipher/public/assets/leaders/himansh_proper.webp", Buffer.from(base64Data, "base64"));
    console.log("Successfully extracted modalPhotoUrl to himansh_proper.webp!");
  } else {
    console.log("No valid modalPhotoUrl found for Himansh");
  }
  await prisma.$disconnect();
}

run();
