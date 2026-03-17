'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminMarketingPage() {
    const [emailTitle, setEmailTitle] = useState('')
    const [emailBody, setEmailBody] = useState('')
    const [flashSale, setFlashSale] = useState('')
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [bannerText, setBannerText] = useState('')

    const runEmailCampaign = () => {
        if (!emailTitle.trim() || !emailBody.trim()) return toast.error('Campaign title and content required')
        toast.success('Email campaign queued successfully')
    }

    const triggerPush = () => {
        toast.success('Push notification sent to subscribers')
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Marketing Tools</h1>
            <p className='text-sm mt-1'>Email campaigns, push notifications, flash sales, featured products, and banners.</p>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 max-w-6xl'>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <h2 className='font-semibold text-slate-800'>Email Campaign</h2>
                    <input value={emailTitle} onChange={(e) => setEmailTitle(e.target.value)} placeholder='Campaign title' className='w-full mt-3 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={4} placeholder='Campaign content' className='w-full mt-2 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <button onClick={runEmailCampaign} className='mt-3 px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm'>Send Campaign</button>
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <h2 className='font-semibold text-slate-800'>Promotions</h2>
                    <input value={flashSale} onChange={(e) => setFlashSale(e.target.value)} placeholder='Flash sale message' className='w-full mt-3 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <input value={featuredProductId} onChange={(e) => setFeaturedProductId(e.target.value)} placeholder='Featured product ID' className='w-full mt-2 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <input value={bannerText} onChange={(e) => setBannerText(e.target.value)} placeholder='Homepage banner text' className='w-full mt-2 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <button onClick={triggerPush} className='mt-3 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm'>Push Notification</button>
                </div>
            </div>
        </div>
    )
}
