import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/server/session'

export async function POST() {
    try {
        await clearAuthCookie()
        return NextResponse.json({ success: true, data: { loggedOut: true } })
    } catch (error) {
        console.error('POST /api/v1/auth/logout failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to logout' } },
            { status: 500 }
        )
    }
}
