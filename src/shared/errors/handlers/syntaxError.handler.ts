/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { StatusCodes } from 'http-status-codes';

import { sendError } from "@/shared/utils/sendError";

export const syntaxErrorHandler = (err: unknown, res: any) => {
    const stack = err instanceof Error ? err.stack : undefined;

    const message = err instanceof Error ? err.message : "Invalid JSON syntax";

    return sendError(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Syntax Error",
        error: message || err,
        stack: stack
    })
};