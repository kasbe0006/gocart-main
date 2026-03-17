'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Description')
    const [helpfulVotes, setHelpfulVotes] = useState({})

    useEffect(() => {
        if (typeof window === 'undefined' || !product?.id) return
        const key = `velmora_helpful_votes_${product.id}`
        try {
            const stored = localStorage.getItem(key)
            setHelpfulVotes(stored ? JSON.parse(stored) : {})
        } catch {
            setHelpfulVotes({})
        }
    }, [product?.id])

    const handleHelpfulVote = (reviewId) => {
        const nextVotes = { ...helpfulVotes, [reviewId]: (helpfulVotes[reviewId] || 0) + 1 }
        setHelpfulVotes(nextVotes)
        if (typeof window !== 'undefined' && product?.id) {
            localStorage.setItem(`velmora_helpful_votes_${product.id}`, JSON.stringify(nextVotes))
        }
    }

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold' : 'text-slate-400'} px-3 py-2 font-medium`} key={index} onClick={() => setSelectedTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl">{product?.description || 'No description available'}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-14">
                    {product?.rating?.length > 0 ? (
                        product.rating.map((item, index) => (
                            <div key={index} className="flex gap-5 mb-10">
                                <Image src={item.user?.image || '/placeholder.jpg'} alt="" className="size-10 rounded-full" width={100} height={100} unoptimized />
                                <div>
                                    <div className="flex items-center" >
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={18} className='text-transparent mt-0.5' fill={item.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                    <p className="text-sm max-w-lg my-4">{item.review}</p>
                                    {item?.photo && (
                                        <div className="mb-3">
                                            <Image src={item.photo} alt="review photo" className="size-16 rounded-md border border-slate-200 object-cover" width={120} height={120} unoptimized />
                                        </div>
                                    )}
                                    <p className="font-medium text-slate-800">{item.user?.name || 'Anonymous'}</p>
                                    <p className="mt-3 font-light">{item.createdAt ? new Date(item.createdAt).toDateString() : 'Date unknown'}</p>
                                    <button onClick={() => handleHelpfulVote(item.id || `${index}`)} className="mt-2 text-xs text-indigo-600 hover:text-indigo-700">
                                        Helpful ({helpfulVotes[item.id || `${index}`] || 0})
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400">No reviews yet</p>
                    )}
                </div>
            )}

            {/* Store Page */}
            {product?.store && (
                <div className="flex gap-3 mt-14">
                    <Image src={product.store.logo || '/placeholder.jpg'} alt="" className="size-11 rounded-full ring ring-slate-400" width={100} height={100} unoptimized />
                    <div>
                        <p className="font-medium text-slate-600">Product by {product.store.name || 'Unknown Store'}</p>
                        <Link href={`/shop/${product.store.username || ''}`} className="flex items-center gap-1.5 text-green-500"> view store <ArrowRight size={14} /></Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDescription