import bcrypt from "bcrypt"

export const comparePassword = async (payloadPassword: string, userPassword: string) => {
    return await bcrypt.compare(payloadPassword, userPassword)
}

