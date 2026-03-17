'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

const faqs = [
    { q: 'How can I track my order?', a: 'Go to Orders and open invoice details for live status updates.' },
    { q: 'How do I request return/refund?', a: 'Open your delivered order and click Request Return in support section.' },
    { q: 'Can I cancel after placing order?', a: 'Yes, for ORDER_PLACED/PROCESSING statuses you can request cancellation.' },
]

export default function SupportPage() {
    const [chatInput, setChatInput] = useState('')
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hi 👋 Welcome to Velmora Support. How can I help?' },
    ])
    const [complaint, setComplaint] = useState('')
    const [contactEmail, setContactEmail] = useState('')

    const sendMessage = () => {
        if (!chatInput.trim()) return
        const userMessage = { from: 'user', text: chatInput.trim() }
        setMessages((prev) => [...prev, userMessage, { from: 'bot', text: 'Thanks! Our team will follow up shortly.' }])
        setChatInput('')
    }

    const submitComplaint = (event) => {
        event.preventDefault()
        if (complaint.trim().length < 10) {
            toast.error('Please add complaint details (min 10 chars)')
            return
        }
        toast.success('Complaint submitted successfully')
        setComplaint('')
    }

    const submitContact = (event) => {
        event.preventDefault()
        if (!contactEmail.trim()) {
            toast.error('Please enter your email')
            return
        }
        toast.success('Support request submitted')
        setContactEmail('')
    }

    return (
        <div className='mx-6 my-14 min-h-[70vh]'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-3xl font-semibold text-slate-800'>Help Center & Support</h1>
                <p className='text-slate-500 mt-2'>Live chat, FAQ, contact support, and complaint management.</p>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8'>
                    <div className='lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5'>
                        <h2 className='text-lg font-semibold text-slate-800'>Live Chat Support</h2>
                        <div className='mt-4 border border-slate-200 rounded-lg p-3 h-72 overflow-y-auto bg-slate-50'>
                            {messages.map((message, index) => (
                                <div key={index} className={`mb-2 flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${message.from === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'} rounded-lg px-3 py-2 text-sm max-w-[75%]`}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-3 flex gap-2'>
                            <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder='Type your message' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                            <button onClick={sendMessage} className='px-4 rounded-lg bg-slate-800 text-white text-sm font-medium'>Send</button>
                        </div>
                    </div>

                    <div className='rounded-xl border border-slate-200 bg-white p-5'>
                        <h2 className='text-lg font-semibold text-slate-800'>Contact Support</h2>
                        <form onSubmit={submitContact} className='mt-4 space-y-3'>
                            <input type='email' value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder='Your email address' className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none' />
                            <button type='submit' className='w-full px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium'>Request Callback</button>
                        </form>

                        <h3 className='text-sm font-semibold text-slate-700 mt-6'>FAQ</h3>
                        <div className='mt-2 space-y-2'>
                            {faqs.map((item) => (
                                <div key={item.q} className='rounded-lg border border-slate-200 p-3'>
                                    <p className='text-sm font-medium text-slate-800'>{item.q}</p>
                                    <p className='text-xs text-slate-600 mt-1'>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='rounded-xl border border-slate-200 bg-white p-5 mt-5'>
                    <h2 className='text-lg font-semibold text-slate-800'>Complaint System</h2>
                    <form onSubmit={submitComplaint} className='mt-3'>
                        <textarea
                            value={complaint}
                            onChange={(event) => setComplaint(event.target.value)}
                            rows={4}
                            placeholder='Describe your complaint in detail'
                            className='w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none'
                        />
                        <button type='submit' className='mt-3 px-4 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium'>Submit Complaint</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
