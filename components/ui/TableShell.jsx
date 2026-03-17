'use client'

export default function TableShell({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white ${className}`}>
            {children}
        </div>
    )
}
