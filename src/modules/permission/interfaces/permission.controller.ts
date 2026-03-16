import { StatusCodes } from 'http-status-codes';

import { catchAsync } from "@/shared/utils/catchAsync";
import { sendResponse } from "@/shared/utils/sendResponse";

import getAllPermissionService from '../application/service/permission.service';
import { PERMISSION_MESSAGES } from "../domain/permission.constants";


const getPermissions = catchAsync(async (req, res) => {
  const role = req.user.role

    const result = await getAllPermissionService(role)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PERMISSION_MESSAGES.CREATED,
    data: result,
  });
});




export const PermissionController = {
getPermissions
};