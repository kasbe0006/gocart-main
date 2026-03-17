'use client'

import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const nextErrors = {}

        if (!name.trim()) nextErrors.name = 'Full name is required'

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) nextErrors.email = 'Email address is required'
        else if (!emailRegex.test(email)) nextErrors.email = 'Please enter a valid email address'

        if (!password) nextErrors.password = 'Password is required'
        else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters long'

        if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password'
        else if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match'

        if (!agreeTerms) nextErrors.agreeTerms = 'Please accept the terms to continue'

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!validateForm()) {
            toast.error('Please fix the highlighted fields')
            return
        }

        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1800))
            setShowSuccess(true)
            toast.success('Account created successfully')

            setTimeout(() => {
                window.dispatchEvent(new Event('app:navigation-start'))
                router.push('/login')
            }, 2200)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-500 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {!showSuccess ? (
                    <div className="bg-white rounded-2xl shadow-2xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400"></div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your Velmora account</h1>
                            <p className="text-gray-600">Start your shopping journey in seconds</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Full name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) => {
                                        setName(event.target.value)
                                        setErrors((previous) => ({ ...previous, name: '' }))
                                    }}
                                    autoComplete="name"
                                    className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                        errors.name ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                    }`}
                                    placeholder="Your full name"
                                />
                                {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value)
                                        setErrors((previous) => ({ ...previous, email: '' }))
                                    }}
                                    autoComplete="email"
                                    className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                        errors.email ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                    }`}
                                    placeholder="you@example.com"
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value)
                                            setErrors((previous) => ({ ...previous, password: '' }))
                                        }}
                                        autoComplete="new-password"
                                        className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                            errors.password ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-slate-900 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value)
                                            setErrors((previous) => ({ ...previous, confirmPassword: '' }))
                                        }}
                                        autoComplete="new-password"
                                        className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                            errors.confirmPassword ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-slate-900 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="text-red-500 text-sm mt-1 block">{errors.confirmPassword}</span>}
                            </div>

                            <div>
                                <label className="flex items-center cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(event) => {
                                            setAgreeTerms(event.target.checked)
                                            setErrors((previous) => ({ ...previous, agreeTerms: '' }))
                                        }}
                                        className="w-4 h-4 rounded border-2 border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-slate-900">I agree to the Terms and Privacy Policy</span>
                                </label>
                                {errors.agreeTerms && <span className="text-red-500 text-sm mt-1 block">{errors.agreeTerms}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 rounded-full font-bold text-white transition-all ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="text-center text-sm">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-green-600 hover:text-green-700 font-bold transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="12" fill="#22c55e" />
                                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Account created successfully!</h3>
                        <p className="text-gray-600">Redirecting to sign in...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
