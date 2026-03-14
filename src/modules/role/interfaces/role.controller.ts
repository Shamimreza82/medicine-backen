import { StatusCodes } from 'http-status-codes';

import { catchAsync } from "@/shared/utils/catchAsync";
import { sendResponse } from "@/shared/utils/sendResponse";

import getAllRoleService from '../application/service/getAllRoles.service';
import { ROLE_MESSAGES } from '../domain/role.constants';



const getRoles = catchAsync(async (req, res) => {

    const user = req.user 

    const result = await getAllRoleService(user, req.query)
    

    sendResponse(res, StatusCodes.OK, {
        success: true, 
        message: ROLE_MESSAGES.GET_ALL_ROLES,
        data: result
    })
})








export const RoleController = {
    getRoles
};