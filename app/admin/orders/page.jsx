'use client'

import Loading from '@/components/Loading'
import StatePanel from '@/components/StatePanel'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/v1/admin/orders', { cache: 'no-store' })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to fetch orders')
            }
            setOrders(payload.data?.orders || [])
        } catch (error) {
            toast.error(error.message || 'Unable to fetch orders')
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const updateStatus = async (order, status) => {
        try {
            const response = await fetch(`/api/v1/admin/orders/${order.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to update order status')
            }

            setOrders((prev) => prev.map((item) => item.id === order.id ? payload.data.order : item))
            toast.success(`Order updated to ${status.replace(/_/g, ' ')}`)
        } catch (error) {
            toast.error(error.message || 'Unable to update order status')
        }
    }

    if (loading) return <Loading />

    if (!orders.length) {
        return (
            <StatePanel
                title='No orders available'
                description='Orders will appear here once checkout is completed.'
                className='h-80 flex items-center justify-center'
            />
        )
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Order Management</h1>
            <p className='text-sm mt-1'>View all orders, update status, cancel, and generate invoices.</p>

            <div className='mt-5 max-w-6xl overflow-x-auto rounded-xl border border-slate-200 bg-white'>
                <table className='w-full min-w-[980px] text-sm'>
                    <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr>
                            <th className='text-left px-4 py-3'>Order ID</th>
                            <th className='text-left px-4 py-3'>Customer</th>
                            <th className='text-left px-4 py-3'>Amount</th>
                            <th className='text-left px-4 py-3'>Status</th>
                            <th className='text-left px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className='border-b border-slate-100'>
                                <td className='px-4 py-3 text-slate-800 font-medium'>{order.id}</td>
                                <td className='px-4 py-3'>{order.user?.name || order.address?.name || 'Customer'}</td>
                                <td className='px-4 py-3'>{currency}{Number(order.total || 0).toFixed(2)}</td>
                                <td className='px-4 py-3'>{order.status}</td>
                                <td className='px-4 py-3 flex items-center gap-2'>
                                    <button onClick={() => updateStatus(order, 'PROCESSING')} className='px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs'>Processing</button>
                                    <button onClick={() => updateStatus(order, 'SHIPPED')} className='px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs'>Shipped</button>
                                    <button onClick={() => updateStatus(order, 'DELIVERED')} className='px-3 py-1.5 rounded-md bg-green-600 text-white text-xs'>Delivered</button>
                                    <button onClick={() => window.open(`/orders/${order.id}`, '_blank')} className='px-3 py-1.5 rounded-md bg-slate-700 text-white text-xs'>Invoice</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
