'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCoupon, removeCoupon } from '@/lib/features/coupon/couponSlice'
import { Ticket, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CouponInput({ cartTotal }) {
    const dispatch = useDispatch()
    const { appliedCoupon, discount, discountAmount, error, availableCoupons } = useSelector(state => state.coupon)
    const [couponCode, setCouponCode] = useState('')
    const [isApplying, setIsApplying] = useState(false)

    useEffect(() => {
        console.log('🎟️ Coupon state updated:', { appliedCoupon, discount, discountAmount, error, availableCoupons: availableCoupons?.length })
    }, [appliedCoupon, discount, discountAmount, error, availableCoupons])

    const handleApplyCoupon = (e) => {
        e.preventDefault()
        
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code')
            return
        }

        console.log('Applying coupon:', couponCode, 'Cart total:', cartTotal)
        console.log('Available coupons:', availableCoupons)

        setIsApplying(true)
        
        // Dispatch action
        dispatch(applyCoupon({ code: couponCode.toUpperCase(), cartTotal }))
        
        // Check after a short delay for state update
        setTimeout(() => {
            setIsApplying(false)
            setCouponCode('')
        }, 300)
    }

    const handleRemoveCoupon = () => {
        console.log('Removing coupon')
        dispatch(removeCoupon())
        setCouponCode('')
        toast.success('Coupon removed successfully')
    }

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    return (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="flex items-center gap-2 font-semibold text-slate-900">
                        <Ticket size={18} className="text-green-600" />
                        Apply Coupon Code ({availableCoupons?.length || 0} available)
                    </label>
                    
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="flex-1 px-4 py-2.5 border-2 border-slate-300 rounded-lg outline-none focus:border-green-500 transition text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isApplying}
                            className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-sm"
                        >
                            {isApplying ? 'Checking...' : 'Apply'}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">✅ Coupon Applied</p>
                            <p className="text-sm text-slate-600">{appliedCoupon.description}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <code className="bg-white px-3 py-1 rounded border border-slate-200 font-mono font-bold text-slate-800 text-sm">
                                    {appliedCoupon.code}
                                </code>
                                <span className="text-green-600 font-bold text-lg">
                                    {appliedCoupon.discountType === 'percentage' ? `-${discount}%` : `-$${discount}`}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-white p-3 rounded border-l-4 border-green-500">
                        <p className="text-sm text-slate-600">You save: <span className="font-bold text-green-600">${discountAmount.toFixed(2)}</span></p>
                    </div>
                </div>
            )}
        </div>
    )
}
