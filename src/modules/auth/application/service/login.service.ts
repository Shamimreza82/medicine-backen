import { StatusCodes } from 'http-status-codes';

import { AppError } from "@/shared/errors/AppError"
import { comparePassword } from '@/shared/utils/passwordCompare';

import { AUTH_MESSAGES } from '../../domain/auth.constants';
import { TLoginInput } from "../../domain/auth.schema"
import { findUserByEmail } from "../../infrastructure/auth.repository"
import { generateAccessToken, generateRefreshToken } from '../../infrastructure/auth.token';



const loginService = async (payload: TLoginInput) => {
    const { email, password } = payload
    const isExistUser = await findUserByEmail(email)

    if (!isExistUser) throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_NOT_FOUND)

    if (isExistUser && isExistUser?.status === "INACTIVE" || isExistUser?.status === "LOCKED" || isExistUser?.status === "SUSPENDED") {
        throw new AppError(StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE, `Account temporarily ${isExistUser.status}, please contect admin`)
    }

    const isPasswordValid = await comparePassword(password, isExistUser?.password)

    if (!isPasswordValid) throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.INVALID_CREDENTIALS)



    const jwtPayload = {
        id: isExistUser.id,
        tenantId: isExistUser.tenantId,
        role: isExistUser.role.slug
    }
    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken(jwtPayload)

    return {
        accessToken,
        refreshToken,
        user: {
            id: isExistUser.id,
            tenantId: isExistUser.tenantId,
            name: isExistUser.name,
            email: isExistUser.email,
            role: isExistUser.role.slug
        }
    }

}



export default loginService