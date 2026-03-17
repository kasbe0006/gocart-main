import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

export async function PATCH(request, { params }) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER'])
        if (!access.ok) return access.response

        const { productId } = await params
        const body = await request.json()
        const { inStock } = body

        if (typeof inStock !== 'boolean') {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'inStock must be boolean' } },
                { status: 400 }
            )
        }

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } })
        if (!existingProduct) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
                { status: 404 }
            )
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: { inStock },
        })

        return NextResponse.json({ success: true, data: { product } })
    } catch (error) {
        console.error('PATCH /api/v1/admin/products/[productId]/stock failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to update stock status' } },
            { status: 500 }
        )
    }
}
