import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'
import { notFoundError, successResponse, validationError, withErrorHandling } from '@/lib/server/errors'

export const PATCH = withErrorHandling(async (request, { params }) => {
    const access = await requireRoles(['ADMIN', 'MANAGER'])
    if (!access.ok) return access.response

    const { storeId } = await params
    const body = await request.json()
    const { isActive } = body || {}

    if (typeof isActive !== 'boolean') {
        return validationError('isActive must be boolean')
    }

    const existingStore = await prisma.store.findUnique({ where: { id: storeId } })
    if (!existingStore) {
        return notFoundError('Store')
    }

    const store = await prisma.store.update({
        where: { id: storeId },
        data: { isActive },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    })

    return successResponse({ store })
})
