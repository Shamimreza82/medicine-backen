// import { prisma } from '../../../bootstrap/prisma'

// export const findUserByEmail = async (email: string) => {
//   return prisma.user.findUnique({
//     where: { email },
//   })
// }

// export const findUserById = async (id: string) => {
//   return prisma.user.findUnique({
//     where: { id },
//   })
// }

// export const createAuthUser = async (payload: {
//   name: string
//   email: string
//   password: string
// }) => {
//   return prisma.user.create({
//     data: {
//       name: payload.name,
//       email: payload.email,
//       password: payload.password,
//       role: 'USER',
//     },
//   })
// }
