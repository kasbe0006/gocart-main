'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import StatePanel from "@/components/StatePanel"
import MetricCard from "@/components/ui/MetricCard"
import TableShell from "@/components/ui/TableShell"
import { productDummyData } from "@/assets/assets"
import { PackageCheck, PackageX, ShoppingBasket } from "lucide-react"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [error, setError] = useState('')

    const inStockCount = products.filter((product) => product.inStock).length
    const outOfStockCount = products.filter((product) => !product.inStock).length

    const fetchProducts = async () => {
        try {
            setError('')
            setLoading(true)
            setProducts(productDummyData)
        } catch {
            setError('Unable to load products right now.')
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        // Logic to toggle the stock of a product


    }

    useEffect(() => {
            fetchProducts()
    }, [])

    if (loading) return <Loading />
    if (error) {
        return (
            <StatePanel
                type="error"
                title="Failed to load products"
                description={error}
                actionLabel="Try again"
                onAction={fetchProducts}
                className="max-w-4xl"
            />
        )
    }

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-4xl">
                <MetricCard title="Total Products" value={products.length} icon={ShoppingBasket} iconClassName="text-slate-400" />
                <MetricCard title="In Stock" value={inStockCount} icon={PackageCheck} valueClassName="text-green-600" iconClassName="text-green-500" />
                <MetricCard title="Out of Stock" value={outOfStockCount} icon={PackageX} valueClassName="text-red-500" iconClassName="text-red-500" />
            </div>

            {products.length === 0 ? (
                <StatePanel
                    title="No products found"
                    description="Add your first product to start managing inventory."
                    className="max-w-4xl"
                />
            ) : (
                <TableShell className="max-w-4xl shadow-sm ring ring-slate-200 border-transparent">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3 hidden md:table-cell">Description</th>
                                <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 items-center">
                                            <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" unoptimized />
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span>{currency} {product.price.toLocaleString()}</span>
                                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.inStock ? 'In Stock' : 'Out'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating data..." })} checked={product.inStock} />
                                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableShell>
            )}
        </>
    )
}