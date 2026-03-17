'use client'

import { setAdminSession } from '@/lib/features/admin/adminSession'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('admin')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!email.trim() || !password.trim()) {
            toast.error('Email and password are required')
            return
        }

        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 600))
            setAdminSession({ email, role, loggedInAt: new Date().toISOString() })
            toast.success('Admin login successful')
            window.dispatchEvent(new Event('app:navigation-start'))
            router.push('/admin')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-6 bg-slate-100'>
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6'>
                <h1 className='text-2xl font-semibold text-slate-800'>Admin Login</h1>
                <p className='text-sm text-slate-500 mt-1'>Use role-based admin access for dashboard modules.</p>

                <div className='mt-5 space-y-3'>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='admin@example.com' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                    <select value={role} onChange={(e) => setRole(e.target.value)} className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none'>
                        <option value='admin'>Admin</option>
                        <option value='manager'>Manager</option>
                        <option value='staff'>Staff</option>
                    </select>
                </div>

                <button disabled={loading} type='submit' className='w-full mt-4 bg-slate-800 text-white rounded-lg py-2.5 font-medium'>
                    {loading ? 'Signing in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}
