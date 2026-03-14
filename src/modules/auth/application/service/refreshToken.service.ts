import { StatusCodes } from "http-status-codes";


import { AppError } from "@/shared/errors/AppError";

import { AUTH_MESSAGES } from "../../domain/auth.constants";
import { TJwtPayload } from "../../domain/auth.types";
import { findUserById } from "../../infrastructure/auth.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../infrastructure/auth.token"



const refreshTokenService = async (token: string) => {
    const decoded = verifyRefreshToken(token) as TJwtPayload
 

    const isExistUser = await findUserById(decoded.userId)

    if (!isExistUser) throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_NOT_FOUND)

    if (isExistUser && isExistUser?.status === "INACTIVE" || isExistUser?.status === "LOCKED" || isExistUser?.status === "SUSPENDED") {
        throw new AppError(StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE, `Account temporarily ${isExistUser.status}, please contect admin`)
    }


    const jwtPayload = {
        userId: isExistUser.id,
        tenantId: isExistUser.tenantId,
        role: isExistUser.role
    }

    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken(jwtPayload)

    return {
        accessToken,
        refreshToken
    }
}


export default refreshTokenService