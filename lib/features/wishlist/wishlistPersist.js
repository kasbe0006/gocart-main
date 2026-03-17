export const loadWishlistFromStorage = () => {
    if (typeof window === 'undefined') return []
    try {
        const stored = localStorage.getItem('velmora_wishlist')
        const parsed = stored ? JSON.parse(stored) : []
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to load wishlist from storage:', error)
        return []
    }
}

export const saveWishlistToStorage = (wishlistIds) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem('velmora_wishlist', JSON.stringify(wishlistIds))
    } catch (error) {
        console.error('Failed to save wishlist to storage:', error)
    }
}
