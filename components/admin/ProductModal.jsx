'use client'

import { X, Upload, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { dummyStoreData, dummyRatingsData } from '@/assets/assets'

export default function ProductModal({ isOpen, onClose, product, onSave }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        mrp: '',
        price: '',
        inStock: true,
        images: [],
        storeId: 'seller_1',
        store: dummyStoreData,
        rating: dummyRatingsData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    const [errors, setErrors] = useState({})
    const [imagePreviews, setImagePreviews] = useState([])

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                images: product.images || [],
            })
            setImagePreviews(product.images || [])
        } else {
            setFormData({
                id: `prod_${Date.now()}`,
                name: '',
                description: '',
                category: '',
                mrp: '',
                price: '',
                inStock: true,
                images: [],
                storeId: 'seller_1',
                store: dummyStoreData,
                rating: dummyRatingsData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            setImagePreviews([])
        }
        setErrors({})
    }, [product, isOpen])

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Product name is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.category.trim()) newErrors.category = 'Category is required'
        if (!formData.mrp || formData.mrp <= 0) newErrors.mrp = 'MRP must be greater than 0'
        if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0'
        if (parseFloat(formData.price) > parseFloat(formData.mrp)) newErrors.price = 'Price cannot exceed MRP'
        if (imagePreviews.length === 0) newErrors.images = 'At least one product image is required'
        
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (event) => {
                const imageUrl = event.target.result
                setImagePreviews(prev => [...prev, imageUrl])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            const updatedFormData = {
                ...formData,
                mrp: parseFloat(formData.mrp),
                price: parseFloat(formData.price),
                images: imagePreviews,
                updatedAt: new Date().toISOString(),
            }
            console.log('ProductModal - Submitting data:', updatedFormData)
            onSave(updatedFormData)
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
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                errors.name ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                            }`}
                            placeholder="Enter product name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition resize-none ${
                                errors.description ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                            }`}
                            placeholder="Enter product description"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                errors.category ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                            }`}
                            placeholder="e.g., Electronics, Accessories"
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    {/* MRP and Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                MRP
                            </label>
                            <input
                                type="number"
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                    errors.mrp ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                                }`}
                                placeholder="0"
                                step="0.01"
                            />
                            {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Selling Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition ${
                                    errors.price ? 'border-red-500' : 'border-slate-200 focus:border-green-500'
                                }`}
                                placeholder="0"
                                step="0.01"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="inStock"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-2 border-slate-300 cursor-pointer"
                        />
                        <label htmlFor="inStock" className="text-sm font-medium text-slate-900 cursor-pointer">
                            In Stock
                        </label>
                    </div>

                    {/* Product Images */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Product Images
                        </label>
                        
                        {/* Image Upload Area */}
                        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                            <div className="text-center">
                                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                                <p className="text-sm font-medium text-slate-700">Click to upload images</p>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-700 mb-3">{imagePreviews.length} image(s) selected</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-200">
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            {product ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
