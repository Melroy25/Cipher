import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  console.log("=== AUDITING ALL DATABASE IMAGE REFERENCES ===");

  const mediaAssets = await prisma.mediaAsset.findMany();
  console.log(`\nMediaAsset count: ${mediaAssets.length}`);
  mediaAssets.forEach((m) => {
    console.log(` - MediaAsset [${m.id}] ${m.filename}: ${m.url}`);
  });

  const teamMembers = await prisma.teamMember.findMany();
  console.log(`\nTeamMember count: ${teamMembers.length}`);
  teamMembers.forEach((m) => {
    console.log(` - TeamMember [${m.id}] ${m.name} (${m.teamYear}): photoUrl="${m.photoUrl}" modalPhotoUrl="${m.modalPhotoUrl}"`);
  });

  const events = await prisma.event.findMany({ include: { slides: true } });
  console.log(`\nEvent count: ${events.length}`);
  events.forEach((e) => {
    console.log(` - Event [${e.id}] ${e.title}: posterUrl="${e.posterUrl}" slides=${JSON.stringify(e.slides.map(s => s.imageUrl))}`);
  });

  const activities = await prisma.activity.findMany();
  console.log(`\nActivity count: ${activities.length}`);
  activities.forEach((a) => {
    console.log(` - Activity [${a.id}] ${a.title}: photoUrl="${a.photoUrl}"`);
  });

  const contributors = await prisma.contributor.findMany();
  console.log(`\nContributor count: ${contributors.length}`);
  contributors.forEach((c) => {
    console.log(` - Contributor [${c.id}] ${c.name}: avatarUrl="${c.avatarUrl}"`);
  });
}

run().finally(() => prisma.$disconnect());
