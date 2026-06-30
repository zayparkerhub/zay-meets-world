import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import type { SubmissionPayload } from '@/lib/types'

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
  } catch {
    // non-blocking — don't fail the submission if Telegram is down
  }
}

function buildTelegramMessage(body: SubmissionPayload): string {
  const { tab, pathway, contact } = body
  const tabLabel = tab === 'explore' ? '🏃‍♂️ Explore' : '❤️ Love'
  const pathLabels: Record<string, string> = {
    explore: 'Send me somewhere', sponsor: 'Sponsor', community: 'Join spreading love',
    idea: 'Share an idea', commit: 'Make an act',
  }

  const lines = [
    `<b>New submission — ${tabLabel}</b>`,
    `<i>${pathLabels[pathway] ?? pathway}</i>`,
    '',
  ]

  if (contact?.name)   lines.push(`👤 ${contact.name}`)
  if (contact?.email)  lines.push(`✉️ ${contact.email}`)
  if (contact?.social) lines.push(`📱 ${contact.social}`)
  if (contact?.phone)  lines.push(`📞 ${contact.phone}`)
  if (contact?.city || contact?.state)
    lines.push(`📍 ${[contact.city, contact.state].filter(Boolean).join(', ')}`)
  if (body.is_creator) lines.push('🎬 Creator')
  if (body.is_brand)   lines.push('🏢 Brand')

  const data = body.data as Record<string, unknown>
  if (data?.story)       lines.push(`\n📝 ${data.story}`)
  if (data?.idea)        lines.push(`\n💡 ${data.idea}`)
  if (data?.description) lines.push(`\n🌍 ${data.description}`)
  if (data?.note)        lines.push(`\n💬 ${data.note}`)

  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    let body: SubmissionPayload & { honeypot?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Honeypot — bots fill this, humans don't see it
    if (body.honeypot) {
      return NextResponse.json({ ok: true }) // silently accept so bots don't know
    }

    const { tab, pathway, contact, data, is_creator, creator_data, is_brand, brand_data } = body

    if (!tab || !pathway) {
      return NextResponse.json({ error: 'Missing tab or pathway' }, { status: 400 })
    }

    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key  = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('Missing Supabase env vars')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    // IP rate limit — max 5 submissions per IP per 10 minutes
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (ip !== 'unknown') {
      const db = serverClient()
      const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
      const { count } = await db
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since)
        .eq('data->>_ip', ip)

      if ((count ?? 0) >= 5) {
        return NextResponse.json({ error: 'Too many submissions — try again later.' }, { status: 429 })
      }
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
      data:         { ...(data ?? {}), _ip: ip },
      is_creator:   !!is_creator,
      creator_data: is_creator ? creator_data : null,
      is_brand:     !!is_brand,
      brand_data:   is_brand ? brand_data : null,
    })

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message ?? 'Failed to save' }, { status: 500 })
    }

    // Send Telegram notification before responding
    await sendTelegram(buildTelegramMessage(body))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Unhandled route error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
