'use client'
import { Bell, Heart, Search, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist?.ids?.length || 0)
    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: 'About', href: '/pricing' },
        { label: 'Support', href: '/support' },
    ]

    const handleSearch = (event) => {
        event.preventDefault()
        window.dispatchEvent(new Event('app:navigation-start'))
        router.push(`/shop?search=${search}`)
    }

    const handleLinkClick = (href) => {
        // Smooth transition with instant visual feedback
        document.documentElement.style.opacity = '0.98'
        setTimeout(() => {
            document.documentElement.style.opacity = '1'
        }, 80)
        window.dispatchEvent(new Event('app:navigation-start'))
        router.push(href)
    }

    return (
        <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 shadow-[0_1px_0_0_rgba(15,23,42,0.03)]">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-3 gap-3 transition-all">

                    <button onClick={() => handleLinkClick('/')} className="relative text-2xl lg:text-3xl font-semibold text-slate-700 dark:text-slate-100 bg-none border-none cursor-pointer shrink-0 tracking-tight">
                        <span className="text-green-600">vel</span>mora<span className="text-green-600 text-4xl leading-0">.</span>
                        <p className="absolute text-[10px] font-semibold -top-1 -right-7 px-2 py-0.5 rounded-full text-white bg-green-500">
                            plus
                        </p>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-5 text-slate-600 dark:text-slate-300 min-w-0">
                        {navLinks.map((link) => (
                            <button key={link.href} onClick={() => handleLinkClick(link.href)} className="text-sm font-medium hover:text-slate-900 dark:hover:text-white transition">
                                {link.label}
                            </button>
                        ))}

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-56 2xl:w-72 text-sm gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-full border border-transparent dark:border-slate-700 focus-within:border-slate-300">
                            <Search size={16} className="text-slate-500 dark:text-slate-400" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-500 dark:placeholder-slate-400" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <button onClick={() => handleLinkClick('/cart')} className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Cart">
                            <ShoppingCart size={17} />
                            <span className="absolute -top-1 -right-1 text-[9px] text-white bg-slate-700 min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{cartCount}</span>
                        </button>

                        <button onClick={() => handleLinkClick('/wishlist')} className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Wishlist">
                            <Heart size={17} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[9px] text-white bg-rose-500 min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{wishlistCount}</span>
                            )}
                        </button>

                        <button onClick={() => handleLinkClick('/notifications')} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Notifications">
                            <Bell size={17} />
                        </button>

                        <button onClick={() => handleLinkClick('/account')} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium">
                            <User size={16} />
                            Account
                        </button>
                        <button onClick={() => handleLinkClick('/login')} className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full border-none cursor-pointer text-sm font-medium">
                            Login
                        </button>

                        <ThemeToggle />

                    </div>

                    {/* Mobile User Button  */}
                    <div className="lg:hidden flex items-center gap-1.5">
                        <button onClick={() => handleLinkClick('/shop')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-700 dark:text-slate-200">Shop</button>
                        <button onClick={() => handleLinkClick('/support')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-700 dark:text-slate-200">Support</button>
                        <button onClick={() => handleLinkClick('/wishlist')} className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200">
                            <Heart size={18} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] text-white bg-rose-500 size-3.5 rounded-full flex items-center justify-center">{wishlistCount}</span>
                            )}
                        </button>
                        <button onClick={() => handleLinkClick('/login')} className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full border-none cursor-pointer">
                            Login
                        </button>
                        <button onClick={() => handleLinkClick('/account')} className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200">
                            <User size={18} />
                        </button>
                        <button onClick={() => handleLinkClick('/notifications')} className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200">
                            <Bell size={18} />
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar