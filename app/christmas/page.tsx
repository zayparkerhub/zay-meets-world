'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { STATES, Chip, useChips, fd, contactFrom, postSubmission, Honeypot } from '@/lib/form-helpers'

const NEEDS = [
  { value: 'essentials', emoji: '🧺', label: 'Everyday essentials' },
  { value: 'warm',       emoji: '🧥', label: 'Warm clothes' },
  { value: 'groceries',  emoji: '🛒', label: 'Groceries / a meal' },
  { value: 'kids',       emoji: '🧸', label: 'Gifts for kids' },
  { value: 'bills',      emoji: '🏠', label: 'Help with bills' },
  { value: 'company',    emoji: '🫶', label: 'Company / a visit' },
  { value: 'experience', emoji: '🎄', label: 'A special experience' },
  { value: 'other',      emoji: '✨', label: 'Something else' },
]

type Mode = 'nominate' | 'wish'

export default function ChristmasPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [mode, setMode] = useState<Mode>('nominate')
  const [needs, toggleNeed] = useChips()
  const [knows, setKnows] = useState<'yes' | 'no' | 'surprise'>('surprise')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  const nominating = mode === 'nominate'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = formRef.current
    const contact = contactFrom(form)
    const wish = fd(form, 'wish')
    const story = fd(form, 'story')

    if (nominating && !fd(form, 'nominee_name')) return setErr('Tell us who you’re nominating.')
    if (needs.length === 0) return setErr('Pick at least one thing they could use.')
    if (!story) return setErr(nominating ? 'Tell us a little about them.' : 'Tell us a little about you.')
    if (!contact.email && !contact.social && !contact.phone) return setErr('Leave an email, social, or phone so we can reach you.')

    setLoading(true)
    setErr('')
    const error = await postSubmission({
      tab: 'love',
      pathway: nominating ? 'christmas_nominate' : 'christmas_wish',
      contact,
      data: nominating ? {
        nominee: fd(form, 'nominee_name'),
        relationship: fd(form, 'relationship'),
        nominee_location: [fd(form, 'nominee_city'), fd(form, 'nominee_state')].filter(Boolean).join(', '),
        they_know: knows === 'yes' ? 'Yes' : knows === 'no' ? 'No' : 'Keep it a surprise',
        needs,
        wish,
        story,
      } : {
        needs,
        wish,
        story,
      },
      is_creator: false,
      is_brand: false,
    }, form)
    setLoading(false)
    if (error) setErr(error)
    else { setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  function switchMode(m: Mode) {
    setMode(m)
    setErr('')
  }

  return (
    <div style={{ background: 'var(--love)', minHeight: '100vh' }}>
      <div className="float-layer">
        <span className="f f1">🎄</span><span className="f f2">❄️</span><span className="f f3">🎁</span>
        <span className="f f4">⭐</span><span className="f f5">🦌</span><span className="f f6">❄️</span>
        <span className="f f7">🎅</span><span className="f f8">🎁</span><span className="f f9">❤️</span>
        <span className="f f10">🎄</span><span className="f f11">✨</span><span className="f f12">❄️</span>
      </div>

      <div className="top">
        <Link href="/" className="back-link">← Zay Meets World</Link>
        <div className="eyebrow">Christmas Wishlist 🎄</div>
        <div className="brand-name">Who deserves a little Christmas magic this year?</div>
        <div className="toggle-wrap">
          <button className={`toggle-btn${nominating ? ' active' : ''}`} onClick={() => switchMode('nominate')}>
            🎁 Nominate
          </button>
          <button className={`toggle-btn${!nominating ? ' active' : ''}`} onClick={() => switchMode('wish')}>
            ⭐ My wish
          </button>
        </div>
        <div className="toggle-sub">
          {nominating
            ? 'Know someone going through a hard time? Tell us about them.'
            : 'Going through it this season? It’s okay to ask.'}
        </div>
      </div>

      <div className="panel love-panel active">
        {done ? (
          <div className="form-wrap">
            <div className="step-card success show">
              <div className="si">🎄</div>
              <div className="st">{nominating ? 'Nomination received.' : 'Wish received.'}</div>
              <div className="sb">
                {nominating
                  ? 'Thank you for looking out for someone. We read every story and we’ll reach out to you before doing anything.'
                  : 'Thank you for trusting us. We read every wish and we’ll reach out if we can make it happen.'}
              </div>
              <Link href="/" className="pl">Back home</Link>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} noValidate key={mode}>
            <Honeypot />
            <div className="form-wrap">

              {nominating && (
                <div className="step-card">
                  <span className="step-pill pill-l">Step 1</span>
                  <div className="step-title">Who are you nominating?</div>
                  <div className="field-row">
                    <div className="field"><label>Their first name</label><input type="text" name="nominee_name" placeholder="First name" /></div>
                    <div className="field"><label>Who are they to you?</label><input type="text" name="relationship" placeholder="e.g. Neighbor" /></div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Their state</label>
                      <select name="nominee_state" defaultValue="">
                        <option value="" disabled>Pick state</option>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Their city</label><input type="text" name="nominee_city" placeholder="City" /></div>
                  </div>
                  <div className="field">
                    <label>Do they know you&apos;re nominating them?</label>
                    <div className="reach-row">
                      <button type="button" className={`rp${knows === 'surprise' ? ' on' : ''}`} onClick={() => setKnows('surprise')}>Keep it a surprise</button>
                      <button type="button" className={`rp${knows === 'yes' ? ' on' : ''}`} onClick={() => setKnows('yes')}>Yes</button>
                      <button type="button" className={`rp${knows === 'no' ? ' on' : ''}`} onClick={() => setKnows('no')}>No</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="step-card">
                <span className="step-pill pill-l">Step {nominating ? 2 : 1}</span>
                <div className="step-title">{nominating ? 'What could they use this Christmas?' : 'What could you use this Christmas?'}</div>
                <div className="step-sub">Pick everything that fits.</div>
                <div className="grid g2">
                  {NEEDS.map(n => (
                    <Chip key={n.value} emoji={n.emoji} label={n.label}
                      selected={needs.includes(n.value)} onToggle={() => toggleNeed(n.value)} />
                  ))}
                </div>
                <div className="field" style={{ marginTop: 14 }}>
                  <label>The wish <span className="opt">optional</span></label>
                  <input type="text" name="wish" placeholder={nominating ? 'e.g. A new winter coat, toys for her two kids' : 'e.g. A warm coat, a Christmas dinner'} />
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-l">Step {nominating ? 3 : 2}</span>
                <div className="step-title">{nominating ? 'Tell us their story' : 'Tell us your story'}</div>
                <div className="step-sub">
                  {nominating
                    ? 'Why do they deserve this? What are they going through, and what makes them special?'
                    : 'Share as much or as little as you’re comfortable with.'}
                </div>
                <div className="field">
                  <textarea name="story" placeholder={nominating ? 'She’s a single mom who always puts everyone else first...' : 'This year has been...'} />
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-l">Step {nominating ? 4 : 3}</span>
                <div className="step-title">{nominating ? 'How do we reach you?' : 'How do we reach you?'}</div>
                <div className="step-sub">
                  {nominating
                    ? 'We’ll contact you first — never the person you nominated without checking with you.'
                    : 'We’ll reach out personally.'}
                </div>
                <div className="field"><label>Your name</label><input type="text" name="name" placeholder="Your name" /></div>
                <div className="field"><label>Email</label><input type="email" name="email" placeholder="your@email.com" /></div>
                <div className="field-row">
                  <div className="field"><label>Phone <span className="opt">optional</span></label><input type="tel" name="phone" placeholder="(612) 000-0000" /></div>
                  <div className="field"><label>Social <span className="opt">optional</span></label><input type="text" name="social" placeholder="@handle" /></div>
                </div>
                {!nominating && (
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
                )}
                {err && <p className="form-error">{err}</p>}
                <button className="sub-btn" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : nominating ? 'Send nomination 🎁' : 'Send my wish ⭐'}
                </button>
                <p className="priv">Everything you share stays private. We never post anyone&apos;s story without permission.</p>
              </div>

            </div>
          </form>
        )}
      </div>

      <footer>
        <p>Zay Meets World · spreading love this Christmas</p>
      </footer>
    </div>
  )
}
