import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';

import { AUTH_MESSAGES } from '../../domain/auth.constants';
import { TRegisterInput } from '../../domain/auth.schema';
import { findUserByEmail } from '../../infrastructure/auth.repository';






export const register = async (payload: TRegisterInput) => {


  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_ALREADY_EXISTS)
  }

  // const user = await createAuthUser({
  //   ...payload,
  //   password: hashedPassword,
  // })

//   const jwtPayload = {
//     userId: user.id,
//     email: user.email,
//     role: user.role,
//   }

//   const accessToken = generateAccessToken(jwtPayload)
//   const refreshToken = generateRefreshToken(jwtPayload)

//   await saveRefreshToken(user.id, refreshToken)

  return 
}
