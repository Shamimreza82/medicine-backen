import { prisma } from "@/bootstrap/prisma";
import { paginateResponse } from "@/shared/utils/paginateResponse";
import { TBaseQueryInput } from "@/shared/utils/validation/baseQuery.validation";



const getRoles = async (tenantId: string, query: TBaseQueryInput) => {

const page = Number(query.page) || 1
const limit = Number(query.limit) || 10

const skip = (page - 1) * limit

  const where: any = {
    tenantId
  }

  // search
  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        slug: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ]
  }

  // active filter
  if (query.isActive !== undefined) {
    where.isActive = query.isActive
  }

  const orderBy: any = {
    [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc"
  }

  const [roles, total] = await Promise.all([
    prisma.role.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        rolePermissions: true
      }
    }),

    prisma.role.count({ where })
  ])

  return paginateResponse(roles, total, page, limit)
}




export const roleRepository = {
    getRoles
};