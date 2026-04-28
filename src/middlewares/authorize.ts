// import { RequestHandler } from "express";

// import { Role } from "@/shared/constend/auth.const";
// import { AppError } from "@/shared/errors/AppError";

// export const authorize =
//   (...allowedRoles: Role[]): RequestHandler =>
//   (req, _res, next) => {
//     const user = req.user;

//     if (!user) {
//       throw new AppError(401, 'Unauthorized');
//     }

//     // SUPER ADMIN bypass (optional but recommended)
//     if (user.role === Role.SUPER_ADMIN) {
//       return next();
//     }

//     if (!allowedRoles.includes(user.role)) {
//       throw new AppError(403, 'Forbidden: You do not have permission');
//     }

//     next();
//   };