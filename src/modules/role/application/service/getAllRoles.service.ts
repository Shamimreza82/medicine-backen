import { TJwtPayload } from "@/modules/auth/domain/auth.types"
import { TBaseQueryInput } from "@/shared/utils/validation/baseQuery.validation"


import { roleRepository } from "../../infrastructure/role.repository"



const getAllRoleService = async (user: TJwtPayload, query: TBaseQueryInput) => {

     return await roleRepository.getRoles(user.tenantId, query)
}


export default getAllRoleService