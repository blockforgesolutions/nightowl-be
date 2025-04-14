import * as bcrypt from 'bcryptjs'

const salt: number = 10;

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, salt)
}

export async function isValidPassword(password: string, hashedPassword: string): Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword);
}