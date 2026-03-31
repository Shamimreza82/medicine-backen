import { logger } from "@/bootstrap/logger";
import { prisma } from "@/bootstrap/prisma";

import { seedSuperAdmin } from './seed/superAdmin';

async function main() {
  await seedSuperAdmin();
}

main()
  .then(() => {
   logger.info("🌱 Seeding completed");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });