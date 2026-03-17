'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { orderDummyData } from "@/assets/assets";
import Loading from "@/components/Loading";
import StatePanel from "@/components/StatePanel";
import MetricCard from "@/components/ui/MetricCard";
import TableShell from "@/components/ui/TableShell";
import { CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import { getAllOrders } from "@/lib/features/order/orderPersist";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        try {
            setError('')
            setLoading(true)
            setOrders(getAllOrders(orderDummyData))
        } catch {
            setError('Unable to load your orders right now.')
        } finally {
            setLoading(false)
        }
    }, []);

    const deliveredCount = orders.filter((order) => order.status === 'DELIVERED').length
    const processingCount = orders.filter((order) => ['ORDER_PLACED', 'PROCESSING', 'SHIPPED'].includes(order.status)).length

    if (loading) return <Loading />
    if (error) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <StatePanel
                    type="error"
                    title="Failed to load orders"
                    description={error}
                    className="max-w-3xl w-full"
                />
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                            <MetricCard title="Total Orders" value={orders.length} icon={PackageCheck} iconClassName="text-slate-500" />
                            <MetricCard title="In Progress" value={processingCount} icon={Clock3} valueClassName="text-amber-600" iconClassName="text-amber-500" />
                            <MetricCard title="Delivered" value={deliveredCount} icon={CheckCircle2} valueClassName="text-green-600" iconClassName="text-green-500" />
                        </div>

                        <TableShell className="p-3 sm:p-4">
                            <table className="w-full min-w-[720px] text-slate-500 table-auto border-separate border-spacing-y-6 border-spacing-x-2">
                                <thead>
                                    <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                        <th className="text-left">Product</th>
                                        <th className="text-center">Total Price</th>
                                        <th className="text-left">Address</th>
                                        <th className="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <OrderItem order={order} key={order.id} />
                                    ))}
                                </tbody>
                            </table>
                        </TableShell>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex flex-col items-center justify-center text-center">
                    <StatePanel
                        title="You have no orders yet"
                        description="Once you place an order, tracking details will appear here."
                        actionLabel="Start Shopping"
                        onAction={() => window.location.assign('/shop')}
                        className="max-w-3xl w-full"
                    />
                </div>
            )}
        </div>
    )
}