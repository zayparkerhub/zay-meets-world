import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { key } = await req.json()
  const adminKey = process.env.ADMIN_KEY ?? 'zmw-admin'

  if (!key || key !== adminKey) {
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
