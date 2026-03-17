import { prisma } from './prisma'
import { getSessionFromCookies } from './session'

export const sanitizeUser = (user) => {
    if (!user) return null
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

export const getCurrentUser = async () => {
    const session = await getSessionFromCookies()
    if (!session?.userId) return null

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    })

    return sanitizeUser(user)
}

export const requireAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
        return {
            ok: false,
            response: new Response(
                JSON.stringify({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            ),
        }
    }

    return { ok: true, user }
}

export const requireRoles = async (allowedRoles = []) => {
    const authResult = await requireAuth()
    if (!authResult.ok) return authResult

    if (allowedRoles.length > 0 && !allowedRoles.includes(authResult.user.role)) {
        return {
            ok: false,
            response: new Response(
                JSON.stringify({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            ),
        }
    }

    return authResult
}
