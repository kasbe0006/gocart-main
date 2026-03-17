'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminContentPage() {
    const [homeBanner, setHomeBanner] = useState('Big sale this week')
    const [productBanner, setProductBanner] = useState('New arrivals')
    const [aboutPage, setAboutPage] = useState('About Velmora...')
    const [contactPage, setContactPage] = useState('Contact us at support@example.com')
    const [blogTitle, setBlogTitle] = useState('')

    const saveContent = () => {
        toast.success('Website content updated')
    }

    const publishBlog = () => {
        if (!blogTitle.trim()) return toast.error('Blog title required')
        toast.success('Blog article published')
        setBlogTitle('')
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Website Content Management</h1>
            <p className='text-sm mt-1'>Edit banners, blog snippets, and static pages (About/Contact).</p>

            <div className='mt-5 max-w-5xl rounded-xl border border-slate-200 bg-white p-5 space-y-3'>
                <input value={homeBanner} onChange={(e) => setHomeBanner(e.target.value)} className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' placeholder='Homepage banner text' />
                <input value={productBanner} onChange={(e) => setProductBanner(e.target.value)} className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' placeholder='Product banner text' />
                <textarea value={aboutPage} onChange={(e) => setAboutPage(e.target.value)} rows={3} className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' placeholder='About page content' />
                <textarea value={contactPage} onChange={(e) => setContactPage(e.target.value)} rows={3} className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' placeholder='Contact page content' />
                <button onClick={saveContent} className='px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm'>Save Content</button>
            </div>

            <div className='mt-5 max-w-5xl rounded-xl border border-slate-200 bg-white p-5'>
                <h2 className='font-semibold text-slate-800'>Blog / Articles</h2>
                <div className='mt-3 flex gap-2'>
                    <input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder='New blog title' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <button onClick={publishBlog} className='px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm'>Publish</button>
                </div>
            </div>
        </div>
    )
}
