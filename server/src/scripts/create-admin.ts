import readline from "readline";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

async function askQuestion(query: string, hide = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

async function main() {
  console.log("=========================================");
  console.log("   Cipher Club - Create Admin Account    ");
  console.log("=========================================");

  let email = process.argv[2];
  let password = process.argv[3];
  let name = process.argv[4];

  if (!email) {
    email = await askQuestion("Enter Administrator Email: ");
  }
  if (!email || !email.includes("@")) {
    console.error("Error: Valid email address is required.");
    process.exit(1);
  }

  if (!name) {
    name = await askQuestion("Enter Administrator Name (default: Admin): ");
    if (!name) name = "Admin";
  }

  if (!password) {
    password = await askQuestion("Enter Secure Password (min 8 characters): ");
  }

  if (!password || password.length < 8) {
    console.error("Error: Password must be at least 8 characters.");
    process.exit(1);
  }

  console.log("\nHashing password securely with bcrypt (cost factor 12)...");
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log("Saving administrator account to database...");
  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: {
      passwordHash,
      name,
    },
    create: {
      email: email.toLowerCase(),
      name,
      passwordHash,
    },
  });

  console.log("-----------------------------------------");
  console.log(" Administrator created successfully!");
  console.log(` ID:    ${admin.id}`);
  console.log(` Email: ${admin.email}`);
  console.log(` Name:  ${admin.name}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });