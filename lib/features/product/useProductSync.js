// Hook to sync products from localStorage on mount
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProduct } from './productSlice'
import { loadProductsFromStorage } from './productPersist'

export const useProductSync = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return

        // Load products from localStorage
        const storedProducts = loadProductsFromStorage()
        
        if (storedProducts && storedProducts.length > 0) {
            console.log('🔄 Syncing products from localStorage on mount:', storedProducts.length)
            dispatch(setProduct(storedProducts))
        }
    }, [dispatch])
}
