'use client'

import Loading from '@/components/Loading'
import StatePanel from '@/components/StatePanel'
import SurfaceCard from '@/components/ui/SurfaceCard'
import { Ban, Mail, Shield, UserCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/v1/admin/users', { cache: 'no-store' })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to fetch users')
            }
            setUsers(payload.data?.users || [])
        } catch (error) {
            toast.error(error.message || 'Unable to fetch users')
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter((user) => {
        const keyword = query.toLowerCase().trim()
        if (!keyword) return true
        return user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword) || user.role.toLowerCase().includes(keyword)
    })

    const toDisplayStatus = (status) => {
        if (!status) return 'Unknown'
        return status[0] + status.slice(1).toLowerCase()
    }

    const updateUserStatus = async (userId, status) => {
        try {
            const response = await fetch(`/api/v1/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to update user status')
            }

            setUsers((prev) => prev.map((user) => user.id === userId ? { ...user, status } : user))
            toast.success(`User marked as ${toDisplayStatus(status)}`)
        } catch (error) {
            toast.error(error.message || 'Unable to update user status')
        }
    }

    if (loading) return <Loading />

    if (!users.length) {
        return (
            <StatePanel
                title='No users available'
                description='Users will appear here once accounts are created.'
                className='h-80 flex items-center justify-center'
            />
        )
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Manage Users</h1>
            <p className='text-sm mt-1'>View user profiles, role distribution, and activity summary.</p>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 max-w-4xl'>
                <SurfaceCard className='p-4'>
                    <p className='text-sm text-slate-500 flex items-center gap-2'><Users size={15} /> Total Users</p>
                    <p className='text-2xl font-semibold text-slate-800 mt-1'>{users.length}</p>
                </SurfaceCard>
                <SurfaceCard className='p-4'>
                    <p className='text-sm text-slate-500 flex items-center gap-2'><UserCheck size={15} /> Active Users</p>
                    <p className='text-2xl font-semibold text-green-600 mt-1'>{users.filter((user) => user.status === 'ACTIVE').length}</p>
                </SurfaceCard>
                <SurfaceCard className='p-4'>
                    <p className='text-sm text-slate-500 flex items-center gap-2'><Shield size={15} /> Store Owners</p>
                    <p className='text-2xl font-semibold text-indigo-600 mt-1'>{users.filter((user) => user.storeCount > 0).length}</p>
                </SurfaceCard>
            </div>

            <div className='max-w-4xl mb-4'>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder='Search users by name, email, or role'
                    className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none'
                />
            </div>

            <SurfaceCard className='max-w-4xl overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[760px] text-sm'>
                        <thead>
                            <tr className='border-b border-slate-200 bg-slate-50'>
                                <th className='text-left px-4 py-3 font-medium text-slate-700'>User</th>
                                <th className='text-left px-4 py-3 font-medium text-slate-700'>Role</th>
                                <th className='text-left px-4 py-3 font-medium text-slate-700'>Orders</th>
                                <th className='text-left px-4 py-3 font-medium text-slate-700'>Stores</th>
                                <th className='text-left px-4 py-3 font-medium text-slate-700'>Status</th>
                                <th className='text-left px-4 py-3 font-medium text-slate-700'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className='border-b border-slate-100'>
                                    <td className='px-4 py-3'>
                                        <p className='font-medium text-slate-800'>{user.name}</p>
                                        <p className='text-xs text-slate-500 flex items-center gap-1 mt-1'><Mail size={12} /> {user.email}</p>
                                    </td>
                                    <td className='px-4 py-3'>{user.role}</td>
                                    <td className='px-4 py-3'>{user.orderCount}</td>
                                    <td className='px-4 py-3'>{user.storeCount}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {toDisplayStatus(user.status)}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <div className='flex items-center gap-2'>
                                            <button onClick={() => updateUserStatus(user.id, 'ACTIVE')} className='px-2.5 py-1 rounded text-xs bg-green-600 text-white'>Activate</button>
                                            <button onClick={() => updateUserStatus(user.id, 'BLOCKED')} className='px-2.5 py-1 rounded text-xs bg-rose-600 text-white inline-flex items-center gap-1'>
                                                <Ban size={12} /> Block
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SurfaceCard>
        </div>
    )
}
