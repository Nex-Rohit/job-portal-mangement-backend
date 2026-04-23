// prisma/seed.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create a company
  const company = await prisma.company.create({
    data: {
      companyName: "Acme Corp",
    },
  });

  // Create an admin linked to that company
  await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "admin@acme.com",
      password: await bcrypt.hash("password123", 10),
      role: "admin",
      companyId: company.id,
    },
  });

  // Create a regular user
  await prisma.user.create({
    data: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "user",
    },
  });

  console.log("✅ Seeding done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });