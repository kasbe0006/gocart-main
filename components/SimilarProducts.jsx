'use client'

import ProductCard from './ProductCard'
import Title from './Title'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export default function SimilarProducts({ currentProduct }) {
    const products = useSelector((state) => state.product?.list || [])

    const similarItems = useMemo(() => {
        if (!currentProduct) return []
        return products
            .filter((product) => product.id !== currentProduct.id && product.category === currentProduct.category)
            .slice(0, 4)
    }, [products, currentProduct])

    if (similarItems.length === 0) return null

    return (
        <div className='my-16'>
            <Title title='Similar Products' description='Products in the same category' href='/shop' />
            <div className='mt-8 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {similarItems.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    )
}
