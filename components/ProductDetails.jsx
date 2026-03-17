'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const availableColors = product?.colors?.length ? product.colors : ['Black', 'White', 'Gray']
    const availableSizes = product?.sizes?.length ? product.sizes : ['Standard']

    // Safely get first image, default to placeholder if none exists
    const [mainImage, setMainImage] = useState(product?.images?.[0] || null);
    const [selectedColor, setSelectedColor] = useState(availableColors[0])
    const [selectedSize, setSelectedSize] = useState(availableSizes[0])
    const [isImageZoomed, setIsImageZoomed] = useState(false)
    const [showSizeGuide, setShowSizeGuide] = useState(false)

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const buyNowHandler = () => {
        if (!cart[productId]) {
            addToCartHandler()
        }
        window.dispatchEvent(new Event('app:navigation-start'))
        router.push('/cart')
    }

    const averageRating = product?.rating?.length > 0 
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length 
        : 0;
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product?.images?.map((image, index) => (
                        image && (
                            <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                                <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} unoptimized />
                            </div>
                        )
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg overflow-hidden">
                    {mainImage ? (
                        <Image src={mainImage} alt="" width={250} height={250} unoptimized onMouseEnter={() => setIsImageZoomed(true)} onMouseLeave={() => setIsImageZoomed(false)} className={`${isImageZoomed ? 'scale-125' : 'scale-100'} transition-transform duration-300`} />
                    ) : (
                        <span className="text-slate-400">No image</span>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Color</p>
                        <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none">
                            {availableColors.map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Size</p>
                        <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none">
                            {availableSizes.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Selected: {selectedColor} • {selectedSize}</p>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-indigo-600 hover:text-indigo-700 mt-2">View size guide</button>
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }
                    <button onClick={() => {
                        if (!cart[productId]) {
                            addToCartHandler()
                            return
                        }
                        window.dispatchEvent(new Event('app:navigation-start'))
                        router.push('/cart')
                    }} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
                        {!cart[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                    <button onClick={buyNowHandler} className="bg-indigo-600 text-white px-8 py-3 text-sm font-medium rounded hover:bg-indigo-700 active:scale-95 transition">
                        Buy Now
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>

            {showSizeGuide && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
                    <div className="w-full max-w-md rounded-xl bg-white p-5" onClick={(event) => event.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-slate-800">Size Guide</h3>
                        <p className="text-sm text-slate-600 mt-2">Use this guide to pick your best fit.</p>
                        <div className="mt-4 text-sm border border-slate-200 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-2 bg-slate-100 px-3 py-2 font-medium text-slate-700">
                                <p>Size</p>
                                <p>Recommendation</p>
                            </div>
                            <div className="grid grid-cols-2 px-3 py-2 border-t border-slate-200"><p>Small</p><p>Kids / compact fit</p></div>
                            <div className="grid grid-cols-2 px-3 py-2 border-t border-slate-200"><p>Medium</p><p>Most users</p></div>
                            <div className="grid grid-cols-2 px-3 py-2 border-t border-slate-200"><p>Large</p><p>Comfort fit</p></div>
                            <div className="grid grid-cols-2 px-3 py-2 border-t border-slate-200"><p>Standard</p><p>Universal</p></div>
                        </div>
                        <button onClick={() => setShowSizeGuide(false)} className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails