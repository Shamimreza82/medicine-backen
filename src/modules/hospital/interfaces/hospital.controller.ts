import { StatusCodes } from 'http-status-codes';

import { catchAsync } from "@/shared/utils/catchAsync"
import { sendResponse } from "@/shared/utils/sendResponse"

import createHospitalService from '../application/service/createHospital.service';
import { HOSPITAL_MESSAGES } from "../domain/hospital.constants";



const createHospital = catchAsync(async (req, res) => {
    const body = req.body;
    const result = await createHospitalService(body)
    
    sendResponse(res, StatusCodes.CREATED, {
       success: true, 
       message: HOSPITAL_MESSAGES.CREATED,
       data: result
    })
})


export const hospitalController = {
createHospital
}