import { generateSlug } from "@/shared/utils/generateSlug"

import { createHospitalRepository } from "../../infrastructure/hospital.repository"
import { TCreateHospitalInput } from "../../validation/hospital.validation"



const createHospitalService = async (payload: TCreateHospitalInput) => {

    const slug = payload.slug ?? generateSlug(payload?.name)


    const result = await createHospitalRepository(payload, slug)

    return result
}


export default createHospitalService