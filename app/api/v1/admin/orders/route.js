import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

export async function GET(request) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER', 'STAFF'])
        if (!access.ok) return access.response

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const storeId = searchParams.get('storeId')
        const userId = searchParams.get('userId')
        const page = Math.max(Number.parseInt(searchParams.get('page') || '1', 10), 1)
        const limit = Math.min(Math.max(Number.parseInt(searchParams.get('limit') || '20', 10), 1), 100)

        const where = {
            ...(status ? { status } : {}),
            ...(storeId ? { storeId } : {}),
            ...(userId ? { userId } : {}),
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    store: { select: { id: true, name: true, username: true } },
                    address: true,
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ])

        return NextResponse.json({
            success: true,
            data: { orders },
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('GET /api/v1/admin/orders failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to fetch orders' } },
            { status: 500 }
        )
    }
}
