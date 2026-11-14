'use client'

import { useState, useCallback } from 'react'

export const STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

export function Chip({ label, emoji, sub, selected, onToggle }: {
  label: string; emoji?: string; sub?: string; selected: boolean; onToggle: () => void
}) {
  return (
    <div
      className={`cc${selected ? ' on' : ''}`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
    >
      {emoji && <span className="ce">{emoji}</span>}
      <span className="ct">{label}</span>
      {sub && <span className="cd">{sub}</span>}
    </div>
  )
}

export function useChips(initial: string[] = []) {
  const [chips, setChips] = useState<string[]>(initial)
  const toggle = useCallback((v: string) =>
    setChips(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  , [])
  return [chips, toggle] as const
}

export function fd(form: HTMLFormElement | null, key: string) {
  if (!form) return ''
  return ((new FormData(form).get(key) as string) ?? '').trim()
}

export function contactFrom(form: HTMLFormElement | null, prefix = '') {
  return {
    name:   fd(form, `${prefix}name`),
    email:  fd(form, `${prefix}email`),
    social: fd(form, `${prefix}social`),
    phone:  fd(form, `${prefix}phone`),
    state:  fd(form, `${prefix}state`),
    city:   fd(form, `${prefix}city`),
  }
}

/** POSTs to /api/submit. Returns an error message, or null on success. */
export async function postSubmission(payload: object, form: HTMLFormElement | null): Promise<string | null> {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, honeypot: fd(form, 'website') }),
    })
    if (res.status === 429) return 'Too many submissions — try again in a few minutes.'
    if (!res.ok) return 'Something went wrong — try again.'
    return null
  } catch {
    return 'Something went wrong — try again.'
  }
}

export function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
}
