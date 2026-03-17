export const ADMIN_SESSION_KEY = 'velmora_admin_session'

export const getAdminSession = () => {
    if (typeof window === 'undefined') return null
    try {
        const stored = localStorage.getItem(ADMIN_SESSION_KEY)
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}

export const setAdminSession = (session) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
}

export const clearAdminSession = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ADMIN_SESSION_KEY)
}

export const hasAdminAccess = (pathname, role) => {
    if (pathname === '/admin/login') return true
    if (!role) return false

    if (role === 'admin') return true
    if (role === 'manager') {
        return !['/admin/users', '/admin/team'].includes(pathname)
    }
    if (role === 'staff') {
        return ['/admin', '/admin/orders', '/admin/support'].includes(pathname)
    }
    return false
}
