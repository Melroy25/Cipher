import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const members = await prisma.teamMember.findMany();
  for (const m of members) {
    console.log(`[${m.id}] ${m.name} (${m.role}):`);
    console.log(`  photoUrl: ${m.photoUrl ? m.photoUrl.substring(0, 60) + '... (length: ' + m.photoUrl.length + ')' : 'none'}`);
    console.log(`  modalPhotoUrl: ${m.modalPhotoUrl ? m.modalPhotoUrl.substring(0, 60) + '... (length: ' + m.modalPhotoUrl.length + ')' : 'none'}`);
  }
  await prisma.$disconnect();
}

run();
