'use client'

import Link from 'next/link'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { History } from 'lucide-react'

export default function RecentlyViewed() {
    const recentIds = useSelector((state) => state.recent?.ids || [])
    const products = useSelector((state) => state.product?.list || [])

    const recentProducts = recentIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean)
        .slice(0, 4)

    if (recentProducts.length === 0) return null

    return (
        <div className='mx-6 my-20'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-between gap-3 mb-6'>
                    <h2 className='text-2xl font-semibold text-slate-800 flex items-center gap-2'>
                        <History size={20} className='text-indigo-500' />
                        Recently Viewed
                    </h2>
                    <Link href='/shop' className='text-sm text-slate-600 hover:text-slate-900'>View all</Link>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {recentProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
