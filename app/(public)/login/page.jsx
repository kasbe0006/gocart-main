'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!email.trim()) {
            setErrors(prev => ({ ...prev, email: 'Email address is required' }))
            return false
        }
        
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
            return false
        }
        
        setErrors(prev => ({ ...prev, email: '' }))
        return true
    }

    const validatePassword = () => {
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'Password is required' }))
            return false
        }
        
        if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters long' }))
            return false
        }
        
        setErrors(prev => ({ ...prev, password: '' }))
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const emailValid = validateEmail()
        const passwordValid = validatePassword()
        if (!emailValid || !passwordValid) {
            toast.error('Please fix the highlighted fields')
            return
        }

        setLoading(true)

        try {
            // Simulate authentication
            await new Promise(resolve => setTimeout(resolve, 1800))
            setShowSuccess(true)
            toast.success('Signed in successfully')
            
            // Redirect after 2.5 seconds
            setTimeout(() => {
                window.dispatchEvent(new Event('app:navigation-start'))
                router.push('/')
            }, 2500)
        } catch {
            setErrors(prev => ({ ...prev, password: 'Sign in failed. Please try again.' }))
            toast.error('Sign in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (provider) => {
        console.log(`Signing in with ${provider}...`)
        // Implement social login integration here
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-500 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {!showSuccess ? (
                    <div className="bg-white rounded-2xl shadow-2xl p-12 relative overflow-hidden">
                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400"></div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-5">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="16" r="16" fill="#22c55e"/>
                                    <text x="16" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">V</text>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign in to Velmora</h1>
                            <p className="text-gray-600">Continue to your store</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 mb-7">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors(prev => ({ ...prev, email: '' }))
                                    }}
                                    onBlur={validateEmail}
                                    autoComplete='email'
                                    className={`w-full bg-gray-100 border-2 border-transparent rounded-lg px-4 py-3.5 text-slate-900 text-base outline-none transition-all ${
                                        errors.email ? 'border-red-500' : 'focus:bg-white focus:border-green-500 focus:ring-3 focus:ring-green-100'
                                    }`}
                                    placeholder="you@example.com"
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setErrors(prev => ({ ...prev, password: '' }))
                                        }}
                                        onBlur={validatePassword}
                                        autoComplete='current-password'
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

                            {/* Form Options */}
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-2 border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-slate-900 font-medium">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 rounded-full font-bold text-white transition-all ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.16s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.32s' }}></div>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Google')}
                                className="w-full py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white text-slate-900 font-semibold transition-all flex items-center justify-center gap-3 hover:bg-gray-50"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 01-2.7.75 4.8 4.8 0 01-4.52-3.36H1.83v2.07A8 8 0 008.98 17z"/>
                                    <path fill="#FBBC05" d="M4.46 10.41a4.8 4.8 0 010-2.82V5.52H1.83a8 8 0 000 7.16l2.63-2.07z"/>
                                    <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.59A8 8 0 001.83 5.52l2.63 2.07c.7-2.07 2.67-3.36 4.52-3.36z"/>
                                </svg>
                                Continue with Google
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Apple')}
                                className="w-full py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white text-slate-900 font-semibold transition-all flex items-center justify-center gap-3 hover:bg-gray-50"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                                    <path d="M15.3 7.2c0-1.8 1.5-2.7 1.6-2.8-1-1.4-2.5-1.6-3-1.6-1.2-.1-2.4.7-3 .7s-1.6-.7-2.7-.7c-1.4 0-2.7.8-3.4 2-.7 1.2-1.3 3.5.2 6.3.7 1.4 1.7 2.9 3 2.9 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 2.2-1.4 3-2.8.9-1.6.9-3.2.9-3.3-.1 0-2.8-1.1-2.8-4.2zm-2.8-8.3c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-1 2.8 1.1.1 2.2-.5 2.8-1.4z"/>
                                </svg>
                                Continue with Apple
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center text-sm">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-green-600 hover:text-green-700 font-bold transition-colors">
                                    Sign up free
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Success Message */
                    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Velmora!</h3>
                        <p className="text-gray-600">Redirecting to your store...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
