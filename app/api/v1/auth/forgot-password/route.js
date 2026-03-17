import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { createResetTokenPair, getResetTokenTtlMinutes } from '@/lib/server/resetToken'

export async function POST(request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'email is required' } },
                { status: 400 }
            )
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true, email: true, status: true },
        })

        if (user && user.status === 'ACTIVE') {
            const { token, tokenHash } = createResetTokenPair()
            const ttlMinutes = getResetTokenTtlMinutes()
            const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

            await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } })
            await prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash,
                    expiresAt,
                },
            })

            if (process.env.NODE_ENV !== 'production') {
                const resetUrl = `${request.nextUrl.origin}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`
                return NextResponse.json({
                    success: true,
                    data: {
                        message: 'If an account exists, a reset link has been generated.',
                        debug: {
                            resetToken: token,
                            resetUrl,
                            expiresAt,
                        },
                    },
                })
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                message: 'If an account exists, a reset link has been generated.',
            },
        })
    } catch (error) {
        console.error('POST /api/v1/auth/forgot-password failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to process forgot password request' } },
            { status: 500 }
        )
    }
}
