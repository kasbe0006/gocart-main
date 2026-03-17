import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'

const validateProductInput = (item) => {
    if (!item?.name || !item?.description || !item?.category) {
        return 'name, description and category are required'
    }

    const parsedMrp = Number(item.mrp)
    const parsedPrice = Number(item.price)
    if (!Number.isFinite(parsedMrp) || !Number.isFinite(parsedPrice) || parsedMrp <= 0 || parsedPrice <= 0) {
        return 'mrp and price must be valid positive numbers'
    }

    if (parsedPrice > parsedMrp) {
        return 'price cannot exceed mrp'
    }

    if (!Array.isArray(item.images) || item.images.length === 0) {
        return 'at least one image is required'
    }

    return null
}

export async function POST(request) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER'])
        if (!access.ok) return access.response

        const body = await request.json()
        const products = Array.isArray(body?.products) ? body.products : []

        if (products.length === 0) {
            return NextResponse.json(
                { success: false, error: { code: 'VALIDATION_ERROR', message: 'products array is required' } },
                { status: 400 }
            )
        }

        const fallbackStore = await prisma.store.findFirst({
            orderBy: { createdAt: 'asc' },
            select: { id: true },
        })

        const createdProducts = []
        const rejectedProducts = []

        for (let index = 0; index < products.length; index += 1) {
            const item = products[index]
            const validationError = validateProductInput(item)
            if (validationError) {
                rejectedProducts.push({ index, reason: validationError })
                continue
            }

            const resolvedStoreId = item.storeId || fallbackStore?.id
            if (!resolvedStoreId) {
                rejectedProducts.push({ index, reason: 'storeId is required when no store exists' })
                continue
            }

            try {
                const product = await prisma.product.create({
                    data: {
                        name: String(item.name).trim(),
                        description: String(item.description).trim(),
                        category: String(item.category).trim(),
                        mrp: Number(item.mrp),
                        price: Number(item.price),
                        images: item.images,
                        inStock: item.inStock === undefined ? true : Boolean(item.inStock),
                        storeId: resolvedStoreId,
                    },
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

                createdProducts.push(product)
            } catch (error) {
                console.error(`Bulk create product failed at index ${index}`, error)
                rejectedProducts.push({ index, reason: 'database insert failed' })
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                products: createdProducts,
                createdCount: createdProducts.length,
                rejectedCount: rejectedProducts.length,
                rejectedProducts,
            },
        })
    } catch (error) {
        console.error('POST /api/v1/admin/products/bulk failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to bulk upload products' } },
            { status: 500 }
        )
    }
}
