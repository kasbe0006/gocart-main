'use client'
import { storesDummyData } from "@/assets/assets"
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

    const activeStoresCount = stores.filter((store) => store.isActive).length
    const inactiveStoresCount = stores.filter((store) => !store.isActive).length

    const fetchStores = async () => {
        try {
            setError('')
            setLoading(true)
            setStores(storesDummyData)
        } catch {
            setError('Unable to load store list right now.')
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId) => {
        // Logic to toggle the status of a store

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