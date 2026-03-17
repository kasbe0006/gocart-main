import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { applyCoupon, removeCoupon } from '@/lib/features/coupon/couponSlice';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { addOrderToStorage } from '@/lib/features/order/orderPersist';
import { pushNotification } from '@/lib/features/notification/notificationPersist';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);
    const { appliedCoupon, discountAmount, error } = useSelector(state => state.coupon);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [deliverySlot, setDeliverySlot] = useState('Tomorrow, 10:00 AM - 1:00 PM')
    const [shippingMethod, setShippingMethod] = useState('Standard')
    const [selectedPaymentId, setSelectedPaymentId] = useState('card_1')
    const [upiId, setUpiId] = useState('')
    const [walletProvider, setWalletProvider] = useState('Paytm')
    const [selectedBank, setSelectedBank] = useState('HDFC Bank')
    const [showConfirmStep, setShowConfirmStep] = useState(false)

    const deliverySlots = [
        'Today, 6:00 PM - 9:00 PM',
        'Tomorrow, 10:00 AM - 1:00 PM',
        'Tomorrow, 2:00 PM - 5:00 PM',
        'Day after tomorrow, 10:00 AM - 1:00 PM',
    ]

    const savedPaymentMethods = [
        { id: 'card_1', label: 'Visa ending 4242', meta: 'Exp 12/28' },
        { id: 'card_2', label: 'Mastercard ending 8910', meta: 'Exp 09/27' },
    ]

    const shippingFee = shippingMethod === 'Express' ? 49 : 0
    const safeDiscountAmount = Math.min(discountAmount || 0, (totalPrice || 0) + shippingFee)
    const finalTotal = Math.max(((totalPrice || 0) + shippingFee) - safeDiscountAmount, 0)
    const canPlaceOrder = Boolean(selectedAddress) && items.length > 0 && Boolean(deliverySlot)

    const handleCouponCode = async (event) => {
        event.preventDefault();
        
        if (!couponCodeInput.trim()) {
            toast.error('Please enter a coupon code')
            return
        }

        console.log('🎟️ Applying coupon:', couponCodeInput, 'Total:', totalPrice)
        dispatch(applyCoupon({ code: couponCodeInput.toUpperCase(), cartTotal: totalPrice }))
        setCouponCodeInput('')
    }

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon())
    }

    const handlePlaceOrder = async () => {

        if (!selectedAddress) {
            toast.error('Please select or add an address')
            return
        }

        if (items.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        if (!deliverySlot) {
            toast.error('Please select a delivery slot')
            return
        }

        if (paymentMethod === 'UPI' && !upiId.trim()) {
            toast.error('Please enter a valid UPI ID')
            return
        }

        if (paymentMethod === 'STRIPE' || paymentMethod === 'WALLET') {
            toast('Online payment is demo-only. Redirecting to orders preview.', { icon: 'ℹ️' })
        }

        const generatedOrderId = `ord_${Date.now()}`

        const newOrder = {
            id: generatedOrderId,
            total: Number(finalTotal.toFixed(2)),
            status: 'ORDER_PLACED',
            isPaid: ['STRIPE', 'UPI', 'WALLET', 'NET_BANKING'].includes(paymentMethod),
            paymentMethod,
            isCouponUsed: Boolean(appliedCoupon),
            coupon: appliedCoupon || null,
            orderItems: items.map((item) => ({
                orderId: generatedOrderId,
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                product: item,
            })),
            address: selectedAddress,
            deliverySlot,
            paymentDetails: paymentMethod === 'STRIPE'
                ? savedPaymentMethods.find((method) => method.id === selectedPaymentId)
                : paymentMethod === 'UPI'
                    ? { label: `UPI (${upiId})` }
                    : paymentMethod === 'WALLET'
                        ? { label: `${walletProvider} Wallet` }
                        : paymentMethod === 'NET_BANKING'
                            ? { label: `Net Banking (${selectedBank})` }
                        : { label: 'Cash on Delivery' },
            user: { name: selectedAddress.name, email: selectedAddress.email },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        addOrderToStorage(newOrder)
        pushNotification({ title: 'Order Confirmed', message: `Your order ${newOrder.id} was placed successfully.` })
        pushNotification({ title: 'Shipping Update', message: `Your order ${newOrder.id} will be prepared for dispatch shortly.` })
        pushNotification({ title: 'Delivery Update', message: `Estimated delivery slot: ${deliverySlot}.` })
        dispatch(clearCart())
        dispatch(removeCoupon())

        toast.success('Order placed successfully')

        window.dispatchEvent(new Event('app:navigation-start'))
        router.push(`/orders/${newOrder.id}`)
    }

    const handlePlaceOrderClick = (event) => {
        event.preventDefault()
        if (showConfirmStep) {
            handlePlaceOrder()
            return
        }
        setShowConfirmStep(true)
    }

    useEffect(() => {
        if (!selectedAddress && addressList.length > 0) {
            setSelectedAddress(addressList[0])
        }
    }, [addressList, selectedAddress])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            <p className='text-slate-400 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>COD</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="UPI" name='payment' onChange={() => setPaymentMethod('UPI')} checked={paymentMethod === 'UPI'} className='accent-gray-500' />
                <label htmlFor="UPI" className='cursor-pointer'>UPI</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="WALLET" name='payment' onChange={() => setPaymentMethod('WALLET')} checked={paymentMethod === 'WALLET'} className='accent-gray-500' />
                <label htmlFor="WALLET" className='cursor-pointer'>Wallet</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="NET_BANKING" name='payment' onChange={() => setPaymentMethod('NET_BANKING')} checked={paymentMethod === 'NET_BANKING'} className='accent-gray-500' />
                <label htmlFor="NET_BANKING" className='cursor-pointer'>Net Banking</label>
            </div>
            {paymentMethod === 'STRIPE' && (
                <div className='mt-3 space-y-2'>
                    {savedPaymentMethods.map((method) => (
                        <label key={method.id} className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer ${selectedPaymentId === method.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                            <div>
                                <p className='text-slate-700 text-sm font-medium'>{method.label}</p>
                                <p className='text-xs text-slate-500'>{method.meta}</p>
                            </div>
                            <input type='radio' name='saved-payment' className='accent-indigo-500' checked={selectedPaymentId === method.id} onChange={() => setSelectedPaymentId(method.id)} />
                        </label>
                    ))}
                </div>
            )}
            {paymentMethod === 'UPI' && (
                <div className='mt-3'>
                    <input value={upiId} onChange={(event) => setUpiId(event.target.value)} type='text' placeholder='Enter UPI ID (e.g. user@upi)' className='border border-slate-300 p-2.5 w-full outline-none rounded bg-white text-slate-700' />
                </div>
            )}
            {paymentMethod === 'WALLET' && (
                <div className='mt-3'>
                    <select value={walletProvider} onChange={(event) => setWalletProvider(event.target.value)} className='border border-slate-300 p-2.5 w-full outline-none rounded bg-white text-slate-700'>
                        <option value='Paytm'>Paytm</option>
                        <option value='PhonePe'>PhonePe</option>
                        <option value='Amazon Pay'>Amazon Pay</option>
                    </select>
                </div>
            )}
            {paymentMethod === 'NET_BANKING' && (
                <div className='mt-3'>
                    <select value={selectedBank} onChange={(event) => setSelectedBank(event.target.value)} className='border border-slate-300 p-2.5 w-full outline-none rounded bg-white text-slate-700'>
                        <option value='HDFC Bank'>HDFC Bank</option>
                        <option value='ICICI Bank'>ICICI Bank</option>
                        <option value='SBI'>SBI</option>
                        <option value='Axis Bank'>Axis Bank</option>
                    </select>
                </div>
            )}
            <p className='mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1'>Secure payment confirmation enabled via encrypted checkout flow.</p>

            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Delivery Slot</p>
                <select value={deliverySlot} onChange={(event) => setDeliverySlot(event.target.value)} className='border border-slate-300 p-2.5 w-full mt-2 outline-none rounded bg-white text-slate-700'>
                    {deliverySlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                    ))}
                </select>
                <p className='mt-3'>Shipping Method</p>
                <select value={shippingMethod} onChange={(event) => setShippingMethod(event.target.value)} className='border border-slate-300 p-2.5 w-full mt-2 outline-none rounded bg-white text-slate-700'>
                    <option value='Standard'>Standard (Free)</option>
                    <option value='Express'>Express ({currency}49)</option>
                </select>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Address</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => {
                                        if (e.target.value === '') {
                                            setSelectedAddress(null)
                                            return
                                        }
                                        setSelectedAddress(addressList[e.target.value])
                                    }} value={selectedAddress ? addressList.findIndex((address) => address.id === selectedAddress.id) : ''} >
                                        <option value="">Select Address</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {appliedCoupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>{shippingFee > 0 ? `${currency}${shippingFee}` : 'Free'}</p>
                        {appliedCoupon && <p>{`-${currency}${safeDiscountAmount.toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !appliedCoupon ? (
                        <form onSubmit={e => handleCouponCode(e)} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                            <button type="submit" className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-between gap-2 text-xs mt-3 bg-green-50 p-3 rounded border border-green-200'>
                            <div className='flex items-center gap-2'>
                                <p>Code: <span className='font-semibold'>{appliedCoupon.code}</span></p>
                                <p className='text-green-600 font-semibold'>({appliedCoupon.discount}% off)</p>
                            </div>
                            <XIcon size={18} onClick={handleRemoveCoupon} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            {!selectedAddress && <p className='text-xs text-amber-600 py-1'>Please add/select an address to continue.</p>}
            {showConfirmStep && (
                <div className='mb-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-xs text-indigo-700'>
                    Confirm order with <span className='font-semibold'>{paymentMethod}</span> and slot <span className='font-semibold'>{deliverySlot}</span>.
                </div>
            )}
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right'>{currency}{appliedCoupon ? finalTotal.toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            <button disabled={!canPlaceOrder} onClick={handlePlaceOrderClick} className={`w-full py-2.5 rounded active:scale-95 transition-all ${canPlaceOrder ? 'bg-slate-700 text-white hover:bg-slate-900' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>{showConfirmStep ? 'Confirm Order' : 'Place Order'}</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} onAddressAdded={(address) => setSelectedAddress(address)} />}

        </div>
    )
}

export default OrderSummary