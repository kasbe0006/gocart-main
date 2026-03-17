'use client'

import { orderDummyData } from '@/assets/assets'
import { getAllOrders, upsertOrderInStorage } from '@/lib/features/order/orderPersist'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminShippingPage() {
    const [shippingCost, setShippingCost] = useState(49)
    const [partners, setPartners] = useState(['Delhivery', 'BlueDart', 'DHL'])
    const [partnerInput, setPartnerInput] = useState('')
    const [orders, setOrders] = useState(() => getAllOrders(orderDummyData))

    const addPartner = () => {
        const value = partnerInput.trim()
        if (!value) return
        setPartners((prev) => [...prev, value])
        setPartnerInput('')
        toast.success('Shipping partner added')
    }

    const updateOrderStatus = (order, status) => {
        const updated = { ...order, status, updatedAt: new Date().toISOString() }
        upsertOrderInStorage(updated)
        setOrders((prev) => prev.map((item) => item.id === order.id ? updated : item))
        toast.success(`Order marked ${status.replace('_', ' ')}`)
    }

    return (
        <div className='text-slate-600 mb-24'>
            <h1 className='text-2xl font-semibold text-slate-800'>Shipping & Delivery</h1>
            <p className='text-sm mt-1'>Manage partners, shipping costs, tracking flow, and delivery updates.</p>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 max-w-6xl'>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <h2 className='font-semibold text-slate-800'>Shipping Cost Settings</h2>
                    <div className='mt-3 flex items-center gap-2'>
                        <input type='number' min='0' value={shippingCost} onChange={(event) => setShippingCost(Number(event.target.value || 0))} className='w-28 border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                        <span className='text-sm text-slate-500'>Express shipping cost</span>
                    </div>
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <h2 className='font-semibold text-slate-800'>Shipping Partners</h2>
                    <div className='mt-3 flex gap-2'>
                        <input value={partnerInput} onChange={(event) => setPartnerInput(event.target.value)} placeholder='Add partner' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                        <button onClick={addPartner} className='px-3 py-2.5 rounded-lg bg-slate-800 text-white text-sm'>Add</button>
                    </div>
                    <div className='mt-3 flex flex-wrap gap-2'>
                        {partners.map((partner) => <span key={partner} className='px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700'>{partner}</span>)}
                    </div>
                </div>
            </div>

            <div className='mt-5 max-w-6xl overflow-x-auto rounded-xl border border-slate-200 bg-white'>
                <table className='w-full min-w-[860px] text-sm'>
                    <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr>
                            <th className='text-left px-4 py-3'>Order ID</th>
                            <th className='text-left px-4 py-3'>Current Status</th>
                            <th className='text-left px-4 py-3'>Tracking</th>
                            <th className='text-left px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className='border-b border-slate-100'>
                                <td className='px-4 py-3 text-slate-800 font-medium'>{order.id}</td>
                                <td className='px-4 py-3'>{order.status}</td>
                                <td className='px-4 py-3 text-xs text-slate-500'>TRK-{order.id.slice(-6).toUpperCase()}</td>
                                <td className='px-4 py-3 flex items-center gap-2'>
                                    <button onClick={() => updateOrderStatus(order, 'PROCESSING')} className='px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs'>Processing</button>
                                    <button onClick={() => updateOrderStatus(order, 'SHIPPED')} className='px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs'>Shipped</button>
                                    <button onClick={() => updateOrderStatus(order, 'DELIVERED')} className='px-3 py-1.5 rounded-md bg-green-600 text-white text-xs'>Delivered</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
