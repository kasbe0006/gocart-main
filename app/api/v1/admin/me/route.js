import { NextResponse } from 'next/server'
import { requireRoles } from '@/lib/server/auth'

export async function GET() {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER', 'STAFF'])
        if (!access.ok) return access.response

        return NextResponse.json({
            success: true,
            data: {
                user: access.user,
                capabilities: {
                    canManageUsers: access.user.role === 'ADMIN',
                    canManagePayments: ['ADMIN', 'MANAGER'].includes(access.user.role),
                    canManageOrders: ['ADMIN', 'MANAGER', 'STAFF'].includes(access.user.role),
                },
            },
        })
    } catch (error) {
        console.error('GET /api/v1/admin/me failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to fetch admin session details' } },
            { status: 500 }
        )
    }
}
