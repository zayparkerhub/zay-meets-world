import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import type { SubmissionPayload } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      console.error('Missing Supabase env vars', { url: !!url, key: !!key })
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const db = serverClient()

    const { error } = await db.from('submissions').insert({
      tab,
      pathway,
      name:         contact?.name   || null,
      email:        contact?.email  || null,
      social:       contact?.social || null,
      phone:        contact?.phone  || null,
      state:        contact?.state  || null,
      city:         contact?.city   || null,
      data:         data ?? {},
      is_creator:   !!is_creator,
      creator_data: is_creator ? creator_data : null,
      is_brand:     !!is_brand,
      brand_data:   is_brand ? brand_data : null,
    })

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message ?? 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Unhandled route error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
