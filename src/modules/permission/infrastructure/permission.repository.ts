import { prisma } from "@/bootstrap/prisma";


const getPermission = async () => {
   return prisma.permission.findMany({
    omit: {
        createdAt: true, 
        updatedAt: true,
        isSystem: true, 
        metadata: true
    }
   })
}





export const PermissionRepository = {
    getPermission 
};