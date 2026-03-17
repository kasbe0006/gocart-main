export const loadRecentFromStorage = () => {
    if (typeof window === 'undefined') return []
    try {
        const stored = localStorage.getItem('velmora_recent')
        const parsed = stored ? JSON.parse(stored) : []
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to load recently viewed from storage:', error)
        return []
    }
}

export const saveRecentToStorage = (recentIds) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem('velmora_recent', JSON.stringify(recentIds))
    } catch (error) {
        console.error('Failed to save recently viewed to storage:', error)
    }
}
