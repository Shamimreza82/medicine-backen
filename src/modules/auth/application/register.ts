// import bcrypt from 'bcrypt'
// import { AppError } from '../../../shared/errors/AppError'
// import { AUTH_MESSAGES } from '../domain/auth.constants'
// import { TRegisterInput } from '../domain/auth.types'
// import { createAuthUser, findUserByEmail } from '../infrastructure/auth.repository'
// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from '../infrastructure/auth.token'
// import { saveRefreshToken } from '../infrastructure/auth.cache'

// export const register = async (payload: TRegisterInput) => {
//   const existingUser = await findUserByEmail(payload.email)

//   if (existingUser) {
//     throw new AppError(409, AUTH_MESSAGES.USER_ALREADY_EXISTS)
//   }

//   const hashedPassword = await bcrypt.hash(payload.password, 10)

//   const user = await createAuthUser({
//     ...payload,
//     password: hashedPassword,
//   })

//   const jwtPayload = {
//     userId: user.id,
//     email: user.email,
//     role: user.role,
//   }

//   const accessToken = generateAccessToken(jwtPayload)
//   const refreshToken = generateRefreshToken(jwtPayload)

//   await saveRefreshToken(user.id, refreshToken)

//   return {
//     user,
//     tokens: {
//       accessToken,
//       refreshToken,
//     },
//   }
// }