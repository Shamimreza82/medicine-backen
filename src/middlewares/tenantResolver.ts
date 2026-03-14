// import { Request, Response, NextFunction } from "express"

// export const tenantResolver = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {

//     // 1️⃣ Tenant from JWT (recommended)
//     const tenantId = req.user?.tenantId

//     // 2️⃣ Tenant from header (optional fallback)
//     const headerTenant = req.headers["x-tenant-id"] as string | undefined

//     const resolvedTenant = tenantId || headerTenant

//     if (!resolvedTenant) {
//       return res.status(400).json({
//         success: false,
//         message: "Tenant not found in request"
//       })
//     }

//     // attach tenant to request
//     req.tenantId = resolvedTenant

//     next()

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Tenant resolution failed"
//     })
//   }
// }