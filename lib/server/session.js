import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const AUTH_COOKIE_NAME = 'velmora_auth'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

const getJwtSecret = () => {
    const secret = process.env.AUTH_JWT_SECRET
    if (!secret) {
        throw new Error('AUTH_JWT_SECRET is not configured')
    }
    return secret
}

export const signSessionToken = (payload) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_TTL_SECONDS })
}

export const verifySessionToken = (token) => {
    return jwt.verify(token, getJwtSecret())
}

export const setAuthCookie = async (token) => {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    })
}

export const clearAuthCookie = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)
}

export const getSessionFromCookies = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) return null

    try {
        return verifySessionToken(token)
    } catch {
        return null
    }
}
