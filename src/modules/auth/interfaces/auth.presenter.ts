export const presentAuthUser = (user: {
  id: string
  name: string
  email: string
  role: string
}) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export const presentAuthResponse = (data: {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}) => {
  return {
    user: presentAuthUser(data.user),
    tokens: data.tokens,
  }
}