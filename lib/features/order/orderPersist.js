export const loadOrdersFromStorage = () => {
    if (typeof window === 'undefined') return []
    try {
        const stored = localStorage.getItem('velmora_orders')
        const parsed = stored ? JSON.parse(stored) : []
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to load orders from storage:', error)
        return []
    }
}

export const saveOrdersToStorage = (orders) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem('velmora_orders', JSON.stringify(orders))
    } catch (error) {
        console.error('Failed to save orders to storage:', error)
    }
}

export const addOrderToStorage = (order) => {
    const existingOrders = loadOrdersFromStorage()
    const nextOrders = [order, ...existingOrders]
    saveOrdersToStorage(nextOrders)
    return nextOrders
}

export const upsertOrderInStorage = (order) => {
    const existingOrders = loadOrdersFromStorage()
    const orderIndex = existingOrders.findIndex((item) => item.id === order.id)

    let nextOrders = existingOrders
    if (orderIndex === -1) {
        nextOrders = [order, ...existingOrders]
    } else {
        nextOrders = [...existingOrders]
        nextOrders[orderIndex] = order
    }

    saveOrdersToStorage(nextOrders)
    return nextOrders
}

export const getAllOrders = (dummyOrders = []) => {
    const localOrders = loadOrdersFromStorage()
    const localOrderIds = new Set(localOrders.map((order) => order.id))
    const remainingDummyOrders = dummyOrders.filter((order) => !localOrderIds.has(order.id))
    return [...localOrders, ...remainingDummyOrders]
}
