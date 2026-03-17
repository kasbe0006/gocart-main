'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [debugResetUrl, setDebugResetUrl] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) {
            setError('Email address is required')
            return
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to send reset link')
            }

            setDebugResetUrl(payload?.data?.debug?.resetUrl || '')
            setIsSubmitted(true)
            toast.success('Password reset link sent')
        } catch (apiError) {
            setError(apiError.message || 'Unable to send reset link')
            toast.error(apiError.message || 'Unable to send reset link')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-500 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400"></div>

                <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
                <p className="text-slate-600 mt-2 text-sm">Enter your email and we’ll send a reset link.</p>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                    setError('')
                                }}
                                autoComplete="email"
                                className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                    error ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                }`}
                                placeholder="you@example.com"
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-full font-bold text-white transition-all ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            }`}
                        >
                            {loading ? 'Sending link...' : 'Send reset link'}
                        </button>
                    </form>
                ) : (
                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <p>A reset link has been sent to <span className="font-semibold">{email}</span>.</p>
                        <p className="mt-1">Use your email link to continue.</p>
                        <button
                            onClick={() => {
                                window.dispatchEvent(new Event('app:navigation-start'))
                                if (debugResetUrl) {
                                    const url = new URL(debugResetUrl)
                                    router.push(`${url.pathname}${url.search}`)
                                    return
                                }
                                router.push(`/reset-password?email=${encodeURIComponent(email)}`)
                            }}
                            className="mt-3 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
                        >
                            {debugResetUrl ? 'Open debug reset link' : 'Open reset page'}
                        </button>
                    </div>
                )}

                <p className="text-sm text-slate-600 mt-7">
                    Remember your password?{' '}
                    <Link href="/login" className="text-green-600 font-semibold hover:text-green-700">
                        Back to sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
