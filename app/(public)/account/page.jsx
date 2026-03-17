'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { Heart, History, MapPin, Package, ShoppingCart, UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AccountPage() {
    const cartCount = useSelector((state) => state.cart?.total || 0)
    const wishlistCount = useSelector((state) => state.wishlist?.ids?.length || 0)
    const recentCount = useSelector((state) => state.recent?.ids?.length || 0)
    const addressCount = useSelector((state) => state.address?.list?.length || 0)
    const [name, setName] = useState('GreatStack User')
    const [phone, setPhone] = useState('+0 1234567890')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const quickLinks = [
        { label: 'My Orders', href: '/orders', icon: Package, meta: 'Track and review purchases' },
        { label: 'My Wishlist', href: '/wishlist', icon: Heart, meta: `${wishlistCount} saved items` },
        { label: 'My Cart', href: '/cart', icon: ShoppingCart, meta: `${cartCount} items in cart` },
        { label: 'Shop Products', href: '/shop', icon: UserCircle2, meta: 'Explore latest products' },
    ]

    const handleProfileSave = (event) => {
        event.preventDefault()
        if (!name.trim()) {
            toast.error('Name is required')
            return
        }
        toast.success('Profile updated successfully')
    }

    const handlePasswordUpdate = (event) => {
        event.preventDefault()
        if (!currentPassword || !newPassword) {
            toast.error('Please fill both password fields')
            return
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters')
            return
        }
        setCurrentPassword('')
        setNewPassword('')
        toast.success('Password changed successfully')
    }

    return (
        <div className='mx-6 my-16 min-h-[70vh]'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-3xl font-semibold text-slate-800'>My Account</h1>
                <p className='text-slate-500 mt-2'>Manage your shopping activity and preferences.</p>

                <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-7'>
                    <div className='rounded-xl border border-slate-200 bg-white p-4'>
                        <p className='text-sm text-slate-500 flex items-center gap-2'><ShoppingCart size={16} /> Cart</p>
                        <p className='text-2xl font-semibold text-slate-800 mt-1'>{cartCount}</p>
                    </div>
                    <div className='rounded-xl border border-slate-200 bg-white p-4'>
                        <p className='text-sm text-slate-500 flex items-center gap-2'><Heart size={16} /> Wishlist</p>
                        <p className='text-2xl font-semibold text-rose-500 mt-1'>{wishlistCount}</p>
                    </div>
                    <div className='rounded-xl border border-slate-200 bg-white p-4'>
                        <p className='text-sm text-slate-500 flex items-center gap-2'><History size={16} /> Recently Viewed</p>
                        <p className='text-2xl font-semibold text-indigo-600 mt-1'>{recentCount}</p>
                    </div>
                    <div className='rounded-xl border border-slate-200 bg-white p-4'>
                        <p className='text-sm text-slate-500 flex items-center gap-2'><MapPin size={16} /> Saved Addresses</p>
                        <p className='text-2xl font-semibold text-emerald-600 mt-1'>{addressCount}</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8'>
                    {quickLinks.map((item) => (
                        <Link key={item.href} href={item.href} className='rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm'>
                            <div className='flex items-center gap-3'>
                                <item.icon size={18} className='text-slate-600' />
                                <p className='text-slate-800 font-medium'>{item.label}</p>
                            </div>
                            <p className='text-sm text-slate-500 mt-2'>{item.meta}</p>
                        </Link>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8'>
                    <form onSubmit={handleProfileSave} className='rounded-xl border border-slate-200 bg-white p-5 space-y-3'>
                        <h2 className='text-lg font-semibold text-slate-800'>Profile Details</h2>
                        <div>
                            <label className='text-sm text-slate-600'>Full name</label>
                            <input value={name} onChange={(event) => setName(event.target.value)} className='w-full mt-1 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                        </div>
                        <div>
                            <label className='text-sm text-slate-600'>Phone number</label>
                            <input value={phone} onChange={(event) => setPhone(event.target.value)} className='w-full mt-1 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                        </div>
                        <button type='submit' className='px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium'>Save profile</button>
                    </form>

                    <form onSubmit={handlePasswordUpdate} className='rounded-xl border border-slate-200 bg-white p-5 space-y-3'>
                        <h2 className='text-lg font-semibold text-slate-800'>Change Password</h2>
                        <div>
                            <label className='text-sm text-slate-600'>Current password</label>
                            <input type='password' value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className='w-full mt-1 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                        </div>
                        <div>
                            <label className='text-sm text-slate-600'>New password</label>
                            <input type='password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className='w-full mt-1 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                        </div>
                        <button type='submit' className='px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium'>Update password</button>
                        <p className='text-xs text-slate-500'>Forgot your current password? <Link href='/forgot-password' className='text-indigo-600 hover:text-indigo-700'>Reset it</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
