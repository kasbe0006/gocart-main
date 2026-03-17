'use client'

export default function MetricCard({
    title,
    value,
    icon: Icon,
    valueClassName = 'text-slate-800',
    iconClassName = 'text-slate-500',
    className = '',
}) {
    return (
        <div className={`rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between ${className}`}>
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className={`text-2xl font-semibold ${valueClassName}`}>{value}</p>
            </div>
            {Icon ? <Icon className={iconClassName} /> : null}
        </div>
    )
}
