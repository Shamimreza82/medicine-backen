// import { z } from 'zod';

// const phoneValidation = z
//   .string()
//   .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number');

// const doctorRegisterSchema = z.object({
//   body: z.object({
//     name: z.string().min(2, 'Name must be at least 2 characters'),
//     email: z.string().email('Invalid email address'),
//     phone: phoneValidation,
//     password: z.string().min(6, 'Password must be at least 6 characters'),
//     planCode: z.string().min(1, 'Plan code is required'),
//   }),
// });

// export const DoctorValidationSchemas = {
//   doctorRegisterSchema,
// };

// export type TDoctorRegisterInput = z.infer<typeof doctorRegisterSchema>['body'];

