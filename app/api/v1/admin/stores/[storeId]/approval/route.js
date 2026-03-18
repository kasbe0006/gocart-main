import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'
import { isValidStatus } from '@/lib/server/validation'
import { notFoundError, successResponse, validationError, withErrorHandling } from '@/lib/server/errors'

const ALLOWED_APPROVAL_STATUSES = ['approved', 'rejected']

export const PATCH = withErrorHandling(async (request, { params }) => {
    const access = await requireRoles(['ADMIN'])
    if (!access.ok) return access.response

    const { storeId } = await params
    const body = await request.json()
    const status = typeof body?.status === 'string' ? body.status.toLowerCase() : body?.status

    if (!isValidStatus(status, ALLOWED_APPROVAL_STATUSES)) {
        return validationError(`status must be one of: ${ALLOWED_APPROVAL_STATUSES.join(', ')}`)
    }

    const existingStore = await prisma.store.findUnique({ where: { id: storeId } })
    if (!existingStore) {
        return notFoundError('Store')
    }

    const store = await prisma.store.update({
        where: { id: storeId },
        data: { status },
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
