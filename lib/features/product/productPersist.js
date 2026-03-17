// Simple localStorage helpers - with smart size optimization
// Stores products with images but uses sessionStorage for large data
import { productDummyData } from '@/assets/assets'

// Helper to determine storage strategy based on size
const getOptimalStorage = () => {
    try {
        localStorage.setItem('_test', '1')
        localStorage.removeItem('_test')
        return localStorage
    } catch {
        return sessionStorage
    }
}

const dummyProductMap = new Map(productDummyData.map((product) => [product.id, product]))

const isBase64Image = (image) => typeof image === 'string' && image.startsWith('data:image')

const rehydrateStoredProductAssets = (product) => {
    const dummyProduct = dummyProductMap.get(product?.id)
    if (!dummyProduct) return product

    const currentImages = Array.isArray(product.images) ? product.images : []
    const hasCustomBase64Image = currentImages.some(isBase64Image)

    return {
        ...product,
        images: hasCustomBase64Image ? currentImages : dummyProduct.images,
        store: product?.store
            ? {
                ...product.store,
                logo: product.store.logo || dummyProduct.store?.logo,
                user: {
                    ...product.store.user,
                    image: product.store?.user?.image || dummyProduct.store?.user?.image,
                },
            }
            : dummyProduct.store,
        rating: (product.rating || []).map((item, index) => ({
            ...item,
            user: {
                ...item.user,
                image: item?.user?.image || dummyProduct.rating?.[index % (dummyProduct.rating?.length || 1)]?.user?.image,
            },
        })),
    }
}

// Helper to compress products by keeping only necessary data
const compressProductsForStorage = (products) => {
    return products.map(product => {
        const normalizedImages = (product.images || [])
            .map((image) => {
                if (typeof image === 'string') return image
                if (typeof image?.src === 'string') return image.src
                return null
            })
            .filter(Boolean)

        const normalizedRatings = (product.rating || []).map((item) => {
            const userImage = typeof item?.user?.image === 'string'
                ? item.user.image
                : item?.user?.image?.src || null

            return {
                ...item,
                user: {
                    ...item?.user,
                    image: userImage,
                },
            }
        })

        // Keep images if they exist, but try to keep file sizes reasonable
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            mrp: product.mrp,
            images: normalizedImages,
            rating: normalizedRatings,
            inStock: product.inStock,
            storeId: product.storeId,
            storeName: product.storeName,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }
    })
}

export const getInitialProducts = (fallbackData) => {
    if (typeof window === 'undefined') return fallbackData
    try {
        const stored = localStorage.getItem('velmora_products')
        return stored ? JSON.parse(stored) : fallbackData
    } catch (error) {
        console.error('❌ Error getting initial products:', error)
        return fallbackData
    }
}

export const loadProductsFromStorage = () => {
    if (typeof window === 'undefined') return null
    try {
        const storage = getOptimalStorage()
        const stored = storage.getItem('velmora_products')
        if (!stored) return null

        const parsedProducts = JSON.parse(stored)
        if (!Array.isArray(parsedProducts)) return null

        return parsedProducts.map(rehydrateStoredProductAssets)
    } catch (error) {
        console.error('❌ Error loading products:', error)
        return null
    }
}

export const saveProductsToStorage = (products) => {
    if (typeof window === 'undefined') return
    try {
        // Compress products before saving
        const compressedProducts = compressProductsForStorage(products)
        const jsonString = JSON.stringify(compressedProducts)
        const sizeInKB = new Blob([jsonString]).size / 1024
        
        console.log('💾 Saving products:', products.length, 'products', '(' + sizeInKB.toFixed(2) + 'KB)')
        
        const storage = getOptimalStorage()
        storage.setItem('velmora_products', jsonString)
        console.log('✅ Successfully saved to storage')
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('⚠️ Storage quota exceeded. Trying to clear old data...')
            try {
                const storage = getOptimalStorage()
                storage.removeItem('velmora_products')
                const compressedProducts = compressProductsForStorage(products)
                storage.setItem('velmora_products', JSON.stringify(compressedProducts))
                console.log('✅ Saved after clearing')
            } catch (retryError) {
                console.error('❌ Cannot save products:', retryError.message)
                // App still works with in-memory state
            }
        } else {
            console.error('❌ Error saving products:', error.message)
        }
    }
}


