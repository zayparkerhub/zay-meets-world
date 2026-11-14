'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { STATES, Chip, useChips, fd, contactFrom, postSubmission, Honeypot } from '@/lib/form-helpers'

const SERVICES = [
  { value: 'surprise',  emoji: '🎁', label: 'Surprise someone', sub: 'Help pull off something they’ll never forget' },
  { value: 'friend',    emoji: '🫶', label: 'Be a friend',      sub: 'Hang out, talk, show up' },
  { value: 'cook',      emoji: '🍳', label: 'Cook for you',     sub: 'A home-cooked meal, made with love' },
  { value: 'adventure', emoji: '🗺️', label: 'Go on an adventure', sub: 'Explore your city together' },
  { value: 'help',      emoji: '🛠️', label: 'Lend a hand',      sub: 'A project, a move, a task' },
  { value: 'event',     emoji: '🎉', label: 'Show up for an event', sub: 'Birthday, celebration, big day' },
  { value: 'other',     emoji: '✨', label: 'Something else',   sub: 'Tell us your idea' },
]

export default function HirePage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [services, toggleService] = useChips()
  const [forWhom, setForWhom] = useState<'me' | 'someone'>('me')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = formRef.current
    const contact = contactFrom(form)
    const details = fd(form, 'details')

    if (services.length === 0) return setErr('Pick at least one thing you’d like Zay to do.')
    if (!details) return setErr('Tell us a little about what you have in mind.')
    if (!contact.email && !contact.social && !contact.phone) return setErr('Leave an email, social, or phone so we can reach you.')

    setLoading(true)
    setErr('')
    const error = await postSubmission({
      tab: 'love',
      pathway: 'hire',
      contact,
      data: {
        services,
        for_whom: forWhom === 'me' ? 'Me' : 'Someone else',
        recipient: forWhom === 'someone' ? fd(form, 'recipient') : '',
        when: fd(form, 'when'),
        budget: fd(form, 'budget'),
        details,
      },
      is_creator: false,
      is_brand: false,
    }, form)
    setLoading(false)
    if (error) setErr(error)
    else { setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  return (
    <div>
      <div className="float-layer">
        <span className="f f1">🦸</span><span className="f f2">🎁</span><span className="f f3">🍳</span>
        <span className="f f4">🫶</span><span className="f f5">🎉</span><span className="f f6">⭐</span>
        <span className="f f7">🗺️</span><span className="f f8">🦸</span><span className="f f9">❤️</span>
        <span className="f f10">🛠️</span><span className="f f11">✨</span><span className="f f12">🎁</span>
      </div>

      <div className="top">
        <Link href="/" className="back-link">← Zay Meets World</Link>
        <div className="eyebrow">Hire a Hero</div>
        <div className="brand-name">Need a hero? Zay will show up for you.</div>
        <div className="toggle-sub" style={{ maxWidth: 440, margin: '0 auto' }}>
          Surprise someone you love, share a meal, have a friend for the day — tell us what you need and
          we&apos;ll make it happen.
        </div>
      </div>

      <div className="panel explore-panel active">
        {done ? (
          <div className="form-wrap">
            <div className="step-card success show">
              <div className="si">🦸</div>
              <div className="st">Request received.</div>
              <div className="sb">We read every request personally. We&apos;ll reach out to plan the details and figure out when Zay can be there.</div>
              <Link href="/" className="pl">Back home</Link>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} noValidate>
            <Honeypot />
            <div className="form-wrap">

              <div className="step-card">
                <span className="step-pill pill-e">Step 1</span>
                <div className="step-title">What do you need a hero for?</div>
                <div className="step-sub">Pick everything that fits.</div>
                <div className="grid g2">
                  {SERVICES.map(s => (
                    <Chip key={s.value} emoji={s.emoji} label={s.label} sub={s.sub}
                      selected={services.includes(s.value)} onToggle={() => toggleService(s.value)} />
                  ))}
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Step 2</span>
                <div className="step-title">Who is this for?</div>
                <div className="reach-row" style={{ marginBottom: forWhom === 'someone' ? 14 : 0 }}>
                  <button type="button" className={`rp${forWhom === 'me' ? ' on' : ''}`} onClick={() => setForWhom('me')}>Me</button>
                  <button type="button" className={`rp${forWhom === 'someone' ? ' on' : ''}`} onClick={() => setForWhom('someone')}>Someone in my life</button>
                </div>
                {forWhom === 'someone' && (
                  <div className="field">
                    <label>Who are they to you?</label>
                    <input type="text" name="recipient" placeholder="e.g. My mom, my best friend Jordan" />
                  </div>
                )}
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Step 3</span>
                <div className="step-title">Tell us the plan</div>
                <div className="step-sub">What do you have in mind? The more detail, the better we can make it special.</div>
                <div className="field">
                  <textarea name="details" placeholder="e.g. My grandma lives alone and loves soul food. I'd love for Zay to cook her a Sunday dinner and keep her company..." />
                </div>
                <div className="field-row" style={{ marginTop: 12 }}>
                  <div className="field">
                    <label>When? <span className="opt">optional</span></label>
                    <input type="text" name="when" placeholder="e.g. Dec 20" />
                  </div>
                  <div className="field">
                    <label>Budget <span className="opt">optional</span></label>
                    <input type="text" name="budget" placeholder="e.g. $100, flexible" />
                  </div>
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Step 4</span>
                <div className="step-title">Where and how do we reach you?</div>
                <div className="step-sub">We&apos;ll reach out personally to plan it together.</div>
                <div className="field"><label>Name</label><input type="text" name="name" placeholder="Your name" /></div>
                <div className="field"><label>Email</label><input type="email" name="email" placeholder="your@email.com" /></div>
                <div className="field-row">
                  <div className="field"><label>Phone <span className="opt">optional</span></label><input type="tel" name="phone" placeholder="(612) 000-0000" /></div>
                  <div className="field"><label>Social <span className="opt">optional</span></label><input type="text" name="social" placeholder="@handle" /></div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>State</label>
                    <select name="state" defaultValue="">
                      <option value="" disabled>Pick state</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>City</label><input type="text" name="city" placeholder="Your city" /></div>
                </div>
                {err && <p className="form-error">{err}</p>}
                <button className="sub-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Request a hero →'}</button>
                <p className="priv">Your info stays with us. We only use it to plan your request.</p>
              </div>

            </div>
          </form>
        )}
      </div>

      <footer>
        <p>Zay Meets World · traveling to a place near you soon</p>
      </footer>
    </div>
  )
}
