import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';
import { hashPassword } from '@/shared/utils/passwordHased';

import { AUTH_MESSAGES } from '../../domain/auth.constants';
import { TRegisterInput } from '../../domain/auth.schema';
import { createAuthUser, findUserByEmail } from '../../infrastructure/auth.repository';

 const registerService = async (payload: TRegisterInput) => {

const {email , tenantId, password} = payload


  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_ALREADY_EXISTS);
  }

 

  const data: TRegisterInput = {
    ...payload,
    password: await hashPassword(password),
  }

  const user = await createAuthUser(data)

  return user;
};

export default registerService
