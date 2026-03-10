// import { redis } from '../../../bootstrap/redis'

// const refreshTokenKey = (userId: string) => `auth:refresh:${userId}`

// export const saveRefreshToken = async (userId: string, token: string) => {
//   await redis.set(refreshTokenKey(userId), token, 'EX', 60 * 60 * 24 * 7)
// }

// export const getRefreshToken = async (userId: string) => {
//   return redis.get(refreshTokenKey(userId))
// }

// export const deleteRefreshToken = async (userId: string) => {
//   await redis.del(refreshTokenKey(userId))
// }
