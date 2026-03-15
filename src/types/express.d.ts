import { TJwtPayload } from "@/modules/auth/domain/auth.types"

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload
      tenantId?: string
    }
  }
}