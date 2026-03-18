import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'
import { sanitizeQuery, validatePagination } from '@/lib/server/validation'
import { successResponse, validationError, withErrorHandling } from '@/lib/server/errors'

const ALLOWED_STORE_STATUSES = ['pending', 'approved', 'rejected']

export const GET = withErrorHandling(async (request) => {
    const access = await requireRoles(['ADMIN', 'MANAGER'])
    if (!access.ok) return access.response

    const searchParams = request.nextUrl.searchParams
    const status = sanitizeQuery(searchParams.get('status')).toLowerCase()
    const search = sanitizeQuery(searchParams.get('search'))
    const { page, limit } = validatePagination(searchParams)

    if (status && !ALLOWED_STORE_STATUSES.includes(status)) {
        return validationError(`status must be one of: ${ALLOWED_STORE_STATUSES.join(', ')}`)
    }

    const where = {
        ...(status ? { status } : {}),
        ...(search
            ? {
                  OR: [
                      { name: { contains: search, mode: 'insensitive' } },
                      { username: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {}),
    }

    const [stores, total] = await Promise.all([
        prisma.store.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        Product: true,
                        Order: true,
                    },
                },
            },
        }),
        prisma.store.count({ where }),
    ])

    const normalizedStores = stores.map((store) => ({
        ...store,
        productsCount: store._count?.Product || 0,
        ordersCount: store._count?.Order || 0,
    }))

    return successResponse(
        {
            stores: normalizedStores,
        },
        {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    )
})
