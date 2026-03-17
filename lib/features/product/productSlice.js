import { createSlice } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'
import { saveProductsToStorage, loadProductsFromStorage } from './productPersist'

// Start with empty array - will be hydrated from localStorage in StoreProvider
// This avoids SSR issues where window is undefined at import time
const initialProducts = []

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: initialProducts,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
            saveProductsToStorage(state.list)
        },
        addProduct: (state, action) => {
            console.log('Adding product to Redux:', action.payload)
            state.list.unshift(action.payload)
            console.log('Products after add:', state.list.length)
            saveProductsToStorage(state.list)
        },
        updateProduct: (state, action) => {
            console.log('Updating product in Redux:', action.payload)
            const index = state.list.findIndex(p => p.id === action.payload.id)
            console.log('Found product at index:', index)
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...action.payload }
                console.log('Product updated:', state.list[index])
                saveProductsToStorage(state.list)
            }
        },
        deleteProduct: (state, action) => {
            console.log('Deleting product from Redux with ID:', action.payload)
            console.log('Products before delete:', state.list.length)
            state.list = state.list.filter(p => p.id !== action.payload)
            console.log('Products after delete:', state.list.length)
            saveProductsToStorage(state.list)
        },
        clearProduct: (state) => {
            state.list = []
            saveProductsToStorage([])
        }
    }
})

export const { setProduct, addProduct, updateProduct, deleteProduct, clearProduct } = productSlice.actions

export default productSlice.reducer