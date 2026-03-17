import crypto from 'crypto'

const RESET_TOKEN_BYTES = 32
const DEFAULT_TTL_MINUTES = 15

export const getResetTokenTtlMinutes = () => {
    const rawValue = Number(process.env.AUTH_RESET_TOKEN_TTL_MINUTES)
    if (Number.isFinite(rawValue) && rawValue > 0) return rawValue
    return DEFAULT_TTL_MINUTES
}

export const createResetTokenPair = () => {
    const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    return { token, tokenHash }
}

export const hashResetToken = (token) => {
    return crypto.createHash('sha256').update(String(token)).digest('hex')
}
