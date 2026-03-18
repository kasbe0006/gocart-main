import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'
import { sanitizeQuery, validatePagination } from '@/lib/server/validation'
import { successResponse, validationError, withErrorHandling } from '@/lib/server/errors'

const normalizeCoupon = (coupon) => ({
    ...coupon,
    id: coupon.code,
    discountType: 'percentage',
    minOrderValue: null,
    maxUsageLimit: null,
    usageCount: 0,
})

export const GET = withErrorHandling(async (request) => {
    const access = await requireRoles(['ADMIN', 'MANAGER'])
    if (!access.ok) return access.response

    const searchParams = request.nextUrl.searchParams
    const search = sanitizeQuery(searchParams.get('search'))
    const isPublicRaw = sanitizeQuery(searchParams.get('isPublic'))
    const isActiveRaw = sanitizeQuery(searchParams.get('isActive'))
    const { page, limit } = validatePagination(searchParams)

    const where = {
        ...(search
            ? {
                  OR: [
                      { code: { contains: search, mode: 'insensitive' } },
                      { description: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {}),
        ...(isPublicRaw ? { isPublic: isPublicRaw === 'true' } : {}),
        ...(isActiveRaw === 'true' ? { expiresAt: { gt: new Date() } } : {}),
        ...(isActiveRaw === 'false' ? { expiresAt: { lte: new Date() } } : {}),
    }

    const [coupons, total] = await Promise.all([
        prisma.coupon.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.coupon.count({ where }),
    ])

    return successResponse(
        {
            coupons: coupons.map(normalizeCoupon),
        },
        {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    )
})

export const POST = withErrorHandling(async (request) => {
    const access = await requireRoles(['ADMIN', 'MANAGER'])
    if (!access.ok) return access.response

    const body = await request.json()
    const code = String(body?.code || '').trim().toUpperCase()
    const description = String(body?.description || '').trim()
    const discount = Number(body?.discount)
    const forNewUser = Boolean(body?.forNewUser)
    const forMember = Boolean(body?.forMember)
    const isPublic = body?.isPublic === undefined ? true : Boolean(body?.isPublic)
    const expiresAt = body?.expiresAt ? new Date(body.expiresAt) : null

    if (!code || !description || !Number.isFinite(discount) || discount <= 0 || !expiresAt) {
        return validationError('code, description, discount and expiresAt are required')
    }

    if (expiresAt.toString() === 'Invalid Date') {
        return validationError('expiresAt must be a valid date')
    }

    const coupon = await prisma.coupon.create({
        data: {
            code,
            description,
            discount,
            forNewUser,
            forMember,
            isPublic,
            expiresAt,
        },
    })

    return successResponse({ coupon: normalizeCoupon(coupon) })
})
