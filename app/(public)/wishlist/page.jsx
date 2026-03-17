'use client'

import PageTitle from "@/components/PageTitle"
import { toggleWishlist } from "@/lib/features/wishlist/wishlistSlice"
import { Heart } from "lucide-react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"

export default function WishlistPage() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()

    const wishlistIds = useSelector((state) => state.wishlist?.ids || [])
    const products = useSelector((state) => state.product?.list || [])

    const wishlistProducts = wishlistIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean)

    if (wishlistProducts.length === 0) {
        return (
            <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Your wishlist is empty</h1>
                    <p className="mt-2 text-slate-500 text-sm sm:text-base">Save products to compare and revisit them quickly.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="My Wishlist" text="Products you loved" path="/shop" linkText="Continue shopping" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-24">
                    {wishlistProducts.map((product) => (
                        <div key={product.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                            <div className="bg-slate-100 h-44 rounded-lg flex items-center justify-center relative">
                                <Image
                                    src={product.images?.[0] || '/placeholder.jpg'}
                                    alt={product.name}
                                    width={220}
                                    height={220}
                                    className="max-h-36 w-auto"
                                    unoptimized
                                />
                                <button
                                    onClick={() => dispatch(toggleWishlist(product.id))}
                                    className="absolute top-2 right-2 size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center"
                                    aria-label="Remove from wishlist"
                                >
                                    <Heart size={15} className="text-rose-500 fill-rose-500" />
                                </button>
                            </div>
                            <p className="mt-3 font-medium text-slate-800">{product.name}</p>
                            <p className="text-sm text-slate-500 mt-1">{product.category}</p>
                            <p className="mt-2 font-semibold">{currency}{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
