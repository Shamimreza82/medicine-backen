import { prisma } from "@/bootstrap/prisma";
import { features } from "@/shared/lib/data/features";


export async function seedFeatures() {
  for (const feature of features) {
    await prisma.feature.upsert({
      where: { code: feature.code },
      update: {},
      create: feature,
    });
  }

  console.log('✅ Features seeded');
}
