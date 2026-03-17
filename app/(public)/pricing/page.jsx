
'use client'

import Link from "next/link"
import { CheckCircle2, Sparkles } from "lucide-react"

const projectFeatures = [
    'Browse products with search, filters, and sorting',
    'Wishlist with quick heart toggle on product cards',
    'Cart with quantity controls and coupon support',
    'Admin product and coupon management interfaces',
    'Store dashboard pages for product/order workflows',
    'Custom loading animations',
]

export default function PricingPage() {
    return (
        <div className='mx-6 my-20 min-h-[70vh]'>
            <div className='mx-auto max-w-7xl'>
                <div className='text-center'>
                    <p className='inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700'>
                        <Sparkles size={14} />
                        Personal Project
                    </p>
                    <h1 className='mt-4 text-4xl sm:text-5xl font-bold text-slate-900'>About This Website</h1>
                    <p className='mt-4 text-slate-600 max-w-2xl mx-auto'>
                        This page now works as a quick project overview instead of pricing.
                        It highlights what is already built and where to go next.
                    </p>
                </div>

                <div className='mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-7'>
                        <h2 className='text-2xl font-bold text-slate-900'>Current Frontend Features</h2>
                        <ul className='mt-5 space-y-3'>
                            {projectFeatures.map((feature) => (
                                <li key={feature} className='flex items-start gap-2 text-slate-600'>
                                    <CheckCircle2 size={16} className='text-green-500 mt-0.5' />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-white p-7'>
                        <h2 className='text-xl font-bold text-slate-900'>Quick Navigation</h2>
                        <div className='mt-5 flex flex-col gap-3'>
                            <Link href='/shop' className='rounded-lg bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold text-center hover:bg-slate-800'>
                                Explore Shop
                            </Link>
                            <Link href='/wishlist' className='rounded-lg border border-slate-300 text-slate-700 px-4 py-2.5 text-sm font-semibold text-center hover:bg-slate-100'>
                                Open Wishlist
                            </Link>
                            <Link href='/cart' className='rounded-lg border border-slate-300 text-slate-700 px-4 py-2.5 text-sm font-semibold text-center hover:bg-slate-100'>
                                Go to Cart
                            </Link>
                            <Link href='/admin' className='rounded-lg border border-slate-300 text-slate-700 px-4 py-2.5 text-sm font-semibold text-center hover:bg-slate-100'>
                                Open Admin Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='mt-8 text-center rounded-2xl border border-slate-200 bg-slate-50 p-8'>
                    <h3 className='text-2xl font-bold text-slate-900'>Next Step</h3>
                    <p className='text-slate-600 mt-2'>Continue frontend polish now, then connect backend APIs after UI is finalized.</p>
                </div>
            </div>
        </div>
    )
}