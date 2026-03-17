'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import StatePanel from "@/components/StatePanel"
import MetricCard from "@/components/ui/MetricCard"
import { CheckCircle2, Clock3, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const approvedCount = stores.filter((store) => store.status === 'approved').length
    const rejectedCount = stores.filter((store) => store.status === 'rejected').length
    const pendingCount = stores.filter((store) => !['approved', 'rejected'].includes(store.status)).length


    const fetchStores = async () => {
        try {
            setError('')
            setLoading(true)
            setStores(storesDummyData)
        } catch {
            setError('Unable to load approval applications right now.')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        // Logic to approve a store


    }

    useEffect(() => {
            fetchStores()
    }, [])

    if (loading) return <Loading />
    if (error) {
        return (
            <StatePanel
                type="error"
                title="Failed to load applications"
                description={error}
                actionLabel="Try again"
                onAction={fetchStores}
                className="max-w-4xl"
            />
        )
    }

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Approve <span className="text-slate-800 font-medium">Stores</span></h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 max-w-4xl">
                <MetricCard title="Pending" value={pendingCount} icon={Clock3} valueClassName="text-amber-600" iconClassName="text-amber-500" />
                <MetricCard title="Approved" value={approvedCount} icon={CheckCircle2} valueClassName="text-green-600" iconClassName="text-green-500" />
                <MetricCard title="Rejected" value={rejectedCount} icon={XCircle} valueClassName="text-red-500" iconClassName="text-red-500" />
            </div>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "approving" })} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                    Approve
                                </button>
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'rejecting' })} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}

                </div>) : (
                <StatePanel
                    title="No application pending"
                    description="New store applications will appear here for review."
                    className="h-80 flex items-center justify-center"
                />
            )}
        </div>
    )
}