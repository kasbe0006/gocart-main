import { createSlice } from "@reduxjs/toolkit"
import { couponDummyData } from "@/assets/assets"
import { loadCouponsFromStorage, saveCouponsToStorage } from './couponPersist'

// Initialize from localStorage or dummy data
const initialAvailableCoupons = loadCouponsFromStorage() || couponDummyData || []

const initialState = {
    appliedCoupon: null,
    discount: 0,
    discountAmount: 0,
    availableCoupons: initialAvailableCoupons,
    error: null,
}

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        applyCoupon: (state, action) => {
            const { code, cartTotal } = action.payload
            const coupon = state.availableCoupons.find(c => {
                const isExpired = new Date(c.expiresAt) < new Date()
                const meetsMinOrder = !c.minOrderValue || cartTotal >= c.minOrderValue
                const withinUsageLimit = !c.maxUsageLimit || c.usageCount < c.maxUsageLimit
                return c.code === code && !isExpired && meetsMinOrder && withinUsageLimit
            })

            if (!coupon) {
                state.error = 'Invalid or expired coupon code'
                state.appliedCoupon = null
                state.discount = 0
                state.discountAmount = 0
            } else {
                state.appliedCoupon = coupon
                state.discount = coupon.discount
                state.error = null

                if (coupon.discountType === 'percentage') {
                    state.discountAmount = (cartTotal * coupon.discount) / 100
                } else {
                    state.discountAmount = coupon.discount
                }
            }
        },

        removeCoupon: (state) => {
            state.appliedCoupon = null
            state.discount = 0
            state.discountAmount = 0
            state.error = null
        },

        setAvailableCoupons: (state, action) => {
            state.availableCoupons = action.payload
            saveCouponsToStorage(action.payload)
        },

        addCoupon: (state, action) => {
            console.log('Adding coupon to Redux:', action.payload)
            state.availableCoupons.unshift(action.payload)
            console.log('Coupons after add:', state.availableCoupons.length)
            saveCouponsToStorage(state.availableCoupons)
        },

        updateCoupon: (state, action) => {
            console.log('Updating coupon in Redux:', action.payload)
            const index = state.availableCoupons.findIndex(c => c.id === action.payload.id)
            if (index !== -1) {
                state.availableCoupons[index] = { ...state.availableCoupons[index], ...action.payload }
                console.log('Coupon updated:', state.availableCoupons[index])
                saveCouponsToStorage(state.availableCoupons)
            }
        },

        deleteCoupon: (state, action) => {
            const couponIdToDelete = action.payload
            console.log('🗑️ Deleting coupon with ID:', couponIdToDelete)
            console.log('📊 Coupons before delete:', state.availableCoupons.length, state.availableCoupons.map(c => ({ id: c.id, code: c.code })))
            
            state.availableCoupons = state.availableCoupons.filter(c => {
                const shouldKeep = c.id !== couponIdToDelete
                if (!shouldKeep) {
                    console.log('🗑️ Removing coupon:', c.code, 'ID:', c.id)
                }
                return shouldKeep
            })
            
            console.log('📊 Coupons after delete:', state.availableCoupons.length, state.availableCoupons.map(c => ({ id: c.id, code: c.code })))
            saveCouponsToStorage(state.availableCoupons)
        },

        clearError: (state) => {
            state.error = null
        }
    }
})

export const { applyCoupon, removeCoupon, setAvailableCoupons, addCoupon, updateCoupon, deleteCoupon, clearError } = couponSlice.actions
export default couponSlice.reducer

