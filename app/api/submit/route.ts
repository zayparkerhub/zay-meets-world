import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import type { SubmissionPayload } from '@/lib/types'

export async function POST(req: NextRequest) {
  let body: SubmissionPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { tab, pathway, contact, data, is_creator, creator_data, is_brand, brand_data } = body

  if (!tab || !pathway) {
    return NextResponse.json({ error: 'Missing tab or pathway' }, { status: 400 })
  }

  const db = serverClient()

  const { error } = await db.from('submissions').insert({
    tab,
    pathway,
    name:   contact?.name   || null,
    email:  contact?.email  || null,
    social: contact?.social || null,
    phone:  contact?.phone  || null,
    state:  contact?.state  || null,
    city:   contact?.city   || null,
    data:   data ?? {},
    is_creator:   !!is_creator,
    creator_data: is_creator ? creator_data : null,
    is_brand:     !!is_brand,
    brand_data:   is_brand ? brand_data : null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
