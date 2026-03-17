'use client'

import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AlertTriangle } from 'lucide-react'

export default function AdminInventoryPage() {
    const products = useSelector((state) => state.product?.list || [])
    const [stockByProduct, setStockByProduct] = useState(() => {
        if (typeof window === 'undefined') return {}
        try {
            const stored = localStorage.getItem('velmora_inventory_stock')
            return stored ? JSON.parse(stored) : {}
        } catch {
            return {}
        }
    })

    const lowStockItems = useMemo(() => products.filter((product) => Number(stockByProduct[product.id] ?? 12) <= 5), [products, stockByProduct])

    const updateStock = (productId, value) => {
        const nextStock = { ...stockByProduct, [productId]: Math.max(0, Number(value || 0)) }
        setStockByProduct(nextStock)
        localStorage.setItem('velmora_inventory_stock', JSON.stringify(nextStock))
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Inventory Management</h1>
            <p className='text-sm mt-1'>Track stock quantity, low stock alerts, and out-of-stock products.</p>

            <div className='mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 max-w-5xl'>
                <p className='text-sm text-amber-800 inline-flex items-center gap-2'>
                    <AlertTriangle size={15} />
                    Low stock alerts: {lowStockItems.length} items need restocking.
                </p>
            </div>

            <div className='mt-5 max-w-5xl overflow-x-auto rounded-xl border border-slate-200 bg-white'>
                <table className='w-full min-w-[760px] text-sm'>
                    <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr>
                            <th className='text-left px-4 py-3'>Product</th>
                            <th className='text-left px-4 py-3'>Category</th>
                            <th className='text-left px-4 py-3'>Stock Qty</th>
                            <th className='text-left px-4 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const qty = Number(stockByProduct[product.id] ?? 12)
                            const status = qty === 0 ? 'Out of stock' : qty <= 5 ? 'Low stock' : 'In stock'
                            const statusClass = qty === 0 ? 'bg-red-100 text-red-700' : qty <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            return (
                                <tr key={product.id} className='border-b border-slate-100'>
                                    <td className='px-4 py-3 text-slate-800 font-medium'>{product.name}</td>
                                    <td className='px-4 py-3'>{product.category}</td>
                                    <td className='px-4 py-3'>
                                        <input type='number' min='0' value={qty} onChange={(event) => updateStock(product.id, event.target.value)} className='w-24 border border-slate-300 rounded-md px-2 py-1.5 outline-none' />
                                    </td>
                                    <td className='px-4 py-3'><span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>{status}</span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
