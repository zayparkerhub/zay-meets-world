import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const cookie = req.cookies.get('zmw_session')?.value
  const adminKey = process.env.ADMIN_KEY ?? 'zmw-admin'
  if (cookie !== adminKey) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/'],
}
