'use client'

import { orderDummyData } from '@/assets/assets'
import StatePanel from '@/components/StatePanel'
import { getAllOrders, upsertOrderInStorage } from '@/lib/features/order/orderPersist'
import { CalendarDays, CreditCard, MapPin, Package, ReceiptText } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
    const { orderId } = useParams()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const [requestNote, setRequestNote] = useState('')

    const order = useMemo(() => {
        const allOrders = getAllOrders(orderDummyData)
        return allOrders.find((item) => item.id === orderId)
    }, [orderId])

    if (!order) {
        return (
            <div className='mx-6 min-h-[80vh] flex items-center justify-center'>
                <StatePanel
                    title='Order not found'
                    description='The order you are looking for does not exist or was removed.'
                    actionLabel='Back to Orders'
                    onAction={() => window.location.assign('/orders')}
                    className='max-w-3xl w-full'
                />
            </div>
        )
    }

    const statusLabel = order.status?.replace(/_/g, ' ') || 'ORDER PLACED'
    const canRequestCancellation = ['ORDER_PLACED', 'PROCESSING'].includes(order.status) && !order?.supportRequests?.cancellationRequested
    const canRequestReturn = order.status === 'DELIVERED' && !order?.supportRequests?.returnRequested

    const handleRequestSupport = (type) => {
        const trimmedNote = requestNote.trim()
        if (!trimmedNote) {
            toast.error('Please provide a short reason')
            return
        }

        const supportRequests = {
            ...(order.supportRequests || {}),
            ...(type === 'cancellation'
                ? {
                    cancellationRequested: true,
                    cancellationReason: trimmedNote,
                    cancellationRequestedAt: new Date().toISOString(),
                    previousStatus: order.status,
                }
                : {
                    returnRequested: true,
                    returnReason: trimmedNote,
                    returnRequestedAt: new Date().toISOString(),
                    previousStatus: order.status,
                }),
        }

        const updatedOrder = {
            ...order,
            status: type === 'cancellation' ? 'CANCELLATION_REQUESTED' : 'RETURN_REQUESTED',
            supportRequests,
            updatedAt: new Date().toISOString(),
        }

        upsertOrderInStorage(updatedOrder)
        toast.success(type === 'cancellation' ? 'Cancellation request submitted' : 'Return request submitted')
        window.location.reload()
    }

    return (
        <div className='mx-6 my-14 min-h-[70vh]'>
            <div className='max-w-5xl mx-auto'>
                <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
                    <h1 className='text-2xl sm:text-3xl font-semibold text-slate-800'>Order Invoice</h1>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => window.print()} className='text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50'>Download Invoice (PDF)</button>
                        <Link href='/orders' className='text-sm text-slate-600 hover:text-slate-900'>Back to Orders</Link>
                    </div>
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-5 sm:p-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='space-y-2 text-sm text-slate-600'>
                            <p className='flex items-center gap-2'><ReceiptText size={16} /> <span className='font-medium text-slate-800'>Order ID:</span> {order.id}</p>
                            <p className='flex items-center gap-2'><Package size={16} /> <span className='font-medium text-slate-800'>Status:</span> <span className='px-2 py-1 rounded-full bg-slate-100 text-slate-700'>{statusLabel}</span></p>
                            <p className='flex items-center gap-2'><CalendarDays size={16} /> <span className='font-medium text-slate-800'>Placed on:</span> {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className='space-y-2 text-sm text-slate-600'>
                            <p className='flex items-center gap-2'><CreditCard size={16} /> <span className='font-medium text-slate-800'>Payment:</span> {order.paymentMethod}</p>
                            <p><span className='font-medium text-slate-800'>Payment Detail:</span> {order.paymentDetails?.label || (order.isPaid ? 'Paid' : 'Pending')}</p>
                            <p><span className='font-medium text-slate-800'>Delivery Slot:</span> {order.deliverySlot || 'Standard delivery'}</p>
                        </div>
                    </div>
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-5 sm:p-6 mt-5'>
                    <h2 className='text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2'><MapPin size={17} /> Delivery Address</h2>
                    <p className='text-slate-700 text-sm'>{order.address?.name}</p>
                    <p className='text-slate-600 text-sm'>{order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.zip}, {order.address?.country}</p>
                    <p className='text-slate-600 text-sm'>{order.address?.phone}</p>
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-5 sm:p-6 mt-5'>
                    <h2 className='text-lg font-semibold text-slate-800 mb-3'>Post-purchase Support</h2>

                    {(order.supportRequests?.cancellationRequested || order.supportRequests?.returnRequested) ? (
                        <div className='space-y-2 text-sm'>
                            {order.supportRequests?.cancellationRequested && (
                                <p className='text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2'>
                                    Cancellation requested: {order.supportRequests.cancellationReason}
                                </p>
                            )}
                            {order.supportRequests?.returnRequested && (
                                <p className='text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md px-3 py-2'>
                                    Return requested: {order.supportRequests.returnReason}
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={requestNote}
                                onChange={(event) => setRequestNote(event.target.value)}
                                placeholder='Write a brief reason for your request'
                                rows={3}
                                className='w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none'
                            />

                            <div className='mt-3 flex flex-wrap gap-2'>
                                {canRequestCancellation && (
                                    <button onClick={() => handleRequestSupport('cancellation')} className='px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium'>
                                        Request Cancellation
                                    </button>
                                )}
                                {canRequestReturn && (
                                    <button onClick={() => handleRequestSupport('return')} className='px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium'>
                                        Request Return
                                    </button>
                                )}
                                {!canRequestCancellation && !canRequestReturn && (
                                    <p className='text-sm text-slate-500'>No support actions available for this order status.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-5 sm:p-6 mt-5'>
                    <h2 className='text-lg font-semibold text-slate-800 mb-4'>Items</h2>
                    <div className='space-y-3'>
                        {order.orderItems?.map((item, index) => (
                            <div key={`${item.productId}-${index}`} className='flex items-center justify-between gap-3 border border-slate-100 rounded-lg p-3'>
                                <div>
                                    <p className='text-slate-800 font-medium'>{item.product?.name || 'Product'}</p>
                                    <p className='text-xs text-slate-500'>Qty: {item.quantity}</p>
                                </div>
                                <p className='text-slate-700 font-medium'>{currency}{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className='mt-5 pt-4 border-t border-slate-200 text-sm text-slate-600 space-y-1'>
                        <div className='flex items-center justify-between'>
                            <p>Subtotal</p>
                            <p>{currency}{order.total?.toLocaleString()}</p>
                        </div>
                        {order.isCouponUsed && order.coupon && (
                            <div className='flex items-center justify-between text-green-700'>
                                <p>Coupon ({order.coupon.code})</p>
                                <p>-{order.coupon.discount}%</p>
                            </div>
                        )}
                        <div className='flex items-center justify-between text-base font-semibold text-slate-800 pt-1'>
                            <p>Total</p>
                            <p>{currency}{order.total?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
