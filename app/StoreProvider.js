'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { setProduct } from '@/lib/features/product/productSlice'
import { loadProductsFromStorage } from '@/lib/features/product/productPersist'
import { productDummyData } from '@/assets/assets'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    
    // Immediately hydrate products from localStorage or use dummy data
    const storedProducts = loadProductsFromStorage()
    
    // Use stored products if they exist and have valid image paths, otherwise use dummy data
    let productsToUse = productDummyData
    if (storedProducts && storedProducts.length > 0) {
      const hasValidImages = storedProducts.some(p => {
        if (!p.images || p.images.length === 0) return false
        const firstImage = p.images[0]
        if (typeof firstImage === 'string') {
          return firstImage.length > 0 && !firstImage.startsWith('/assets/')
        }
        return typeof firstImage?.src === 'string' && firstImage.src.length > 0
      })
      if (hasValidImages) {
        productsToUse = storedProducts
      } else {
        // Clear invalid stored data and use dummy
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('velmora_products')
            sessionStorage.removeItem('velmora_products')
          }
        } catch (e) {}
      }
    }
    
    console.log('🌱 StoreProvider initialized with:', productsToUse.length, 'products')
    storeRef.current.dispatch(setProduct(productsToUse))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}