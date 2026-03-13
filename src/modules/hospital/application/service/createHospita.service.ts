import { StatusCodes } from "http-status-codes";

import { AppError } from "@/shared/errors/AppError";
import { generateSlug } from "@/shared/utils/generateSlug";

import { HOSPITAL_MESSAGES } from "../../domain/hospital.constants";
import { hospitalRepository } from "../../infrastructure/hospital.repository";
import { TCreateHospitalInput } from "../../validation/hospital.validation";


const createHospitalService = async (payload: TCreateHospitalInput) => {
  const { name, email, slug } = payload


  const geberatedSlug = payload.slug ?? generateSlug(name);
    const existingHospitalByEmail = await hospitalRepository.getHospitalByEmail(email!)
    if (existingHospitalByEmail) {
      throw new AppError(StatusCodes.CONFLICT, HOSPITAL_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const existingHospitalBySlug = await hospitalRepository.getHospitalBySlug(slug!)
    if (existingHospitalBySlug) {
      throw new AppError(StatusCodes.CONFLICT, HOSPITAL_MESSAGES.SLUG_ALREADY_EXISTS);
    }

    const hospital = await hospitalRepository.createHospital(payload, geberatedSlug);




    return {
      hospital,
    };
};

export default createHospitalService