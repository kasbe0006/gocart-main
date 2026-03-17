'use client'

export default function SurfaceCard({ children, className = '' }) {
    return <div className={`bg-white rounded-xl shadow-md border border-slate-100 ${className}`}>{children}</div>
}
