'use client'

import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('your account')
    const [token, setToken] = useState('')

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const params = new URLSearchParams(window.location.search)
        const queryEmail = params.get('email')
        const queryToken = params.get('token')
        if (queryEmail) {
            setEmail(queryEmail)
        }
        if (queryToken) {
            setToken(queryToken)
        }
    }, [])

    const validate = () => {
        const nextErrors = {}

        if (!newPassword) nextErrors.newPassword = 'New password is required'
        else if (newPassword.length < 6) nextErrors.newPassword = 'Password must be at least 6 characters'

        if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password'
        else if (confirmPassword !== newPassword) nextErrors.confirmPassword = 'Passwords do not match'

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!token) {
            toast.error('Reset token is missing. Please use the reset link from your email.')
            return
        }

        if (!validate()) {
            toast.error('Please fix the highlighted fields')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/v1/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: newPassword }),
            })
            const payload = await response.json()
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || 'Unable to reset password')
            }

            toast.success('Password updated successfully')
            window.dispatchEvent(new Event('app:navigation-start'))
            router.push('/login')
        } catch (apiError) {
            toast.error(apiError.message || 'Unable to reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-500 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400"></div>

                <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
                <p className="text-sm text-slate-600 mt-2">Set a new password for <span className="font-medium">{email}</span>.</p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">New password</label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(event) => {
                                    setNewPassword(event.target.value)
                                    setErrors((previous) => ({ ...previous, newPassword: '' }))
                                }}
                                className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                    errors.newPassword ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                }`}
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowNew((previous) => !previous)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value)
                                    setErrors((previous) => ({ ...previous, confirmPassword: '' }))
                                }}
                                className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                    errors.confirmPassword ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                }`}
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowConfirm((previous) => !previous)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-full font-bold text-white transition-all ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {loading ? 'Updating password...' : 'Update password'}
                    </button>
                </form>

                <p className="text-sm text-slate-600 mt-7">
                    <Link href="/login" className="text-green-600 font-semibold hover:text-green-700">Back to sign in</Link>
                </p>
            </div>
        </div>
    )
}
