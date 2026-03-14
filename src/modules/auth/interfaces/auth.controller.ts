import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';


import loginService from '../application/service/login.service';
import refreshTokenService from '../application/service/refreshToken.service';
import registerService from '../application/service/register.service';
import { AUTH_MESSAGES } from '../domain/auth.constants';
import { TLoginInput, TRegisterInput } from '../domain/auth.schema';

const register = catchAsync(async (req, res) => {

  const data = req.body as TRegisterInput

const result = await registerService(data)

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: AUTH_MESSAGES.REGISTER_SUCCESS,
    data: result,
  });
});



const login = catchAsync(async (req, res) => {
  const data = req.body as TLoginInput

  const result = await loginService(data);

  const { user, accessToken, refreshToken } = result

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: {
      accessToken,
      user
    },
  });
});




const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies["refreshToken"] as string;

  const result = await refreshTokenService(token)

  const { accessToken, refreshToken } = result

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: AUTH_MESSAGES.REFRESH_SUCCESS,
    data: {
      accessToken 
    },
  });
})



export const AuthControllers = {
  login,
  register,
  refreshToken
};
