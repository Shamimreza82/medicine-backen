import { StatusCodes } from 'http-status-codes';

import { prisma } from "@/bootstrap/prisma"
import { AppError } from '@/shared/errors/AppError';

import { TCreateHospitalInput } from "../validation/hospital.validation"

export const createHospitalRepository = async (
    payload: TCreateHospitalInput,
    slug: string
) => {

    return await prisma.$transaction(async (tx) => {

        // 1️⃣ create hospital
        const hospital = await tx.hospital.create({
            data: {
                ...payload,
                slug
            }
        })

        const hospitalAdmin = await tx.role.findFirst({
            where: {
                slug: "HOSPITAL_ADMIN"
            }
        });
        if (!hospitalAdmin) {
            throw new AppError(StatusCodes.NOT_FOUND, "Hospital Admin role not found")
        }


        // 2️⃣ create hospital admin
        const adminUser = await tx.user.create({
            data: {
                name: "Hospital Admin",
                email: payload.email!,
                password: "hashed-password",
                hospitalId: hospital.id,
                roleId: hospitalAdmin.id
            }
        })

        // 3️⃣ get default features
        const features = await tx.feature.findMany()

        // 4️⃣ enable features for hospital
        await tx.tenantFeature.createMany({
            data: features.map((feature) => ({
                hospitalId: hospital.id,
                featureId: feature.id,
                enabled: true
            }))
        })

        return {
            hospital,
            adminUser
        }

    })
}