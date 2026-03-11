import { prisma } from '@/bootstrap/prisma';
import { hospitalFeatures } from '@/shared/lib/data/hospitalFeatures';

import type { Hospital } from '@prisma/client';

export async function seedHospital(): Promise<Hospital> {
  const hospital = await prisma.hospital.upsert({
    where: { slug: 'demo-hospital' },
    update: {},
    create: {
      name: 'Demo Hospital',
      slug: 'demo-hospital',
      email: 'demo@hospital.com',
      phone: '+8801700000000',
      address: 'Dhaka, Bangladesh',
      website: 'https://demo-hospital.com',

      tenantSetting: {
        create: {
          timezone: 'Asia/Dhaka',
          currency: 'BDT',
          language: 'en',
          appointmentDuration: 15,
          invoicePrefix: 'INV',
          patientIdPrefix: 'PAT',
        },
      },
    },
  });

  return hospital;
}

export async function seedFeatures() {


  for (const feature of hospitalFeatures) {
    await prisma.feature.upsert({
      where: { code: feature.code },
      update: {},
      create: feature,
    });
  }

  console.log('✅ Features seeded');
}
