import { prisma } from '@/bootstrap/prisma'
import type { Tenant } from '@prisma/client'

export async function seedTenant(): Promise<Tenant> {
  const features = await prisma.feature.findMany()

  const tenantType = await prisma.tenantType.findFirst({
    where: { code: 'HOSPITAL' },
  })

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-hospital' },
    update: {},
    create: {
      name: 'Demo Hospital',
      slug: 'demo-hospital',
      code: 'DEMO_HOSP',
      email: 'demo@hospital.com',
      phone: '+8801700000000',
      website: 'https://demo-hospital.com',

      tenantTypeId: tenantType?.id,

      status: 'ACTIVE',

      trialStartsAt: new Date(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),

      activatedAt: new Date(),

      setting: {
        create: {
          timezone: 'Asia/Dhaka',
          currency: 'BDT',
          language: 'en',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: '24h',
        },
      },

      features: {
        create: features.map((feature) => ({
          feature: {
            connect: { id: feature.id },
          },
          enabled: true,
        })),
      },
    },
  })

  return tenant
}