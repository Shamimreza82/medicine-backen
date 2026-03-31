
import bcrypt from 'bcrypt'

import { prisma } from '@/bootstrap/prisma';
import { AppError } from '@/shared/errors/AppError';
import { addDays } from '@/shared/utils/addDays';
import { generateSlug } from '@/shared/utils/generateSlug';

import { TDoctorRegisterInput } from './doctor.validation';




const createDoctor = async (payload: TDoctorRegisterInput) => {
  const { email, password, name, phone, planCode } = payload;

  const plan = await prisma.plan.findUnique({
    where: { code: planCode }
  });

  if (!plan) {
    throw new AppError(404, "Plan not found");
  }


  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { phone: phone }
      ]
    }
  });

  if (existingUser) {
    throw new AppError(409, "Doctor already exists with this email or phone");
  }


  await prisma.$transaction(async (tx) => {
    // all create logic here
    const tenant = await tx.tenant.create({
      data: {
        name: `${payload.name} Workspace`,
        slug: generateSlug(payload.name),
        status: "ACTIVE",
        isTrial: true,
        trialStartsAt: new Date(),
        trialEndsAt: addDays(new Date(), 7)
      }
    });
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
        role: "DOCTOR",
        status: "ACTIVE"
      }
    });


    const tenantSetting = await tx.tenantSetting.create({
      data: {
        tenantId: tenant.id,
        timezone: "Asia/Dhaka",
        currency: "BDT",
        language: "en",
        defaultFollowUpDays: 7,
        prescriptionHeader: null,
        prescriptionFooter: null
      }
    });


    const startsAt = new Date();
    const endsAt = addDays(startsAt, 7);

    const subscription = await tx.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: plan.id,
        status: "TRIALING",
        startsAt,
        endsAt,
      }
    });


  });

  return true
};



export const OnboardingServices = {
  createDoctor
};
