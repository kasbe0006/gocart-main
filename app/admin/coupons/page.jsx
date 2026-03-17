'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Trash2, Edit2, Plus, Copy, CheckCircle, AlertCircle } from "lucide-react"
import CouponModal from "@/components/admin/CouponModal"
import { useDispatch, useSelector } from "react-redux"
import { addCoupon, updateCoupon, deleteCoupon } from "@/lib/features/coupon/couponSlice"

export default function AdminCoupons() {

    const dispatch = useDispatch()
    const coupons = useSelector(state => {
        console.log('Admin coupons selector - Current coupons:', state.coupon?.availableCoupons?.length)
        return state.coupon?.availableCoupons || []
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)

    const handleAddCoupon = () => {
        setSelectedCoupon(null)
        setIsModalOpen(true)
    }

    const handleEditCoupon = (coupon) => {
        setSelectedCoupon(coupon)
        setIsModalOpen(true)
    }

    const handleSaveCoupon = (formData) => {
        console.log('Saving coupon:', formData)
        if (selectedCoupon) {
            console.log('Dispatching updateCoupon with:', formData)
            dispatch(updateCoupon(formData))
            toast.success('Coupon updated successfully!')
        } else {
            console.log('Dispatching addCoupon with:', formData)
            dispatch(addCoupon(formData))
            toast.success('Coupon created successfully!')
        }
        setSelectedCoupon(null)
        setIsModalOpen(false)
    }

    const handleDeleteCoupon = (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            console.log('Dispatching deleteCoupon with ID:', couponId)
            dispatch(deleteCoupon(couponId))
            toast.success('Coupon deleted successfully!')
        }
    }

    const copyCouponCode = (code) => {
        navigator.clipboard.writeText(code)
        toast.success(`Copied: ${code}`)
    }

    const isExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date()
    }

    return (
        <div className="text-slate-500 mb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl">Manage <span className="text-slate-800 font-medium">Coupons</span></h1>
                    <p className="text-sm text-slate-400 mt-1">Total: {coupons.length} coupons in Redux</p>
                </div>
                <button
                    onClick={handleAddCoupon}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    <Plus size={20} />
                    Create Coupon
                </button>
            </div>

            {coupons.length ? (
                <div className="space-y-3 max-w-6xl">
                    {coupons.map((coupon) => {
                        const expired = isExpired(coupon.expiresAt)
                        return (
                            <div key={coupon.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex-1">
                                        {/* Coupon Code & Badge */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                                                <code className="font-mono font-bold text-slate-800">{coupon.code}</code>
                                                <button
                                                    onClick={() => copyCouponCode(coupon.code)}
                                                    className="text-slate-500 hover:text-slate-700 transition"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                expired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {expired ? 'Expired' : 'Active'}
                                            </span>
                                            {coupon.isPublic && (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                    Public
                                                </span>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-700 font-medium mb-2">{coupon.description}</p>

                                        {/* Details */}
                                        <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-green-600">
                                                    {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                                                </span>
                                                <span>Discount</span>
                                            </div>
                                            
                                            {coupon.minOrderValue && (
                                                <div>Min Order: ${coupon.minOrderValue}</div>
                                            )}
                                            
                                            <div>Expires: {format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}</div>
                                            
                                            {coupon.maxUsageLimit && (
                                                <div>Uses: {coupon.usageCount || 0}/{coupon.maxUsageLimit}</div>
                                            )}
                                        </div>

                                        {/* Eligibility */}
                                        <div className="mt-3 flex gap-2 flex-wrap">
                                            {coupon.forNewUser && (
                                                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                                    New Users
                                                </span>
                                            )}
                                            {coupon.forMember && (
                                                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                                    Members
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditCoupon(coupon)}
                                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit coupon"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete coupon"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                        <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                        <h1 className="text-3xl text-slate-400 font-medium">No coupons created yet</h1>
                        <p className="text-slate-500 mt-2">Create your first coupon to get started</p>
                    </div>
                </div>
            )}

            {/* Coupon Modal */}
            <CouponModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                coupon={selectedCoupon}
                onSave={handleSaveCoupon}
            />
        </div>
    )
}