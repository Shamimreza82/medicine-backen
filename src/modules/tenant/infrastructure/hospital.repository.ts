

import { prisma } from "@/bootstrap/prisma";
import { generateSlug } from "@/shared/utils/generateSlug";

import { generateTenantCode } from "../domain/tenant.utils";
import { TCreateTenantInput } from "../validation/tenant.validation";




const getTenantByEmail = async (email: string) => {
  return prisma.tenant.findUnique({ where: { email } })
}

const getTenantBySlug = async (slug: string) => {
  return prisma.tenant.findUnique({ where: { slug } })
}




const createTenant = async (payload: TCreateTenantInput) => {

  const slug = generateSlug(payload.name);
  const code = generateTenantCode(payload.name);

  const tenant = await prisma.tenant.create({
    data: {
      ...payload,
      slug,
      code
    }
  });

  return tenant;
};





export const TenantRepository = {
  createTenant,
  getTenantByEmail,
  getTenantBySlug
};