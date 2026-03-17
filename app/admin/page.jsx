'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import StatePanel from "@/components/StatePanel"
import SurfaceCard from "@/components/ui/SurfaceCard"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, TrendingUp, AlertCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })
    const [error, setError] = useState('')

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon, color: 'bg-blue-500', trend: '+12%' },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon, color: 'bg-green-500', trend: '+8.5%' },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon, color: 'bg-purple-500', trend: '+23%' },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon, color: 'bg-orange-500', trend: '+5%' },
    ]

    const quickActions = [
        { label: 'Manage Products', href: '/admin/products', icon: ShoppingBasketIcon, color: 'from-green-500 to-green-600' },
        { label: 'Coupons', href: '/admin/coupons', icon: TagsIcon, color: 'from-purple-500 to-purple-600' },
    ]

    const fetchDashboardData = async () => {
        try {
            setError('')
            setLoading(true)
            setDashboardData(dummyAdminDashboardData)
        } catch {
            setError('Unable to load admin dashboard right now.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />
    if (error) {
        return (
            <StatePanel
                type="error"
                title="Failed to load dashboard"
                description={error}
                actionLabel="Try again"
                onAction={fetchDashboardData}
                className="max-w-4xl"
            />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                    Admin <span className="text-green-600">Dashboard</span>
                </h1>
                <p className="text-slate-600">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardCardsData.map((card, index) => {
                    const IconComponent = card.icon
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${card.color} p-3 rounded-lg text-white`}>
                                        <IconComponent size={24} />
                                    </div>
                                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full">
                                        <TrendingUp size={16} />
                                        {card.trend}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-1 font-medium">{card.title}</p>
                                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                        <Link key={index} href={action.href} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100 overflow-hidden hover:scale-105 transform">
                            <div className={`bg-gradient-to-br ${action.color} p-6 text-white flex items-center justify-between`}>
                                <div>
                                    <p className="font-semibold text-lg">{action.label}</p>
                                    <p className="text-white/80 text-sm">Manage & review</p>
                                </div>
                                <IconComponent size={32} className="opacity-80" />
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Charts Section */}
            <SurfaceCard className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Revenue Trends</h2>
                    <BarChart3 size={24} className="text-slate-600" />
                </div>
                <OrdersAreaChart allOrders={dashboardData.allOrders} />
            </SurfaceCard>

            {/* Recent Orders Preview */}
            <SurfaceCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>
                    <Link href="#" className="text-green-600 font-semibold hover:text-green-700 transition">View All</Link>
                </div>
                
                {dashboardData.allOrders && dashboardData.allOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Order ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Customer</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Amount</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.allOrders.slice(0, 5).map((order, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="py-3 px-4 font-medium text-slate-900">#{order._id?.slice(-6) || index + 1}</td>
                                        <td className="py-3 px-4 text-slate-600">{order.userId?.username || 'Customer'}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-900">{currency}{order.totalPrice || 0}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">No orders yet</p>
                    </div>
                )}
            </SurfaceCard>
        </div>
    )
}