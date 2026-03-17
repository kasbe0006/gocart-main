// Persistence for coupons
export const loadCouponsFromStorage = () => {
    if (typeof window === 'undefined') return null
    try {
        const stored = localStorage.getItem('velmora_coupons')
        return stored ? JSON.parse(stored) : null
    } catch (error) {
        console.error('Failed to load coupons from storage:', error)
        return null
    }
}

export const saveCouponsToStorage = (coupons) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem('velmora_coupons', JSON.stringify(coupons))
        console.log('Coupons saved to localStorage:', coupons.length)
    } catch (error) {
        console.error('Failed to save coupons to storage:', error)
    }
}
