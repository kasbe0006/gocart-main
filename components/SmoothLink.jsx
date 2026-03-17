'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SmoothLink({ href, children, className, ...props }) {
    const router = useRouter()

    const handleClick = (e) => {
        e.preventDefault()
        // Instant visual feedback
        document.documentElement.style.opacity = '0.95'
        setTimeout(() => {
            document.documentElement.style.opacity = '1'
        }, 100)
        window.dispatchEvent(new Event('app:navigation-start'))
        router.push(href)
    }

    return (
        <Link href={href} className={className} onClick={handleClick} {...props}>
            {children}
        </Link>
    )
}
