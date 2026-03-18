import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'
import { notFoundError, successResponse, validationError, withErrorHandling } from '@/lib/server/errors'

const normalizeCoupon = (coupon) => ({
    ...coupon,
    id: coupon.code,
    discountType: 'percentage',
    minOrderValue: null,
    maxUsageLimit: null,
    usageCount: 0,
})

export const PATCH = withErrorHandling(async (request, { params }) => {
    const access = await requireRoles(['ADMIN', 'MANAGER'])
    if (!access.ok) return access.response

    const { code } = await params
    const body = await request.json()

    const existingCoupon = await prisma.coupon.findUnique({ where: { code } })
    if (!existingCoupon) {
        return notFoundError('Coupon')
    }

    const updateData = {}

    if (typeof body?.description === 'string') {
        updateData.description = body.description.trim()
    }

    if (body?.discount !== undefined) {
        const parsedDiscount = Number(body.discount)
        if (!Number.isFinite(parsedDiscount) || parsedDiscount <= 0) {
            return validationError('discount must be a positive number')
        }
        updateData.discount = parsedDiscount
    }

    if (typeof body?.forNewUser === 'boolean') {
        updateData.forNewUser = body.forNewUser
    }

    if (typeof body?.forMember === 'boolean') {
        updateData.forMember = body.forMember
    }

    if (typeof body?.isPublic === 'boolean') {
        updateData.isPublic = body.isPublic
    }

    if (body?.expiresAt !== undefined) {
        const parsedExpiresAt = new Date(body.expiresAt)
        if (parsedExpiresAt.toString() === 'Invalid Date') {
            return validationError('expiresAt must be a valid date')
        }
        updateData.expiresAt = parsedExpiresAt
    }

    if (Object.keys(updateData).length === 0) {
        return validationError('No valid fields to update')
    }

    const coupon = await prisma.coupon.update({
        where: { code },
        data: updateData,
    })

    return successResponse({ coupon: normalizeCoupon(coupon) })
})

export const DELETE = withErrorHandling(async (_request, { params }) => {
    const access = await requireRoles(['ADMIN'])
    if (!access.ok) return access.response

    const { code } = await params

    const existingCoupon = await prisma.coupon.findUnique({ where: { code } })
    if (!existingCoupon) {
        return notFoundError('Coupon')
    }

    await prisma.coupon.delete({ where: { code } })

    return successResponse({ deletedId: code })
})
