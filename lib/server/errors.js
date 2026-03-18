import { NextResponse } from 'next/server'

/**
 * Standard error response factory
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function errorResponse(code, message, status = 400) {
    return NextResponse.json(
        {
            success: false,
            error: { code, message },
        },
        { status }
    )
}

/**
 * Success response factory
 * @param {Object} data - Response data
 * @param {Object} meta - Optional metadata (pagination, etc.)
 * @returns {NextResponse}
 */
export function successResponse(data, meta = null) {
    const response = { success: true, data }
    if (meta) response.meta = meta
    return NextResponse.json(response)
}

/**
 * Handle not found errors
 * @param {string} resource - Resource type (e.g., 'Order', 'Product')
 * @returns {NextResponse}
 */
export function notFoundError(resource) {
    return errorResponse('NOT_FOUND', `${resource} not found`, 404)
}

/**
 * Handle unauthorized errors
 * @returns {NextResponse}
 */
export function unauthorizedError() {
    return errorResponse('UNAUTHORIZED', 'You are not authorized to perform this action', 401)
}

/**
 * Handle forbidden errors
 * @returns {NextResponse}
 */
export function forbiddenError() {
    return errorResponse('FORBIDDEN', 'Access denied', 403)
}

/**
 * Handle validation errors
 * @param {string} message - Validation error message
 * @returns {NextResponse}
 */
export function validationError(message) {
    return errorResponse('VALIDATION_ERROR', message, 400)
}

/**
 * Handle internal server errors with logging
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred (e.g., 'GET /api/v1/admin/orders')
 * @returns {NextResponse}
 */
export function internalError(error, context) {
    console.error(`[${context}] ${error.message}`, error.stack)
    return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500)
}

/**
 * Wrap async route handler with automatic error handling
 * @param {Function} handler - Async route handler
 * @returns {Function} Wrapped handler
 */
export function withErrorHandling(handler) {
    return async (request, context) => {
        try {
            return await handler(request, context)
        } catch (error) {
            const pathname = request.nextUrl.pathname
            const method = request.method
            return internalError(error, `${method} ${pathname}`)
        }
    }
}
