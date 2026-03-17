'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('velmora_theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        const initial = getInitialTheme()
        setTheme(initial)
        document.documentElement.classList.toggle('dark', initial === 'dark')
    }, [])

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(nextTheme)
        document.documentElement.classList.toggle('dark', nextTheme === 'dark')
        localStorage.setItem('velmora_theme', nextTheme)
    }

    return (
        <button
            aria-label='Toggle theme'
            onClick={toggleTheme}
            className='inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition'
        >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className='text-xs font-medium hidden lg:inline'>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
    )
}
