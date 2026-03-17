'use client'
import Link from "next/link"
import { clearAdminSession } from "@/lib/features/admin/adminSession"
import { useRouter } from "next/navigation"

const AdminNavbar = ({ session }) => {

    const router = useRouter()

    const logout = () => {
        clearAdminSession()
        router.push('/admin/login')
    }


    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p className="text-sm">Hi, {session?.role || 'Admin'}</p>
                <button onClick={logout} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm">Logout</button>
            </div>
        </div>
    )
}

export default AdminNavbar