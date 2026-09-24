import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== FIXING DATABASE IMAGE MAPPINGS & CLEANING FAKE DATA ===");

  const pubUploads = path.resolve("public/uploads");
  const srvUploads = path.resolve("server/public/uploads");
  fs.mkdirSync(pubUploads, { recursive: true });
  fs.mkdirSync(srvUploads, { recursive: true });

  // 1. Core Team Members Fix
  // Map members to valid files in public/uploads
  const memberFixes: Record<string, { photoUrl: string; modalPhotoUrl?: string }> = {
    // Himansh Ullal (Design Head)
    "cmu9larwm000g8pi0lufy9ata": {
      photoUrl: "/uploads/1789894958453-1789894958441-740377590.JPG",
      modalPhotoUrl: "/uploads/1789894958453-1789894958441-740377590.JPG",
    },
    // Nazim Ziya (Treasurer)
    "cmu9l4y3k00078pi0vwqpq9xx": {
      photoUrl: "/uploads/1789894767772-1789894767769-500922881.JPG",
      modalPhotoUrl: "/uploads/1789894767772-1789894767769-500922881.JPG",
    },
    // Raynell Lewis (Vice President)
    "cmu8n8hey000369p4fex5v93k": {
      photoUrl: "/uploads/1789894632201-1789894632199-393028110.JPG",
      modalPhotoUrl: "/uploads/1789894632201-1789894632199-393028110.JPG",
    },
    // Elston Pereria (2025-26 President)
    "cmuecpg7h004qdbils1n9qgff": {
      photoUrl: "/uploads/1789894527450-1789894527442-592799262.PNG",
      modalPhotoUrl: "/uploads/1789894527450-1789894527442-592799262.PNG",
    },
    // Ruben Saldanha (2025-26 Operation Lead)
    "cmuecrmw3004tdbilo6b5fmvy": {
      photoUrl: "/uploads/1789894906878-1789894906870-149002953.WEBP",
      modalPhotoUrl: "/uploads/1789894906878-1789894906870-149002953.WEBP",
    },
  };

  for (const [id, data] of Object.entries(memberFixes)) {
    try {
      await prisma.teamMember.update({
        where: { id },
        data,
      });
      console.log(`Updated TeamMember [${id}] -> ${data.photoUrl}`);
    } catch (e: any) {
      console.error(`Failed to update member ${id}:`, e.message);
    }
  }

  // 2. Clean up fake "Unknown" contributors in DB
  const fakeContributors = await prisma.contributor.findMany({
    where: {
      OR: [
        { name: { contains: "Unknown" } },
        { photoUrl: "undefined" },
        { photoUrl: null },
      ],
    },
  });

  if (fakeContributors.length > 0) {
    console.log(`Removing ${fakeContributors.length} fake "Unknown" contributor records...`);
    for (const c of fakeContributors) {
      await prisma.contributor.delete({ where: { id: c.id } });
    }
  }

  // Ensure valid contributors exist
  const countContrib = await prisma.contributor.count();
  if (countContrib === 0) {
    console.log("Seeding valid event contributors...");
    const sampleContributors = [
      {
        name: "Chinmayee",
        role: "Event Co-Lead & Track Winner",
        eventName: "Prompt Ops-2K26",
        department: "Computer Science & Engineering",
        batch: "1st Year CSE",
        photoUrl: "/uploads/1789894702997-1789894702996-571894562.JPG",
        bio: "Top honors in Track 1 of Prompt Ops-2K26; assisted in prompt engineering testbed documentation and peer mentoring.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 1,
        isPublished: true,
      },
      {
        name: "Chris Royston Monteiro",
        role: "Technical Evaluator",
        eventName: "Prompt Ops-2K26",
        department: "Computer Science & Engineering",
        batch: "2nd Year CSE",
        photoUrl: "/uploads/1789894527450-1789894527442-592799262.PNG",
        bio: "Designed evaluation criteria for image generation prompts and assisted in participant scoring automation.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 2,
        isPublished: true,
      },
      {
        name: "Harimurali K S",
        role: "API Security Challenge Lead",
        eventName: "Prompt Ops-2K26",
        department: "Computer Science & Engineering",
        batch: "3rd Year CSE",
        photoUrl: "/uploads/1789894632201-1789894632199-393028110.JPG",
        bio: "Built the adversarial Gemini prompt extraction challenges for Track 2 and configured live rate limiting.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 3,
        isPublished: true,
      },
      {
        name: "Venus Suhani D’Lima",
        role: "Stage & Logistics Coordinator",
        eventName: "Lumière — The Gala",
        department: "Computer Science & Engineering",
        batch: "2nd Year CSE",
        photoUrl: "/uploads/1790095282259-1790095282213-154511470.png",
        bio: "Coordinated stage arrangements, entry pass management, and hospitality for faculty guests during the branch entry gala.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 4,
        isPublished: true,
      },
      {
        name: "Deeksha Ravi Moger",
        role: "Creative Media & Banner Lead",
        eventName: "Lumière — The Gala",
        department: "Computer Science & Engineering",
        batch: "2nd Year CSE",
        photoUrl: "/uploads/1789895013484-1789895013480-405489443.JPG",
        bio: "Designed main stage backdrop visual assets, social media flyers, and coordinated lighting aesthetics.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 5,
        isPublished: true,
      },
      {
        name: "Venisha Snehal D’Souza",
        role: "Workshop Mentor",
        eventName: "Smart Contract Bootcamp",
        department: "Computer Science & Engineering",
        batch: "4th Year CSE",
        photoUrl: "/uploads/1789894702997-1789894702996-571894562.JPG",
        bio: "Helped 60+ junior students debug Hardhat smart contract deployments and Sepolia faucet transactions.",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        displayOrder: 6,
        isPublished: true,
      },
    ];

    for (const c of sampleContributors) {
      await prisma.contributor.create({ data: c });
    }
  }

  // 3. Mirror all files from public/uploads to server/public/uploads
  const files = fs.readdirSync(pubUploads);
  let mirrored = 0;
  for (const f of files) {
    const src = path.join(pubUploads, f);
    const dst = path.join(srvUploads, f);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dst);
      mirrored++;
    }
  }
  console.log(`Mirrored ${mirrored} files from public/uploads to server/public/uploads.`);

  console.log("Database image mappings fix complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
