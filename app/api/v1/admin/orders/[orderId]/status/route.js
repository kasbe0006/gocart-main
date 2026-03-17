import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

const ALLOWED_STATUSES = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export async function PATCH(request, { params }) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER', 'STAFF'])
        if (!access.ok) return access.response

        const { orderId } = await params
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

        const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })
        if (!existingOrder) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } },
                { status: 404 }
            )
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                user: { select: { id: true, name: true, email: true } },
                store: { select: { id: true, name: true, username: true } },
                orderItems: true,
            },
        })

        return NextResponse.json({ success: true, data: { order } })
    } catch (error) {
        console.error('PATCH /api/v1/admin/orders/[orderId]/status failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to update order status' } },
            { status: 500 }
        )
    }
}
