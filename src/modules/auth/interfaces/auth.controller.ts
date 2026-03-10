import { sendError } from '@/shared/utils/sendError';

import type { RequestHandler } from 'express';

export const register: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'register is not implemented yet',
  });
};

export const login: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'login is not implemented yet',
  });
};

export const refreshToken: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'refresh token is not implemented yet',
  });
};

export const logout: RequestHandler = (_req, res) => {
  sendError(res, 501, {
    success: false,
    message: 'logout is not implemented yet',
  });
};

// import { Request, Response } from 'express'
// import { login } from '../application/login'
// import { logout } from '../application/logout'
// import { refreshToken } from '../application/refreshToken'
// import { register } from '../application/register'
// import { AUTH_MESSAGES } from '../domain/auth.constants'
// import { presentAuthResponse } from './auth.presenter'
// import { catchAsync } from '../../../shared/utils/catchAsync'

// const cookieOptions = {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'none' as const,
// }

// export const registerController = catchAsync(async (req: Request, res: Response) => {
//   const result = await register(req.body)

//   res.cookie('refreshToken', result.tokens.refreshToken, cookieOptions)

//   res.status(201).json({
//     success: true,
//     message: AUTH_MESSAGES.REGISTER_SUCCESS,
//     data: presentAuthResponse(result),
//   })
// })

// export const loginController = catchAsync(async (req: Request, res: Response) => {
//   const result = await login(req.body)

//   res.cookie('refreshToken', result.tokens.refreshToken, cookieOptions)

//   res.status(200).json({
//     success: true,
//     message: AUTH_MESSAGES.LOGIN_SUCCESS,
//     data: presentAuthResponse(result),
//   })
// })

// export const refreshTokenController = catchAsync(async (req: Request, res: Response) => {
//   const token = req.cookies.refreshToken
//   const result = await refreshToken(token)

//   res.cookie('refreshToken', result.refreshToken, cookieOptions)

//   res.status(200).json({
//     success: true,
//     message: AUTH_MESSAGES.REFRESH_SUCCESS,
//     data: {
//       accessToken: result.accessToken,
//     },
//   })
// })

// export const logoutController = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user.userId

//   await logout(userId)

//   res.clearCookie('refreshToken', cookieOptions)

//   res.status(200).json({
//     success: true,
//     message: AUTH_MESSAGES.LOGOUT_SUCCESS,
//     data: null,
//   })
// })
