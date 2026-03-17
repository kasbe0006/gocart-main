import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

const ALLOWED_STATUSES = ['ACTIVE', 'BLOCKED', 'DEACTIVATED']

export async function PATCH(request, { params }) {
    try {
        const access = await requireRoles(['ADMIN'])
        if (!access.ok) return access.response

        const { userId } = await params
        const body = await request.json()
        const { status } = body

        if (!status || !ALLOWED_STATUSES.includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
                    },
                },
                { status: 400 }
            )
        }

        if (access.user.id === userId && status !== 'ACTIVE') {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Admin cannot block or deactivate own account' },
                },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!existingUser) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
                { status: 404 }
            )
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { status },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json({ success: true, data: { user } })
    } catch (error) {
        console.error('PATCH /api/v1/admin/users/[userId]/status failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to update user status' } },
            { status: 500 }
        )
    }
}
