import { createSlice } from '@reduxjs/toolkit'
import { loadRecentFromStorage, saveRecentToStorage } from './recentPersist'

const MAX_RECENT_ITEMS = 12

const recentSlice = createSlice({
    name: 'recent',
    initialState: {
        ids: loadRecentFromStorage(),
    },
    reducers: {
        addRecentProduct: (state, action) => {
            const productId = action.payload
            const filtered = state.ids.filter((id) => id !== productId)
            state.ids = [productId, ...filtered].slice(0, MAX_RECENT_ITEMS)
            saveRecentToStorage(state.ids)
        },
        clearRecentProducts: (state) => {
            state.ids = []
            saveRecentToStorage(state.ids)
        },
    },
})

export const { addRecentProduct, clearRecentProducts } = recentSlice.actions

export default recentSlice.reducer
