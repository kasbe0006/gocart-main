import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { requireRoles } from '@/lib/server/auth'
import { sanitizeQuery, validatePagination } from '@/lib/server/validation'
import { successResponse, internalError, unauthorizedError, validationError } from '@/lib/server/errors'

export async function GET(request) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER', 'STAFF'])
        if (!access.ok) return access.response

        const searchParams = request.nextUrl.searchParams
        const category = sanitizeQuery(searchParams.get('category'))
        const search = sanitizeQuery(searchParams.get('search'))
        const inStock = searchParams.get('inStock')
        const { page, limit } = validatePagination(searchParams)

        const where = {
            ...(category ? { category } : {}),
            ...(inStock === 'true' || inStock === 'false' ? { inStock: inStock === 'true' } : {}),
            ...(search
                ? {
                      OR: [
                          { name: { contains: search, mode: 'insensitive' } },
                          { description: { contains: search, mode: 'insensitive' } },
                      ],
                  }
                : {}),
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    },
                },
            }),
            prisma.product.count({ where }),
        ])

        return successResponse({ products }, {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        })
    } catch (error) {
        return internalError(error, 'GET /api/v1/admin/products')
    }
}

export async function POST(request) {
    try {
        const access = await requireRoles(['ADMIN', 'MANAGER'])
        if (!access.ok) return access.response

        const body = await request.json()
        const {
            name,
            description,
            category,
            mrp,
            price,
            images,
            inStock = true,
            storeId,
        } = body

        if (!name || !description || !category) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'name, description and category are required' },
                },
                { status: 400 }
            )
        }

        const parsedMrp = Number(mrp)
        const parsedPrice = Number(price)
        if (!Number.isFinite(parsedMrp) || !Number.isFinite(parsedPrice) || parsedMrp <= 0 || parsedPrice <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'mrp and price must be valid positive numbers' },
                },
                { status: 400 }
            )
        }

        if (parsedPrice > parsedMrp) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'price cannot exceed mrp' },
                },
                { status: 400 }
            )
        }

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'at least one image is required' },
                },
                { status: 400 }
            )
        }

        let resolvedStoreId = storeId
        if (!resolvedStoreId) {
            const fallbackStore = await prisma.store.findFirst({
                orderBy: { createdAt: 'asc' },
                select: { id: true },
            })
            resolvedStoreId = fallbackStore?.id
        }

        if (!resolvedStoreId) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'storeId is required when no store exists' },
                },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                name: String(name).trim(),
                description: String(description).trim(),
                category: String(category).trim(),
                mrp: parsedMrp,
                price: parsedPrice,
                images,
                inStock: Boolean(inStock),
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

        return NextResponse.json({ success: true, data: { product } }, { status: 201 })
    } catch (error) {
        console.error('POST /api/v1/admin/products failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to create product' } },
            { status: 500 }
        )
    }
}
