import { StatusCodes } from 'http-status-codes';

import { sendResponse } from '@/shared/utils/sendResponse'

import { catchAsync } from '../../../shared/utils/catchAsync'
// import { register } from '../application/service/register'
import { AUTH_MESSAGES } from '../domain/auth.constants';

export const registerController = catchAsync(async (req, res) => {

  console.log("jjjjjjjj")
  // const result = await register(req.body)

  // res.cookie('refreshToken', result.tokens.refreshToken, cookieOptions)

  sendResponse(res, StatusCodes.NOT_FOUND, {
    success: true,
    message: AUTH_MESSAGES.REGISTER_SUCCESS,
    data: {}
  })
})


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


export const AuthControllers = {
  registerController,
  // loginController,
  // refreshTokenController,
  // logoutController,
}
