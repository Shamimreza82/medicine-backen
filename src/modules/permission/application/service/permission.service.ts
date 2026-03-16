
import { roleModuleAccess } from "../../domain/permission.constants";
import { PermissionRepository } from "../../infrastructure/permission.repository";

const getAllPermissionService = async (role: string) => {

  const permissions = await PermissionRepository.getPermission();

  // SUPER ADMIN → return everything
  if (role === "SUPER_ADMIN") {
    return permissions;
  }

  const restrictedModules = roleModuleAccess[role] ?? [];

  // filter permissions
  const filteredPermissions = permissions.filter(
    (permission) => !restrictedModules.includes(permission.module)
  );

  return filteredPermissions;
};

export default getAllPermissionService;