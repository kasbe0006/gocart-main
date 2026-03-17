import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'
import couponReducer from './features/coupon/couponSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
import recentReducer from './features/recent/recentSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            address: addressReducer,
            rating: ratingReducer,
            coupon: couponReducer,
            wishlist: wishlistReducer,
            recent: recentReducer,
        },
    })
}