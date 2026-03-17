'use client'

import { Bell, CheckCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { loadNotifications, markAllNotificationsRead } from '@/lib/features/notification/notificationPersist'

export default function NotificationsPage() {
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(loadNotifications())
    }, [])

    const handleMarkAllRead = () => {
        setItems(markAllNotificationsRead())
    }

    return (
        <div className='mx-6 my-14 min-h-[70vh]'>
            <div className='max-w-5xl mx-auto'>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='text-3xl font-semibold text-slate-800 flex items-center gap-2'><Bell size={22} /> Notifications</h1>
                    <button onClick={handleMarkAllRead} className='px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 inline-flex items-center gap-1'>
                        <CheckCheck size={15} /> Mark all read
                    </button>
                </div>

                <div className='mt-6 rounded-xl border border-slate-200 bg-white divide-y divide-slate-200'>
                    {items.length > 0 ? items.map((item) => (
                        <div key={item.id} className={`p-4 ${item.read ? 'bg-white' : 'bg-indigo-50/50'}`}>
                            <p className='text-sm font-medium text-slate-800'>{item.title}</p>
                            <p className='text-sm text-slate-600 mt-1'>{item.message}</p>
                            <p className='text-xs text-slate-500 mt-2'>{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                    )) : (
                        <div className='p-8 text-sm text-slate-500'>No notifications yet.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
