export const loadNotifications = () => {
    if (typeof window === 'undefined') return []
    try {
        const stored = localStorage.getItem('velmora_notifications')
        const parsed = stored ? JSON.parse(stored) : []
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export const saveNotifications = (notifications) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('velmora_notifications', JSON.stringify(notifications))
}

export const pushNotification = (notification) => {
    const existing = loadNotifications()
    const next = [{
        id: `note_${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
        ...notification,
    }, ...existing].slice(0, 50)
    saveNotifications(next)
    return next
}

export const markAllNotificationsRead = () => {
    const existing = loadNotifications()
    const next = existing.map((item) => ({ ...item, read: true }))
    saveNotifications(next)
    return next
}
