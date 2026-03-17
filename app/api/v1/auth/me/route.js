import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'

export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json(
                { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
                { status: 401 }
            )
        }

        return NextResponse.json({ success: true, data: { user } })
    } catch (error) {
        console.error('GET /api/v1/auth/me failed', error)
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to fetch session user' } },
            { status: 500 }
        )
    }
}
