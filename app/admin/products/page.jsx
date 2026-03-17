'use client'

import Loading from '@/components/Loading'
import StatePanel from '@/components/StatePanel'
import ProductModal from '@/components/admin/ProductModal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Download, Edit2, Plus, Trash2, Upload } from 'lucide-react'

export default function AdminProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const handleDownloadBulkTemplate = () => {
        const templateProducts = [
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with silent clicks',
                category: 'Electronics',
                mrp: 1499,
                price: 1099,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1200&auto=format&fit=crop'],
                inStock: true,
                storeId: '',
            },
            {
                name: 'Running Shoes',
                description: 'Lightweight running shoes for daily training',
                category: 'Footwear',
                mrp: 2999,
                price: 2499,
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'],
                inStock: true,
                storeId: '',
            },
        ]

        const blob = new Blob([JSON.stringify(templateProducts, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'velmora-products-bulk-template.json'
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)

        toast.success('Template downloaded')
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/v1/admin/products', { cache: 'no-store' })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to fetch products')
            }

            setProducts(payload.data?.products || [])
        } catch (error) {
            toast.error(error.message || 'Unable to fetch products')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleToggleStock = async (product) => {
        const nextInStock = !product.inStock
        try {
            const response = await fetch(`/api/v1/admin/products/${product.id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: nextInStock }),
            })
            const payload = await response.json()

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to update stock')
            }

            setProducts((prev) => prev.map((item) => item.id === product.id ? payload.data.product : item))
            toast.success(`Product marked as ${nextInStock ? 'In Stock' : 'Out of Stock'}`)
        } catch (error) {
            toast.error(error.message || 'Unable to update stock')
        }
    }

    const handleAddProduct = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleEditProduct = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const handleSaveProduct = async (formData) => {
        try {
            const isEditing = Boolean(selectedProduct?.id)
            const endpoint = isEditing ? `/api/v1/admin/products/${selectedProduct.id}` : '/api/v1/admin/products'
            const method = isEditing ? 'PATCH' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    mrp: formData.mrp,
                    price: formData.price,
                    inStock: formData.inStock,
                    images: formData.images,
                    storeId: formData.storeId,
                }),
            })

            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to save product')
            }

            const savedProduct = payload.data.product
            if (isEditing) {
                setProducts((prev) => prev.map((item) => item.id === savedProduct.id ? savedProduct : item))
                toast.success('Product updated successfully')
            } else {
                setProducts((prev) => [savedProduct, ...prev])
                toast.success('Product created successfully')
            }

            setSelectedProduct(null)
            setIsModalOpen(false)
        } catch (error) {
            toast.error(error.message || 'Unable to save product')
        }
    }

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return

        try {
            const response = await fetch(`/api/v1/admin/products/${productId}`, {
                method: 'DELETE',
            })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to delete product')
            }

            setProducts((prev) => prev.filter((item) => item.id !== productId))
            toast.success('Product deleted successfully')
        } catch (error) {
            toast.error(error.message || 'Unable to delete product')
        }
    }

    const handleBulkUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const text = await file.text()
            const parsed = JSON.parse(text)
            if (!Array.isArray(parsed)) {
                throw new Error('JSON must be an array of products')
            }

            const response = await fetch('/api/v1/admin/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: parsed }),
            })
            const payload = await response.json()

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to upload products')
            }

            const createdProducts = payload.data?.products || []
            const createdCount = payload.data?.createdCount || 0
            const rejectedCount = payload.data?.rejectedCount || 0

            if (createdProducts.length > 0) {
                setProducts((prev) => [...createdProducts, ...prev])
            }

            if (createdCount > 0 && rejectedCount === 0) {
                toast.success(`${createdCount} product(s) uploaded successfully`)
            } else if (createdCount > 0 && rejectedCount > 0) {
                toast.success(`${createdCount} uploaded, ${rejectedCount} rejected`)
            } else {
                toast.error('No products uploaded. Check your JSON data.')
            }
        } catch (error) {
            toast.error(error.message || 'Invalid JSON file')
        } finally {
            event.target.value = ''
        }
    }

    if (loading) return <Loading />

    return (
        <div className='text-slate-500 mb-20'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl'>Manage <span className='text-slate-800 font-medium'>Products</span></h1>
                    <p className='text-sm text-slate-400 mt-1'>Total: {products.length} products in database</p>
                </div>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={handleDownloadBulkTemplate}
                        className='px-3 py-2 text-sm bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition inline-flex items-center gap-2'
                    >
                        <Download size={16} /> Template
                    </button>
                    <label className='px-3 py-2 text-sm bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition cursor-pointer inline-flex items-center gap-2'>
                        <Upload size={16} /> Bulk Upload
                        <input type='file' accept='application/json' onChange={handleBulkUpload} className='hidden' />
                    </label>
                    <button
                        onClick={handleAddProduct}
                        className='flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition'
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>
            </div>

            {!products.length ? (
                <StatePanel
                    title='No products available'
                    description='Add a product manually or upload a bulk JSON file.'
                    className='h-80 flex items-center justify-center'
                />
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl'>
                    {products.map((product) => (
                        <div key={product.id} className='bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex gap-4 hover:shadow-md transition'>
                            <Image
                                src={product.images?.[0] || '/favicon.ico'}
                                alt={product.name}
                                width={90}
                                height={90}
                                className='w-20 h-20 rounded-md object-cover'
                            />

                            <div className='flex-1 min-w-0'>
                                <p className='text-lg text-slate-800 font-medium truncate'>{product.name}</p>
                                <p className='text-sm text-slate-500 line-clamp-2 mt-1'>{product.description}</p>

                                <div className='flex items-center gap-3 mt-3 text-sm flex-wrap'>
                                    <span className='px-2.5 py-1 rounded bg-slate-100 text-slate-700'>{product.category}</span>
                                    <span className='text-slate-800 font-semibold'>{currency}{product.price}</span>
                                    <span className='text-slate-400 line-through'>{currency}{product.mrp}</span>
                                    <span className={`px-2.5 py-1 rounded ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    <span className='px-2.5 py-1 rounded bg-indigo-50 text-indigo-700'>
                                        Store: {product.store?.name || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 justify-center'>
                                <button
                                    onClick={() => handleEditProduct(product)}
                                    className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition'
                                    title='Edit product'
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                                    title='Delete product'
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleToggleStock(product)}
                                    className={`px-3 py-1.5 rounded-md text-xs text-white ${product.inStock ? 'bg-rose-600' : 'bg-green-600'}`}
                                    title='Toggle stock status'
                                >
                                    {product.inStock ? 'Mark Out' : 'Mark In'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setSelectedProduct(null)
                    setIsModalOpen(false)
                }}
                product={selectedProduct}
                onSave={handleSaveProduct}
            />
        </div>
    )
}
