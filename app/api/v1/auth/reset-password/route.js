import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { hashPassword } from '@/lib/server/password'
import { hashResetToken } from '@/lib/server/resetToken'

export async function POST(request) {
    try {
        const body = await request.json()
        const { token, password } = body

        if (!token || !password) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'token and password are required' } },
                { status: 400 }
            )
        }

        if (String(password).length < 6) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'password must be at least 6 characters' } },
                { status: 400 }
            )
        }

        const tokenHash = hashResetToken(token)
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            include: {
                user: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        })

        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'Reset token is invalid or expired' } },
                { status: 400 }
            )
        }

        if (!resetToken.user || resetToken.user.status !== 'ACTIVE') {
            return NextResponse.json(
                { success: false, error: { code: 'FORBIDDEN', message: 'User account is not active' } },
                { status: 403 }
            )
        }

        const passwordHash = await hashPassword(password)

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
            prisma.passwordResetToken.deleteMany({
                where: {
                    userId: resetToken.userId,
                    id: { not: resetToken.id },
                },
            }),
        ])

        return NextResponse.json({
            success: true,
            data: { message: 'Password updated successfully' },
        })
    } catch (error) {
        console.error('POST /api/v1/auth/reset-password failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to reset password' } },
            { status: 500 }
        )
    }
}
