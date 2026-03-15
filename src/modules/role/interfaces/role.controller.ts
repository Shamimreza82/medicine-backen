import { StatusCodes } from 'http-status-codes';

import { catchAsync } from "@/shared/utils/catchAsync";
import { sendResponse } from "@/shared/utils/sendResponse";
import { TQueryOptions } from '@/types/pagination.types';

import createPermissionsToRole from '../application/service/createPermission.service';
import createRoleService from '../application/service/createRole.service';
import getAllRoleService from '../application/service/getAllRoles.service';
import { ROLE_MESSAGES } from '../domain/role.constants';
import { TAssignPermissionsInput } from '../validation/permission.validation';
import { TCreateRoleInput } from '../validation/role.validation';



const getRoles = catchAsync(async (req, res) => {

    const user = req.user
    const query = req.query as TQueryOptions

    const result = await getAllRoleService(user, query)


    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: ROLE_MESSAGES.GET_ALL_ROLES,
        data: result
    })
})


const createRole = catchAsync(async (req, res) => {

    const payload: TCreateRoleInput = req.body 
    const result = await createRoleService(payload, req.user)


    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: ROLE_MESSAGES.CREATED,
        data: result
    })
})

const createPermission = catchAsync(async (req, res) => {

  const payload = req.body as TAssignPermissionsInput
  const {roleId} = req.params 



  const result = await createPermissionsToRole(payload.permissions, roleId as string)


    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: ROLE_MESSAGES.CREATED,
        data: result
    })
})










export const RoleController = {
    getRoles,
    createRole,
    createPermission
};