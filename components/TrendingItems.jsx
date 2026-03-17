'use client'

import ProductCard from './ProductCard'
import Title from './Title'
import { useSelector } from 'react-redux'

export default function TrendingItems() {
    const products = useSelector((state) => state.product?.list || [])

    const trending = products
        .slice()
        .sort((first, second) => {
            const firstScore = (first.rating?.length || 0) + (first.inStock ? 1 : 0)
            const secondScore = (second.rating?.length || 0) + (second.inStock ? 1 : 0)
            return secondScore - firstScore
        })
        .slice(0, 4)

    return (
        <div className='px-6 my-24 max-w-6xl mx-auto'>
            <Title title='Trending Items' description='Popular picks right now' href='/shop' />
            <div className='mt-10 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {trending.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
