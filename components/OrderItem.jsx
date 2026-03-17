'use client'
import Image from "next/image";
import { DotIcon, PackageCheck, Truck, PackageSearch, ClipboardList, XCircle, RotateCcw, ShieldCheck, ShieldX } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import Link from "next/link";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    const orderSteps = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const currentStepIndex = Math.max(orderSteps.indexOf(order.status), 0)
    const isProgressTrackVisible = orderSteps.includes(order.status)

    const statusConfig = {
        ORDER_PLACED: { className: 'text-blue-700 bg-blue-100', icon: ClipboardList },
        PROCESSING: { className: 'text-amber-700 bg-amber-100', icon: PackageSearch },
        SHIPPED: { className: 'text-indigo-700 bg-indigo-100', icon: Truck },
        DELIVERED: { className: 'text-green-700 bg-green-100', icon: PackageCheck },
        CANCELLATION_REQUESTED: { className: 'text-amber-700 bg-amber-100', icon: RotateCcw },
        CANCELLED: { className: 'text-red-700 bg-red-100', icon: XCircle },
        RETURN_REQUESTED: { className: 'text-indigo-700 bg-indigo-100', icon: RotateCcw },
        RETURN_APPROVED: { className: 'text-emerald-700 bg-emerald-100', icon: ShieldCheck },
        RETURN_REJECTED: { className: 'text-rose-700 bg-rose-100', icon: ShieldX },
    }

    const activeStatus = statusConfig[order.status] || statusConfig.ORDER_PLACED
    const ActiveStatusIcon = activeStatus.icon
    const displayStatus = order.status.replace(/_/g, ' ')

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images?.[0]?.src || item.product.images?.[0] || '/placeholder.jpg'}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    <Link href={`/orders/${order.id}`} className="text-xs text-indigo-600 hover:text-indigo-700 mb-1">View Invoice</Link>
                                    {order?.supportRequests?.cancellationRequested && (
                                        <span className="inline-flex w-fit text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 mb-1">
                                            Cancellation Requested
                                        </span>
                                    )}
                                    {order?.supportRequests?.returnRequested && (
                                        <span className="inline-flex w-fit text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 mb-1">
                                            Return Requested
                                        </span>
                                    )}
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}

                        {isProgressTrackVisible && <div className="hidden md:flex items-center gap-2 mt-1">
                            {orderSteps.map((step, index) => (
                                <div key={step} className="flex items-center gap-2">
                                    <span className={`size-2.5 rounded-full ${index <= currentStepIndex ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    {index < orderSteps.length - 1 && (
                                        <span className={`w-10 h-0.5 ${index < currentStepIndex ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    )}
                                </div>
                            ))}
                            <span className="ml-2 text-xs text-slate-500">Tracking progress</span>
                        </div>}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 ${activeStatus.className}`}
                    >
                        <ActiveStatusIcon size={14} />
                        {displayStatus}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex items-center justify-center mb-3">
                        <span className={`text-center mx-auto px-4 py-1.5 rounded-full inline-flex items-center gap-1 ${activeStatus.className}`} >
                            <ActiveStatusIcon size={14} />
                            {displayStatus}
                        </span>
                    </div>

                    {isProgressTrackVisible && <div className="flex items-center justify-center gap-2">
                        {orderSteps.map((step, index) => (
                            <div key={step} className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${index <= currentStepIndex ? 'bg-green-500' : 'bg-slate-300'}`} />
                                {index < orderSteps.length - 1 && (
                                    <span className={`w-6 h-0.5 ${index < currentStepIndex ? 'bg-green-500' : 'bg-slate-300'}`} />
                                )}
                            </div>
                        ))}
                    </div>}
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-200 w-full mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem