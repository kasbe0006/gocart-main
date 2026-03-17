'use client'
import { Heart, StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const wishlistIds = useSelector((state) => state.wishlist?.ids || [])

    // calculate the average rating of the product
    const rating = product.rating && product.rating.length > 0 
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0

    // get first image or use placeholder
    const productImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'
    const isWishlisted = wishlistIds.includes(product.id)

    const handleWishlist = (event) => {
        event.preventDefault()
        event.stopPropagation()
        dispatch(toggleWishlist(product.id))
    }

    return (
        <div className='group max-xl:mx-auto relative'>
            <button
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={handleWishlist}
                className='absolute right-2 top-2 z-20 size-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center shadow-sm'
            >
                <Heart size={15} className={isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-500'} />
            </button>
            <Link href={`/product/${product.id}`}>
                <div className='bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
                    <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto' src={productImage} alt={product.name} unoptimized />
                </div>
                <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                    <div>
                        <p>{product.name}</p>
                        <div className='flex'>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                            ))}
                        </div>
                    </div>
                    <p>{currency}{product.price}</p>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard