'use client'

import { X, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function CouponModal({ isOpen, onClose, coupon, onSave }) {
    const [formData, setFormData] = useState({
        id: '',
        code: '',
        description: '',
        discount: '',
        discountType: 'percentage', // percentage or fixed
        minOrderValue: '',
        maxUsageLimit: '',
        usageCount: 0,
        forNewUser: false,
        forMember: false,
        isPublic: true,
        expiresAt: new Date().toISOString().split('T')[0],
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (coupon) {
            setFormData(coupon)
        } else {
            setFormData({
                id: `coupon_${Date.now()}`,
                code: '',
                description: '',
                discount: '',
                discountType: 'percentage',
                minOrderValue: '',
                maxUsageLimit: '',
                usageCount: 0,
                forNewUser: false,
                forMember: false,
                isPublic: true,
                expiresAt: new Date().toISOString().split('T')[0],
            })
        }
        setErrors({})
    }, [coupon, isOpen])

    const validateForm = () => {
        const newErrors = {}
        if (!formData.code.trim()) newErrors.code = 'Coupon code is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.discount || formData.discount <= 0) newErrors.discount = 'Discount must be greater than 0'
        if (formData.discountType === 'percentage' && formData.discount > 100) newErrors.discount = 'Percentage cannot exceed 100'
        if (!formData.expiresAt) newErrors.expiresAt = 'Expiry date is required'
        if (new Date(formData.expiresAt) <= new Date()) newErrors.expiresAt = 'Expiry date must be in the future'
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            console.log('CouponModal - Submitting data:', formData)
            onSave(formData)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {coupon ? 'Edit Coupon' : 'Create New Coupon'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Coupon Code */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Coupon Code (e.g., SAVE20)
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="SUMMER2024"
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition uppercase ${
                                errors.code ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                            }`}
                        />
                        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g., Summer Sale - 20% off on all items"
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                errors.description ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                            }`}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Discount Type and Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Discount Type
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg outline-none focus:border-green-500 transition"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Discount Value
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="e.g., 20"
                                className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                    errors.discount ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                                }`}
                                step="0.01"
                            />
                            {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
                        </div>
                    </div>

                    {/* Min Order Value & Max Usage */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Min Order Value (Optional)
                            </label>
                            <input
                                type="number"
                                name="minOrderValue"
                                value={formData.minOrderValue}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg outline-none focus:border-green-500 transition"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Max Usage Limit (Optional)
                            </label>
                            <input
                                type="number"
                                name="maxUsageLimit"
                                value={formData.maxUsageLimit}
                                onChange={handleChange}
                                placeholder="Unlimited"
                                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg outline-none focus:border-green-500 transition"
                            />
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <Calendar size={18} />
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            name="expiresAt"
                            value={formData.expiresAt}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                errors.expiresAt ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                            }`}
                        />
                        {errors.expiresAt && <p className="text-red-500 text-sm mt-1">{errors.expiresAt}</p>}
                    </div>

                    {/* User Eligibility */}
                    <div className="space-y-3 border-t border-slate-200 pt-4">
                        <p className="font-semibold text-slate-900">Who can use this coupon?</p>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="forNewUser"
                                checked={formData.forNewUser}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-2 border-slate-300"
                            />
                            <span className="text-slate-900 font-medium">For New Users</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="forMember"
                                checked={formData.forMember}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-2 border-slate-300"
                            />
                            <span className="text-slate-900 font-medium">For Members</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-2 border-slate-300"
                            />
                            <span className="text-slate-900 font-medium">Public (Show on website)</span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                        >
                            {coupon ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
