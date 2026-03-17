'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { usePathname } from "next/navigation"
import { getAdminSession, hasAdminAccess } from "@/lib/features/admin/adminSession"

const AdminLayout = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

    const fetchIsAdmin = async () => {
        const activeSession = getAdminSession()
        setSession(activeSession)
        setIsAdmin(hasAdminAccess(pathname, activeSession?.role))
        setLoading(false)
    }

    useEffect(() => {
        fetchIsAdmin()
    }, [pathname])

    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar session={session} />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar role={session?.role} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <div className="flex items-center gap-3 mt-8">
                <Link href="/admin/login" className="bg-indigo-600 text-white flex items-center gap-2 p-2 px-6 max-sm:text-sm rounded-full">
                    Admin login <ArrowRightIcon size={18} />
                </Link>
                <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 p-2 px-6 max-sm:text-sm rounded-full">
                    Go to home <ArrowRightIcon size={18} />
                </Link>
            </div>
        </div>
    )
}

export default AdminLayout