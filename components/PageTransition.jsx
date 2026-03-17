'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Loading from '@/components/Loading'

export default function PageTransition({ children }) {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const handleNavigationStart = () => {
            setIsLoading(true)
        }

        const handleDocumentClick = (event) => {
            const anchor = event.target.closest('a[href]')
            if (!anchor) return

            const href = anchor.getAttribute('href')
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

            const targetUrl = new URL(anchor.href, window.location.origin)
            const currentPath = `${window.location.pathname}${window.location.search}`
            const targetPath = `${targetUrl.pathname}${targetUrl.search}`
            if (targetPath === currentPath) return

            const isSameTab = !anchor.hasAttribute('target') || anchor.getAttribute('target') === '_self'
            if (isSameTab) {
                setIsLoading(true)
            }
        }

        window.addEventListener('app:navigation-start', handleNavigationStart)
        document.addEventListener('click', handleDocumentClick, true)

        return () => {
            window.removeEventListener('app:navigation-start', handleNavigationStart)
            document.removeEventListener('click', handleDocumentClick, true)
        }
    }, [])

    useEffect(() => {
        setIsLoading(false)
    }, [pathname])

    useEffect(() => {
        if (!isLoading) return

        const timeoutId = setTimeout(() => {
            setIsLoading(false)
        }, 6000)

        return () => clearTimeout(timeoutId)
    }, [isLoading])

    return (
        <>
            {isLoading && <Loading />}

            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                }}
                style={{
                    willChange: 'opacity, transform',
                }}
            >
                {children}
            </motion.div>
        </>
    )
}

