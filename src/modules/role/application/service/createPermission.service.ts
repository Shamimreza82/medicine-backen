import { prisma } from '@/bootstrap/prisma';

const createPermissionsToRole = async (payload: string[], roleId: string) => {
  // get permission ids
  const permissions = await prisma.permission.findMany({
    where: {
      name: {
        in: payload,
      },
    },
    select: {
      id: true,
    },
  });

  // map for RolePermission table
  const rolePermissions = permissions.map((p) => ({
    roleId,
    permissionId: p.id,
  }));

  // create mapping
  await prisma.rolePermission.createMany({
    data: rolePermissions,
    skipDuplicates: true,
  });

  return true;
};
export default createPermissionsToRole;
