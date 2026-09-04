import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 12);

  await prisma.user.upsert({
    where: { email: "admin@methjothisa.com" },
    update: {},
    create: {
      email: "admin@methjothisa.com",
      name: "System Administrator",
      password: adminPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
      isActive: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
