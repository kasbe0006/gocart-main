import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { hashPassword } from '@/lib/server/password'
import { sanitizeUser } from '@/lib/server/auth'
import { setAuthCookie, signSessionToken } from '@/lib/server/session'

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'name, email and password are required' } },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'password must be at least 6 characters' } },
                { status: 400 }
            )
        }

        const normalizedEmail = String(email).trim().toLowerCase()

        const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: { code: 'CONFLICT', message: 'email already registered' } },
                { status: 409 }
            )
        }

        const passwordHash = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                name: String(name).trim(),
                email: normalizedEmail,
                passwordHash,
                role: 'CUSTOMER',
            },
        })

        const token = signSessionToken({ userId: user.id, role: user.role, email: user.email })
        await setAuthCookie(token)

        return NextResponse.json({ success: true, data: { user: sanitizeUser(user) } }, { status: 201 })
    } catch (error) {
        console.error('POST /api/v1/auth/signup failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to create account' } },
            { status: 500 }
        )
    }
}
