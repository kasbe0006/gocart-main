import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

export async function PATCH(request, { params }) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER'])
        if (!access.ok) return access.response

        const { productId } = await params
        const body = await request.json()

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } })
        if (!existingProduct) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
                { status: 404 }
            )
        }

        const updateData = {}

        if (typeof body.name === 'string') updateData.name = body.name.trim()
        if (typeof body.description === 'string') updateData.description = body.description.trim()
        if (typeof body.category === 'string') updateData.category = body.category.trim()
        if (Array.isArray(body.images) && body.images.length > 0) updateData.images = body.images
        if (typeof body.inStock === 'boolean') updateData.inStock = body.inStock

        if (body.mrp !== undefined) {
            const parsedMrp = Number(body.mrp)
            if (!Number.isFinite(parsedMrp) || parsedMrp <= 0) {
                return NextResponse.json(
                    { success: false, error: { code: 'VALIDATION_ERROR', message: 'mrp must be a positive number' } },
                    { status: 400 }
                )
            }
            updateData.mrp = parsedMrp
        }

        if (body.price !== undefined) {
            const parsedPrice = Number(body.price)
            if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
                return NextResponse.json(
                    { success: false, error: { code: 'VALIDATION_ERROR', message: 'price must be a positive number' } },
                    { status: 400 }
                )
            }
            updateData.price = parsedPrice
        }

        const nextMrp = updateData.mrp ?? existingProduct.mrp
        const nextPrice = updateData.price ?? existingProduct.price
        if (nextPrice > nextMrp) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'price cannot exceed mrp' } },
                { status: 400 }
            )
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' } },
                { status: 400 }
            )
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: updateData,
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
        })

        return NextResponse.json({ success: true, data: { product } })
    } catch (error) {
        console.error('PATCH /api/v1/admin/products/[productId] failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to update product' } },
            { status: 500 }
        )
    }
}

export async function DELETE(_request, { params }) {
    try {
        const access = await requireRoles(['ADMIN'])
        if (!access.ok) return access.response

        const { productId } = await params
        const existingProduct = await prisma.product.findUnique({ where: { id: productId } })

        if (!existingProduct) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
                { status: 404 }
            )
        }

        await prisma.product.delete({ where: { id: productId } })

        return NextResponse.json({ success: true, data: { deletedId: productId } })
    } catch (error) {
        console.error('DELETE /api/v1/admin/products/[productId] failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to delete product' } },
            { status: 500 }
        )
    }
}
