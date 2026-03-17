'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, ShoppingBasketIcon, TicketPercentIcon, ShieldAlert, Users, Boxes, FolderTree, CreditCard, Truck, ClipboardList, Megaphone, LayoutTemplate, UserCog } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = ({ role = 'admin' }) => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
        { name: 'Products', href: '/admin/products', icon: ShoppingBasketIcon },
        { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
        { name: 'Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
        { name: 'Shipping', href: '/admin/shipping', icon: Truck },
        { name: 'Marketing', href: '/admin/marketing', icon: Megaphone, roles: ['admin', 'manager'] },
        { name: 'Content', href: '/admin/content', icon: LayoutTemplate, roles: ['admin', 'manager'] },
        { name: 'Team', href: '/admin/team', icon: UserCog, roles: ['admin'] },
        { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon  },
        { name: 'Support Queue', href: '/admin/support', icon: ShieldAlert  },
    ].filter((link) => !link.roles || link.roles.includes(role))

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <Image className="w-14 h-14 rounded-full" src={assets.gs_logo} alt="" width={80} height={80} />
                <p className="text-slate-700">Hi, GreatStack</p>
            </div>

            <div className="max-sm:mt-6">
                {
                    sidebarLinks.map((link, index) => (
                        <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                            <link.icon size={18} className="sm:ml-5" />
                            <p className="max-sm:hidden">{link.name}</p>
                            {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSidebar