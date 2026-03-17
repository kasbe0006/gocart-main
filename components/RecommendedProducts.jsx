'use client'

import ProductCard from './ProductCard'
import Title from './Title'
import { useSelector } from 'react-redux'

export default function RecommendedProducts() {
    const products = useSelector((state) => state.product?.list || [])
    const recentIds = useSelector((state) => state.recent?.ids || [])

    const recommended = products
        .filter((product) => !recentIds.includes(product.id))
        .slice()
        .sort((first, second) => Number(second.price || 0) - Number(first.price || 0))
        .slice(0, 4)

    if (recommended.length === 0) return null

    return (
        <div className='px-6 my-24 max-w-6xl mx-auto'>
            <Title title='Recommended For You' description='Based on your browsing activity' href='/shop' />
            <div className='mt-10 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {recommended.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
