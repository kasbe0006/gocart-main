import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyPassword } from '@/lib/server/password'
import { sanitizeUser } from '@/lib/server/auth'
import { setAuthCookie, signSessionToken } from '@/lib/server/session'

export async function POST(request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'email and password are required' } },
                { status: 400 }
            )
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

        if (!user || !user.passwordHash) {
            return NextResponse.json(
                { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } },
                { status: 401 }
            )
        }

        if (user.status !== 'ACTIVE') {
            return NextResponse.json(
                { success: false, error: { code: 'FORBIDDEN', message: 'User account is not active' } },
                { status: 403 }
            )
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash)
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } },
                { status: 401 }
            )
        }

        const token = signSessionToken({ userId: user.id, role: user.role, email: user.email })
        await setAuthCookie(token)

        return NextResponse.json({ success: true, data: { user: sanitizeUser(user) } })
    } catch (error) {
        console.error('POST /api/v1/auth/login failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to login' } },
            { status: 500 }
        )
    }
}
