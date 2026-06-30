import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'

// Track failed attempts in DB to survive serverless cold starts
async function getFailedAttempts(ip: string): Promise<number> {
  try {
    const db = serverClient()
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { count } = await db
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('data->>_login_fail_ip', ip)
      .gte('created_at', since)
    return count ?? 0
  } catch {
    return 0
  }
}

async function recordFailedAttempt(ip: string) {
  try {
    const db = serverClient()
    await db.from('submissions').insert({
      tab: 'explore',
      pathway: '_login_fail',
      data: { _login_fail_ip: ip },
    })
  } catch { /* ignore */ }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  // Block after 5 failed attempts in 15 minutes
  const failures = await getFailedAttempts(ip)
  if (failures >= 5) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 })
  }

  let key: string
  try {
    const body = await req.json()
    key = body.key ?? ''
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const adminKey = process.env.ADMIN_KEY ?? 'zmw-admin'

  if (!key || key !== adminKey) {
    await recordFailedAttempt(ip)
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('zmw_session', adminKey, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
