'use client'

import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react'

export default function StatePanel({
    type = 'empty',
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}) {
    const isError = type === 'error'

    return (
        <div className={`rounded-xl border bg-white p-8 text-center ${isError ? 'border-red-200' : 'border-slate-200'} ${className}`}>
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                {isError ? <AlertTriangle size={20} className="text-red-500" /> : <Inbox size={20} className="text-slate-500" />}
            </div>
            <h3 className={`text-lg font-semibold ${isError ? 'text-red-700' : 'text-slate-800'}`}>{title}</h3>
            {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className={`mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white ${isError ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-900'}`}
                >
                    <RefreshCw size={14} />
                    {actionLabel}
                </button>
            )}
        </div>
    )
}
