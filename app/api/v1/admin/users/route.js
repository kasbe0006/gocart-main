import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

export async function GET(request) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER'])
        if (!access.ok) return access.response

        const searchParams = request.nextUrl.searchParams
        const role = searchParams.get('role')
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const page = Math.max(Number.parseInt(searchParams.get('page') || '1', 10), 1)
        const limit = Math.min(Math.max(Number.parseInt(searchParams.get('limit') || '20', 10), 1), 100)

        const where = {
            ...(role ? { role } : {}),
            ...(status ? { status } : {}),
            ...(search
                ? {
                      OR: [
                          { name: { contains: search, mode: 'insensitive' } },
                          { email: { contains: search, mode: 'insensitive' } },
                      ],
                  }
                : {}),
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            buyerOrders: true,
                        },
                    },
                    store: {
                        select: {
                            id: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ])

        const normalizedUsers = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            orderCount: user._count?.buyerOrders || 0,
            storeCount: user.store ? 1 : 0,
        }))

        return NextResponse.json({
            success: true,
            data: { users: normalizedUsers },
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('GET /api/v1/admin/users failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to fetch users' } },
            { status: 500 }
        )
    }
}
