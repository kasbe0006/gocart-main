'use client'

import { orderDummyData } from '@/assets/assets'
import Loading from '@/components/Loading'
import StatePanel from '@/components/StatePanel'
import MetricCard from '@/components/ui/MetricCard'
import TableShell from '@/components/ui/TableShell'
import { getAllOrders, upsertOrderInStorage } from '@/lib/features/order/orderPersist'
import { CheckCircle2, RotateCcw, ShieldAlert, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSupportQueuePage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('pending')

    const fetchOrders = () => {
        setLoading(true)
        try {
            setOrders(getAllOrders(orderDummyData))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const queueOrders = useMemo(() => {
        const candidates = orders.filter((order) => {
            const hasPending = order?.supportRequests?.cancellationRequested || order?.supportRequests?.returnRequested
            const hasResolved = order?.supportRequests?.cancellationDecision || order?.supportRequests?.returnDecision
            return activeFilter === 'pending' ? hasPending : hasResolved
        })

        return [...candidates].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    }, [orders, activeFilter])

    const pendingCount = orders.filter((order) => order?.supportRequests?.cancellationRequested || order?.supportRequests?.returnRequested).length
    const approvedCount = orders.filter((order) => order?.supportRequests?.cancellationDecision === 'approve' || order?.supportRequests?.returnDecision === 'approve').length
    const rejectedCount = orders.filter((order) => order?.supportRequests?.cancellationDecision === 'reject' || order?.supportRequests?.returnDecision === 'reject').length

    const resolveRequest = ({ orderId, type, decision }) => {
        const currentOrder = orders.find((order) => order.id === orderId)
        if (!currentOrder) return

        const baseSupport = currentOrder.supportRequests || {}
        let updatedOrder = { ...currentOrder }

        if (type === 'cancellation') {
            updatedOrder = {
                ...currentOrder,
                status: decision === 'approve' ? 'CANCELLED' : (baseSupport.previousStatus || 'PROCESSING'),
                supportRequests: {
                    ...baseSupport,
                    cancellationRequested: false,
                    cancellationDecision: decision,
                    cancellationResolvedAt: new Date().toISOString(),
                },
                updatedAt: new Date().toISOString(),
            }
        }

        if (type === 'return') {
            updatedOrder = {
                ...currentOrder,
                status: decision === 'approve' ? 'RETURN_APPROVED' : 'RETURN_REJECTED',
                supportRequests: {
                    ...baseSupport,
                    returnRequested: false,
                    returnDecision: decision,
                    returnResolvedAt: new Date().toISOString(),
                },
                updatedAt: new Date().toISOString(),
            }
        }

        upsertOrderInStorage(updatedOrder)
        setOrders((previous) => previous.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
        toast.success(`${type === 'cancellation' ? 'Cancellation' : 'Return'} request ${decision === 'approve' ? 'approved' : 'rejected'}`)
    }

    if (loading) return <Loading />

    return (
        <div className='text-slate-500 mb-28'>
            <h1 className='text-2xl'>Support <span className='text-slate-800 font-medium'>Queue</span></h1>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 max-w-4xl'>
                <MetricCard title='Pending Requests' value={pendingCount} icon={ShieldAlert} valueClassName='text-amber-600' iconClassName='text-amber-500' />
                <MetricCard title='Approved Requests' value={approvedCount} icon={CheckCircle2} valueClassName='text-green-600' iconClassName='text-green-500' />
                <MetricCard title='Rejected Requests' value={rejectedCount} icon={XCircle} valueClassName='text-red-500' iconClassName='text-red-500' />
            </div>

            <div className='flex items-center gap-2 mb-4'>
                <button onClick={() => setActiveFilter('pending')} className={`px-3 py-1.5 rounded-md text-sm ${activeFilter === 'pending' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    Pending
                </button>
                <button onClick={() => setActiveFilter('resolved')} className={`px-3 py-1.5 rounded-md text-sm ${activeFilter === 'resolved' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    Resolved
                </button>
            </div>

            {queueOrders.length === 0 ? (
                <StatePanel
                    title={activeFilter === 'pending' ? 'No pending support requests' : 'No resolved requests yet'}
                    description='Support tickets will appear here once customers raise cancellation or return requests.'
                    className='max-w-4xl'
                />
            ) : (
                <TableShell className='max-w-5xl'>
                    <table className='w-full min-w-[920px] text-sm text-left text-slate-600'>
                        <thead className='bg-slate-50 text-xs uppercase tracking-wider text-slate-700'>
                            <tr>
                                <th className='px-4 py-3'>Order</th>
                                <th className='px-4 py-3'>Customer</th>
                                <th className='px-4 py-3'>Type</th>
                                <th className='px-4 py-3'>Reason</th>
                                <th className='px-4 py-3'>Current Status</th>
                                <th className='px-4 py-3'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                            {queueOrders.map((order) => {
                                const hasCancellationPending = Boolean(order?.supportRequests?.cancellationRequested)
                                const hasReturnPending = Boolean(order?.supportRequests?.returnRequested)
                                const type = hasCancellationPending ? 'Cancellation' : hasReturnPending ? 'Return' : 'Resolved'
                                const reason = hasCancellationPending
                                    ? order?.supportRequests?.cancellationReason
                                    : hasReturnPending
                                        ? order?.supportRequests?.returnReason
                                        : order?.supportRequests?.cancellationDecision
                                            ? `Cancellation ${order.supportRequests.cancellationDecision}`
                                            : order?.supportRequests?.returnDecision
                                                ? `Return ${order.supportRequests.returnDecision}`
                                                : '—'

                                return (
                                    <tr key={order.id}>
                                        <td className='px-4 py-3 font-medium text-slate-800'>{order.id}</td>
                                        <td className='px-4 py-3'>{order?.user?.name || order?.address?.name || 'Customer'}</td>
                                        <td className='px-4 py-3'>
                                            <span className='inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700'>
                                                <RotateCcw size={12} /> {type}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3 max-w-[280px] truncate'>{reason || '—'}</td>
                                        <td className='px-4 py-3'>{order.status}</td>
                                        <td className='px-4 py-3'>
                                            {(hasCancellationPending || hasReturnPending) ? (
                                                <div className='flex items-center gap-2'>
                                                    <button
                                                        onClick={() => resolveRequest({ orderId: order.id, type: hasCancellationPending ? 'cancellation' : 'return', decision: 'approve' })}
                                                        className='px-2.5 py-1 rounded bg-green-600 text-white text-xs'
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => resolveRequest({ orderId: order.id, type: hasCancellationPending ? 'cancellation' : 'return', decision: 'reject' })}
                                                        className='px-2.5 py-1 rounded bg-slate-500 text-white text-xs'
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className='text-xs text-slate-500'>Resolved</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </TableShell>
            )}
        </div>
    )
}
