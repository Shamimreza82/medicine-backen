/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";

import { prisma } from "@/bootstrap/prisma";

import { TCreateHospitalInput } from "../validation/hospital.validation";


const getHospitalByEmail = async(email:string) => {
    return prisma.hospital.findUnique({where: {email}})
}

const getHospitalBySlug = async(slug:string) => {
    return prisma.hospital.findUnique({where: {slug}})
}




const createHospital = async (
  payload: TCreateHospitalInput,
  slug: string
) => {
  return prisma.hospital.create({
    data: {
      ...payload,
      slug,
    },
  });
};


const enableHospitalFeatures = async (
  tx: Prisma.TransactionClient,
  hospitalId: string,
  features: any[]
) => {
  return tx.tenantFeature.createMany({
    data: features.map((feature) => ({
      hospitalId,
      featureId: feature.id,
      enabled: true,
    })),
  });
};






export const hospitalRepository = {
  createHospital,
  enableHospitalFeatures,
  getHospitalByEmail, 
  getHospitalBySlug
};