'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import StatePanel from "@/components/StatePanel"
import MetricCard from "@/components/ui/MetricCard"
import { CheckCircle2, Store, StoreIcon as StoreOff } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminStores() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const activeStoresCount = stores.filter((store) => store.isActive).length
    const inactiveStoresCount = stores.filter((store) => !store.isActive).length

    const fetchStores = async (filters = {}) => {
        try {
            setError('')
            setLoading(true)

            const nextStatus = filters.status ?? statusFilter
            const nextSearch = filters.search ?? searchQuery

            const queryParams = new URLSearchParams()
            if (nextStatus) queryParams.set('status', nextStatus)
            if (nextSearch?.trim()) queryParams.set('search', nextSearch.trim())

            const endpoint = queryParams.toString()
                ? `/api/v1/admin/stores?${queryParams.toString()}`
                : '/api/v1/admin/stores'

            const response = await fetch(endpoint, { cache: 'no-store' })
            const result = await response.json()

            if (!response.ok || !result?.success) {
                throw new Error(result?.error?.message || 'Failed to fetch stores')
            }

            setStores(result?.data?.stores || [])
        } catch {
            setError('Unable to load store list right now.')
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = async (event) => {
        event.preventDefault()
        await fetchStores({ status: statusFilter, search: searchQuery })
    }

    const clearFilters = async () => {
        setStatusFilter('')
        setSearchQuery('')
        await fetchStores({ status: '', search: '' })
    }

    const toggleIsActive = async (storeId) => {
        const targetStore = stores.find((store) => store.id === storeId)
        if (!targetStore) return

        const nextIsActive = !targetStore.isActive

        const response = await fetch(`/api/v1/admin/stores/${storeId}/active`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: nextIsActive }),
        })

        const result = await response.json()

        if (!response.ok || !result?.success) {
            throw new Error(result?.error?.message || 'Failed to update store status')
        }

        setStores((prevStores) => prevStores.map((store) => (store.id === storeId ? result.data.store : store)))
        toast.success(`Store ${nextIsActive ? 'activated' : 'deactivated'} successfully`)
    }

    const updateStoreApprovalStatus = async (storeId, status) => {
        const response = await fetch(`/api/v1/admin/stores/${storeId}/approval`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        })

        const result = await response.json()
        if (!response.ok || !result?.success) {
            throw new Error(result?.error?.message || 'Failed to update store approval status')
        }

        setStores((prevStores) => prevStores.map((store) => (store.id === storeId ? result.data.store : store)))
        toast.success(`Store ${status} successfully`)

        if (statusFilter) {
            await fetchStores({ status: statusFilter, search: searchQuery })
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) return <Loading />
    if (error) {
        return (
            <StatePanel
                type="error"
                title="Failed to load stores"
                description={error}
                actionLabel="Try again"
                onAction={fetchStores}
                className="max-w-4xl"
            />
        )
    }

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Live <span className="text-slate-800 font-medium">Stores</span></h1>

            <form onSubmit={applyFilters} className="my-4 max-w-4xl flex flex-wrap items-center gap-3">
                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name, username, email"
                    className="flex-1 min-w-64 px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700"
                />

                <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
                >
                    Apply
                </button>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                    Clear
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 max-w-4xl">
                <MetricCard title="Total Stores" value={stores.length} icon={Store} iconClassName="text-slate-500" />
                <MetricCard title="Active" value={activeStoresCount} icon={CheckCircle2} valueClassName="text-green-600" iconClassName="text-green-500" />
                <MetricCard title="Inactive" value={inactiveStoresCount} icon={StoreOff} valueClassName="text-red-500" iconClassName="text-red-500" />
            </div>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <p>Status</p>
                                <button
                                    type="button"
                                    onClick={() => toast.promise(updateStoreApprovalStatus(store.id, 'approved'), { loading: 'Updating status...' })}
                                    disabled={store.status === 'approved'}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                                        store.status === 'approved'
                                            ? 'bg-green-50 text-green-700 border-green-200 cursor-not-allowed'
                                            : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                                    }`}
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toast.promise(updateStoreApprovalStatus(store.id, 'rejected'), { loading: 'Updating status...' })}
                                    disabled={store.status === 'rejected'}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                                        store.status === 'rejected'
                                            ? 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed'
                                            : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                                    }`}
                                >
                                    Reject
                                </button>

                                <p>Active</p>
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleIsActive(store.id), { loading: "Updating data..." })} checked={store.isActive} />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <StatePanel
                    title="No stores available"
                    description="Live stores will be listed here once available."
                    className="h-80 flex items-center justify-center"
                />
            )
            }
        </div>
    )
}