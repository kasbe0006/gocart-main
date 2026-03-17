'use client'

import { orderDummyData } from '@/assets/assets'
import { getAllOrders, upsertOrderInStorage } from '@/lib/features/order/orderPersist'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminPaymentsPage() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [orders, setOrders] = useState(() => getAllOrders(orderDummyData))

    const totals = useMemo(() => {
        const totalTransactions = orders.length
        const paid = orders.filter((order) => order.isPaid).length
        const refunded = orders.filter((order) => order.paymentStatus === 'REFUNDED').length
        const revenue = orders.filter((order) => order.paymentStatus !== 'REFUNDED').reduce((sum, order) => sum + Number(order.total || 0), 0)
        return { totalTransactions, paid, refunded, revenue }
    }, [orders])

    const verifyPayment = (order) => {
        const updated = { ...order, isPaid: true, paymentStatus: 'VERIFIED', updatedAt: new Date().toISOString() }
        upsertOrderInStorage(updated)
        setOrders((prev) => prev.map((item) => item.id === order.id ? updated : item))
        toast.success('Payment verified')
    }

    const refundPayment = (order) => {
        const updated = { ...order, paymentStatus: 'REFUNDED', updatedAt: new Date().toISOString() }
        upsertOrderInStorage(updated)
        setOrders((prev) => prev.map((item) => item.id === order.id ? updated : item))
        toast.success('Refund processed')
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Payment Management</h1>
            <p className='text-sm mt-1'>View transactions, verify payments, process refunds, and track reports.</p>

            <div className='grid grid-cols-1 sm:grid-cols-4 gap-3 my-5 max-w-6xl'>
                <div className='rounded-lg border border-slate-200 bg-white p-4'><p className='text-xs text-slate-500'>Transactions</p><p className='text-2xl font-semibold text-slate-800'>{totals.totalTransactions}</p></div>
                <div className='rounded-lg border border-slate-200 bg-white p-4'><p className='text-xs text-slate-500'>Verified</p><p className='text-2xl font-semibold text-green-600'>{totals.paid}</p></div>
                <div className='rounded-lg border border-slate-200 bg-white p-4'><p className='text-xs text-slate-500'>Refunded</p><p className='text-2xl font-semibold text-red-600'>{totals.refunded}</p></div>
                <div className='rounded-lg border border-slate-200 bg-white p-4'><p className='text-xs text-slate-500'>Revenue</p><p className='text-2xl font-semibold text-indigo-600'>{currency}{totals.revenue.toFixed(2)}</p></div>
            </div>

            <div className='max-w-6xl overflow-x-auto rounded-xl border border-slate-200 bg-white'>
                <table className='w-full min-w-[860px] text-sm'>
                    <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr>
                            <th className='text-left px-4 py-3'>Order ID</th>
                            <th className='text-left px-4 py-3'>Method</th>
                            <th className='text-left px-4 py-3'>Amount</th>
                            <th className='text-left px-4 py-3'>Status</th>
                            <th className='text-left px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className='border-b border-slate-100'>
                                <td className='px-4 py-3 font-medium text-slate-800'>{order.id}</td>
                                <td className='px-4 py-3'>{order.paymentMethod || 'COD'}</td>
                                <td className='px-4 py-3'>{currency}{Number(order.total || 0).toFixed(2)}</td>
                                <td className='px-4 py-3'>
                                    <span className={`px-2 py-1 rounded-full text-xs ${(order.paymentStatus === 'REFUNDED') ? 'bg-red-100 text-red-700' : (order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}`}>
                                        {order.paymentStatus || (order.isPaid ? 'VERIFIED' : 'PENDING')}
                                    </span>
                                </td>
                                <td className='px-4 py-3 flex items-center gap-2'>
                                    <button onClick={() => verifyPayment(order)} className='px-3 py-1.5 rounded-md bg-green-600 text-white text-xs'>Verify</button>
                                    <button onClick={() => refundPayment(order)} className='px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs'>Refund</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
