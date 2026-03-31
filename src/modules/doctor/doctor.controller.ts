// import { StatusCodes } from 'http-status-codes';

// import { catchAsync } from '@/shared/utils/catchAsync';
// import { sendResponse } from '@/shared/utils/sendResponse';

// import { DOCTOR_MESSAGES } from './doctor.consted';
// import { DoctorServices } from './doctor.service';
// import {  TDoctorRegisterInput } from './doctor.validation';



// const createDoctor = catchAsync(async (req, res) => {
//   const data: TDoctorRegisterInput = req.body;
//   const result = await DoctorServices.createDoctor(data);

//   sendResponse(res, StatusCodes.CREATED, {
//     success: true,
//     message: DOCTOR_MESSAGES.REGISTER_SUCCESS,
//     data: result,
//   });
// });




// export const DoctorControllers = {
// createDoctor
// };
