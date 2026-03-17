import { createSlice } from '@reduxjs/toolkit'
import { loadWishlistFromStorage, saveWishlistToStorage } from './wishlistPersist'

const initialState = {
    ids: loadWishlistFromStorage(),
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlist: (state, action) => {
            const productId = action.payload
            const exists = state.ids.includes(productId)
            state.ids = exists
                ? state.ids.filter((id) => id !== productId)
                : [productId, ...state.ids]
            saveWishlistToStorage(state.ids)
        },
        addToWishlist: (state, action) => {
            const productId = action.payload
            if (!state.ids.includes(productId)) {
                state.ids.unshift(productId)
                saveWishlistToStorage(state.ids)
            }
        },
        removeFromWishlist: (state, action) => {
            const productId = action.payload
            state.ids = state.ids.filter((id) => id !== productId)
            saveWishlistToStorage(state.ids)
        },
        clearWishlist: (state) => {
            state.ids = []
            saveWishlistToStorage(state.ids)
        },
    },
})

export const { toggleWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
