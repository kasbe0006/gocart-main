import { NextResponse } from 'next/server'

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object|null} Error response or null if valid
 */
export function validateRequired(body, requiredFields) {
    const missing = requiredFields.filter((field) => !body[field])
    if (missing.length > 0) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: `Missing required fields: ${missing.join(', ')}`,
                },
            },
            { status: 400 }
        )
    }
    return null
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean}
 */
export function isValidLength(value, minLength = 1, maxLength = 255) {
    return value && value.length >= minLength && value.length <= maxLength
}

/**
 * Validate positive number
 * @param {number} value - Number to validate
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
    return typeof value === 'number' && value > 0
}

/**
 * Validate array of strings (IDs, tags, etc.)
 * @param {any} value - Value to validate
 * @param {number} maxItems - Maximum array length
 * @returns {boolean}
 */
export function isValidStringArray(value, maxItems = 100) {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.length <= maxItems &&
        value.every((item) => typeof item === 'string' && item.trim().length > 0)
    )
}

/**
 * Validate product data object
 * @param {Object} product - Product to validate
 * @returns {Object|null} Error response or null if valid
 */
export function validateProduct(product) {
    if (!isValidLength(product.name, 3, 255)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Product name must be 3-255 characters' },
            },
            { status: 400 }
        )
    }

    if (!isValidLength(product.description, 10, 2000)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Description must be 10-2000 characters' },
            },
            { status: 400 }
        )
    }

    if (!isPositiveNumber(product.price)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Price must be a positive number' },
            },
            { status: 400 }
        )
    }

    if (!isPositiveNumber(product.mrp)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'MRP must be a positive number' },
            },
            { status: 400 }
        )
    }

    if (product.price > product.mrp) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Price cannot exceed MRP' },
            },
            { status: 400 }
        )
    }

    if (!isValidStringArray(product.images, 10)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Must provide 1-10 valid image URLs' },
            },
            { status: 400 }
        )
    }

    if (!isValidLength(product.category, 2, 50)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Category must be 2-50 characters' },
            },
            { status: 400 }
        )
    }

    return null
}

/**
 * Validate status value
 * @param {string} status - Status to validate
 * @param {string[]} allowedStatuses - Array of allowed status values
 * @returns {boolean}
 */
export function isValidStatus(status, allowedStatuses) {
    return typeof status === 'string' && allowedStatuses.includes(status)
}

/**
 * Sanitize query parameter (basic XSS prevention)
 * @param {string} value - Query parameter value
 * @returns {string} Sanitized value
 */
export function sanitizeQuery(value) {
    return value ? String(value).trim().substring(0, 200) : ''
}

/**
 * Parse and validate pagination params
 * @param {Object} searchParams - URL search parameters
 * @returns {Object} Validated page and limit
 */
export function validatePagination(searchParams) {
    const page = Math.max(Number.parseInt(searchParams.get('page') || '1', 10), 1)
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get('limit') || '20', 10), 1), 100)
    return { page, limit }
}
