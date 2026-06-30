'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/* ─────────────────────────── helpers ─────────────────────────── */

const STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

function ContactFields({ prefix = '' }: { prefix?: string }) {
  return (
    <>
      <div className="field">
        <label>Name</label>
        <input type="text" name={`${prefix}name`} placeholder="Your name" />
      </div>
      <div className="field">
        <label>Email <span className="opt">or fill social below</span></label>
        <input type="text" name={`${prefix}email`} placeholder="your@email.com" />
      </div>
      <div className="field">
        <label>Social <span className="opt">or fill email above</span></label>
        <input type="text" name={`${prefix}social`} placeholder="@handle" />
      </div>
      <div className="field">
        <label>Phone <span className="opt">optional</span></label>
        <input type="tel" name={`${prefix}phone`} placeholder="(612) 000-0000" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>State <span className="opt">optional</span></label>
          <select name={`${prefix}state`} defaultValue="">
            <option value="" disabled>Pick state</option>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>City <span className="opt">optional</span></label>
          <input type="text" name={`${prefix}city`} placeholder="Your city" />
        </div>
      </div>
    </>
  )
}

function Chip({ label, emoji, sub, selected, onToggle }: {
  label: string; emoji?: string; sub?: string
  selected: boolean; onToggle: () => void
}) {
  return (
    <div className={`cc${selected ? ' on' : ''}`} onClick={onToggle}>
      {emoji && <span className="ce">{emoji}</span>}
      <span className="ct">{label}</span>
      {sub && <span className="cd">{sub}</span>}
    </div>
  )
}

function useChips(initial: string[] = []) {
  const [chips, setChips] = useState<string[]>(initial)
  const toggle = useCallback((v: string) =>
    setChips(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  , [])
  return [chips, toggle] as const
}

/* ─────────────────────────── main page ────────────────────────── */

export default function Page() {
  const [tab, setTab] = useState<'explore' | 'love'>('explore')
  const [lovePathway, setLovePathway] = useState<string | null>(null)

  // Explore extras
  const [exploreCreator, setExploreCreator] = useState(false)
  const [exploreBrand, setExploreBrand] = useState(false)

  // Love extras
  const [loveCreator, setLoveCreator] = useState(false)
  const [loveBrand, setLoveBrand] = useState(false)
  const [loveCreatorIdea, setLoveCreatorIdea] = useState(false)

  // Success states
  const [exploreSuccess, setExploreSuccess] = useState(false)
  const [loveSuccess, setLoveSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // Chip selections
  const [exploreTypes, toggleExploreType]    = useChips()
  const [exploreCreatorPlatforms, toggleECP] = useChips()
  const [exploreCreatorWants, toggleECW]     = useChips()
  const [loveCreatorPlatforms, toggleLCP]    = useChips()
  const [loveCreatorParts, toggleLCPart]     = useChips()
  const [commitActs, toggleCommitAct]        = useChips()
  const [communityActs, toggleCommunityAct]  = useChips()
  const [reachPref, setReachPref]            = useState('')

  // Form refs
  const exploreFormRef   = useRef<HTMLFormElement>(null)
  const sponsorFormRef   = useRef<HTMLFormElement>(null)
  const commitFormRef    = useRef<HTMLFormElement>(null)
  const ideaFormRef      = useRef<HTMLFormElement>(null)
  const communityFormRef = useRef<HTMLFormElement>(null)

  function fd(form: HTMLFormElement | null, key: string) {
    if (!form) return ''
    return (new FormData(form).get(key) as string) ?? ''
  }

  function contactFrom(form: HTMLFormElement | null, prefix = '') {
    return {
      name:   fd(form, `${prefix}name`),
      email:  fd(form, `${prefix}email`),
      social: fd(form, `${prefix}social`),
      phone:  fd(form, `${prefix}phone`),
      state:  fd(form, `${prefix}state`),
      city:   fd(form, `${prefix}city`),
    }
  }

  function hp(form: HTMLFormElement | null) {
    return fd(form, 'website')
  }

  async function submit(payload: object, form?: HTMLFormElement | null) {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, honeypot: hp(form ?? null) }),
      })
      if (!res.ok) throw new Error('Failed')
      return true
    } catch {
      setErr('Something went wrong — try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function submitExplore(e: React.FormEvent) {
    e.preventDefault()
    const form = exploreFormRef.current
    const ok = await submit({
      tab: 'explore',
      pathway: 'explore',
      contact: contactFrom(form),
      data: {
        types: exploreTypes,
        story: fd(form, 'story'),
        reach_pref: reachPref,
      },
      is_creator: exploreCreator,
      creator_data: exploreCreator ? {
        platforms: exploreCreatorPlatforms,
        wants: exploreCreatorWants,
        ...contactFrom(form, 'ec_'),
      } : undefined,
      is_brand: exploreBrand,
      brand_data: exploreBrand ? {
        company:     fd(form, 'eb_company'),
        description: fd(form, 'eb_desc'),
        partnership: fd(form, 'eb_partnership'),
        ...contactFrom(form, 'eb_'),
      } : undefined,
    }, form)
    if (ok) setExploreSuccess(true)
  }

  async function submitLove(
    pathway: string,
    formRef: React.RefObject<HTMLFormElement | null>,
    extraData: object = {}
  ) {
    const form = formRef.current
    const ok = await submit({
      tab: 'love',
      pathway,
      contact: contactFrom(form),
      data: extraData,
      is_creator: loveCreator,
      creator_data: loveCreator ? {
        platforms: loveCreatorPlatforms,
        participation: loveCreatorParts,
        idea: fd(form, 'lc_idea'),
        ...contactFrom(form, 'lc_'),
      } : undefined,
      is_brand: loveBrand,
      brand_data: loveBrand ? {
        company:     fd(form, 'lb_company'),
        description: fd(form, 'lb_desc'),
        partnership: fd(form, 'lb_partnership'),
        ...contactFrom(form, 'lb_'),
      } : undefined,
    }, form)
    if (ok) setLoveSuccess(pathway)
  }

  useEffect(() => {
    document.body.classList.toggle('love-mode', tab === 'love')
    return () => { document.body.classList.remove('love-mode') }
  }, [tab])

  const switchTab = (t: 'explore' | 'love') => {
    setTab(t)
    setLovePathway(null)
    setLoveSuccess(null)
    setExploreSuccess(false)
    setErr('')
  }

  const pickPathway = (p: string) => {
    setLovePathway(p)
    setLoveSuccess(null)
    setErr('')
  }

  /* ── Shared love creator/brand extras ── */
  function LoveExtras() {
    return (
      <div className="step-card">
        <span className="step-pill pill-l">Optional</span>
        <div className="step-title">Creator or brand?</div>
        <div className="step-sub">Join the movement and help spread love with your platform.</div>
        <div className="extras">

          {/* Creator */}
          <div className={`xt${loveCreator ? ' on' : ''}`} onClick={() => setLoveCreator(v => !v)}>
            <div className="xl">
              <span className="xi">🎬</span>
              <div><div className="xn">I&apos;m a creator</div><div className="xs">Join me in spreading love</div></div>
            </div>
            <div className={`sw${loveCreator ? ' on' : ''}`} />
          </div>
          {loveCreator && (
            <div className="xf on">
              <div className="field">
                <label>Platforms</label>
                <div className="grid g3">
                  {[['📱','TikTok'],['▶️','YouTube'],['📸','Instagram']].map(([e,p]) => (
                    <Chip key={p} label={p} emoji={e} selected={loveCreatorPlatforms.includes(p)} onToggle={() => toggleLCP(p)} />
                  ))}
                </div>
              </div>
              <div className="field">
                <label>How do you want to co-create?</label>
                <div className="grid g2">
                  {['Co-create content','Run a challenge','Share an idea'].map(v => (
                    <Chip key={v} label={v} selected={loveCreatorParts.includes(v)}
                      onToggle={() => { toggleLCPart(v); if (v === 'Share an idea') setLoveCreatorIdea(x => !x) }} />
                  ))}
                </div>
              </div>
              {loveCreatorIdea && (
                <div className="field">
                  <textarea name="lc_idea" placeholder="What's the idea? Tell us what challenge, collab, or act of love you want to co-create..." />
                </div>
              )}
              <p className="step-sub" style={{margin:'12px 0 4px',fontWeight:700,color:'var(--text)'}}>Who are you?</p>
              <ContactFields prefix="lc_" />
            </div>
          )}

          {/* Brand */}
          <div className={`xt${loveBrand ? ' on' : ''}`} onClick={() => setLoveBrand(v => !v)}>
            <div className="xl">
              <span className="xi">🏢</span>
              <div><div className="xn">We&apos;re a brand</div><div className="xs">Sponsor acts of love on the road</div></div>
            </div>
            <div className={`sw${loveBrand ? ' on' : ''}`} />
          </div>
          {loveBrand && (
            <div className="xf on">
              <div className="field"><label>Company name</label><input type="text" name="lb_company" placeholder="Your brand or company" /></div>
              <div className="field"><label>What you make or sell</label><input type="text" name="lb_desc" placeholder="Brief description" /></div>
              <div className="field"><label>What kind of partnership?</label><textarea name="lb_partnership" style={{height:'80px'}} placeholder="Sponsoring acts, providing goods, co-creating content..." /></div>
              <div className="field"><label>Your name</label><input type="text" name="lb_name" placeholder="Who should we reach out to?" /></div>
              <div className="field"><label>Email <span className="opt">or fill social below</span></label><input type="text" name="lb_email" placeholder="your@email.com" /></div>
              <div className="field"><label>Social <span className="opt">or fill email above</span></label><input type="text" name="lb_social" placeholder="@handle or brand handle" /></div>
              <div className="field"><label>Phone <span className="opt">optional</span></label><input type="tel" name="lb_phone" placeholder="(612) 000-0000" /></div>
              <div className="field-row">
                <div className="field"><label>State <span className="opt">optional</span></label>
                  <select name="lb_state" defaultValue=""><option value="" disabled>Pick state</option>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="field"><label>City <span className="opt">optional</span></label><input type="text" name="lb_city" placeholder="Your city" /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─────────────────── render ─────────────────── */
  return (
    <div>

      {/* Floating emojis */}
      <div className={`float-layer${tab === 'love' ? ' hidden' : ''}`}>
        <span className="f f1">🧭</span><span className="f f2">✈️</span><span className="f f3">📍</span>
        <span className="f f4">⭐</span><span className="f f5">🌄</span><span className="f f6">🗺️</span>
        <span className="f f7">⚡</span><span className="f f8">🧭</span><span className="f f9">✈️</span>
        <span className="f f10">🌟</span><span className="f f11">📍</span><span className="f f12">⭐</span>
      </div>
      <div className={`float-layer${tab === 'explore' ? ' hidden' : ''}`}>
        <span className="f f1">❤️</span><span className="f f2">🤍</span><span className="f f3">❤️</span>
        <span className="f f4">💛</span><span className="f f5">❤️</span><span className="f f6">🩷</span>
        <span className="f f7">❤️</span><span className="f f8">💕</span><span className="f f9">❤️</span>
        <span className="f f10">🤍</span><span className="f f11">💗</span><span className="f f12">❤️</span>
      </div>

      {/* Hero */}
      <div className="top">
        <div className="eyebrow">Open-source documentary</div>
        <div className="brand-name">We&apos;re filming human connection across America. You write the roadmap.</div>
        <div className="toggle-label">Where are you joining?</div>
        <div className="toggle-wrap">
          <button className={`toggle-btn${tab === 'explore' ? ' active' : ''}`} onClick={() => switchTab('explore')}>
            🏃‍♂️ Send or join me somewhere
          </button>
          <button className={`toggle-btn${tab === 'love' ? ' active' : ''}`} onClick={() => switchTab('love')}>
            ❤️ Join the love
          </button>
        </div>
        <div className="toggle-sub">
          {tab === 'explore'
            ? 'Tell me where to go and who to meet in your city.'
            : 'Join the movement. Spread love however feels right to you.'}
        </div>
      </div>

      {/* ══ EXPLORE PANEL ══ */}
      <div className={`panel explore-panel${tab === 'explore' ? ' active' : ''}`}>
        {exploreSuccess ? (
          <div className="form-wrap">
            <div className="step-card success show">
              <div className="si">🧭</div>
              <div className="st">We got it.</div>
              <div className="sb">We read every single one. If your idea fits, we&apos;ll write back when we&apos;re on our way to your city. The world is ours to experience.</div>
            </div>
          </div>
        ) : (
          <form ref={exploreFormRef} onSubmit={submitExplore} noValidate>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} />
            <div className="form-wrap">

              <div className="step-card">
                <span className="step-pill pill-e">Step 1</span>
                <div className="step-title">What are you sending us?</div>
                <div className="step-sub">Pick everything that fits.</div>
                <div className="grid g3">
                  <Chip label="A person"   emoji="👋" sub="Someone we need to meet"      selected={exploreTypes.includes('person')}   onToggle={() => toggleExploreType('person')} />
                  <Chip label="A place"    emoji="📍" sub="A spot that feels like your city" selected={exploreTypes.includes('place')}    onToggle={() => toggleExploreType('place')} />
                  <Chip label="A business" emoji="🏪" sub="A local brand worth knowing"  selected={exploreTypes.includes('business')} onToggle={() => toggleExploreType('business')} />
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Step 2</span>
                <div className="step-title">Where are you?</div>
                <div className="step-sub">We plan visits based on where submissions cluster.</div>
                <div className="field-row">
                  <div className="field">
                    <label>State</label>
                    <select name="state" defaultValue="">
                      <option value="" disabled>Pick your state</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>City</label>
                    <input type="text" name="city" placeholder="Your city" />
                  </div>
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Step 3</span>
                <div className="step-title">What&apos;s the story?</div>
                <div className="step-sub">The more specific, the better. What would we miss if we didn&apos;t go?</div>
                <div className="field">
                  <textarea name="story" placeholder="Tell us about this person, place, or business..." />
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Step 4</span>
                <div className="step-title">How do we reach you?</div>
                <div className="step-sub">We write back personally when we&apos;re heading to your city.</div>
                <div className="field"><label>Name</label><input type="text" name="name" placeholder="Your name" /></div>
                <div className="field"><label>Email <span className="opt">or fill social below</span></label><input type="text" name="email" placeholder="your@email.com" /></div>
                <div className="field"><label>Social <span className="opt">or fill email above</span></label><input type="text" name="social" placeholder="@handle" /></div>
                <div className="field"><label>Phone <span className="opt">optional</span></label><input type="tel" name="phone" placeholder="(612) 000-0000" /></div>
                <div className="field">
                  <label>Best way to reach you</label>
                  <div className="reach-row">
                    {['Email','Text','DM','Any works'].map(v => (
                      <button key={v} type="button" className={`rp${reachPref === v ? ' on' : ''}`} onClick={() => setReachPref(v)}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-card">
                <span className="step-pill pill-e">Optional</span>
                <div className="step-title">Creator or brand?</div>
                <div className="step-sub">Expand if you want to collab or partner on the road.</div>
                <div className="extras">

                  <div className={`xt${exploreCreator ? ' on' : ''}`} onClick={() => setExploreCreator(v => !v)}>
                    <div className="xl">
                      <span className="xi">🎬</span>
                      <div><div className="xn">I&apos;m a creator</div><div className="xs">Add platforms + collab interest</div></div>
                    </div>
                    <div className={`sw${exploreCreator ? ' on' : ''}`} />
                  </div>
                  {exploreCreator && (
                    <div className="xf on">
                      <div className="field">
                        <label>Platforms</label>
                        <div className="grid g3">
                          {[['📱','TikTok'],['▶️','YouTube'],['📸','Instagram']].map(([e,p]) => (
                            <Chip key={p} label={p} emoji={e} selected={exploreCreatorPlatforms.includes(p)} onToggle={() => toggleECP(p)} />
                          ))}
                        </div>
                      </div>
                      <div className="field">
                        <label>I want to</label>
                        <div className="grid g2">
                          {['Meet up in my city','Collab on content','Share the journey','Brand partnership'].map(v => (
                            <Chip key={v} label={v} selected={exploreCreatorWants.includes(v)} onToggle={() => toggleECW(v)} />
                          ))}
                        </div>
                      </div>
                      <div className="field"><label>Name</label><input type="text" name="ec_name" placeholder="Your name" /></div>
                      <div className="field"><label>Email <span className="opt">or fill social below</span></label><input type="text" name="ec_email" placeholder="your@email.com" /></div>
                      <div className="field"><label>Social <span className="opt">or fill email above</span></label><input type="text" name="ec_social" placeholder="@handle" /></div>
                      <div className="field"><label>Phone <span className="opt">optional</span></label><input type="tel" name="ec_phone" placeholder="(612) 000-0000" /></div>
                      <div className="field-row">
                        <div className="field"><label>State <span className="opt">optional</span></label>
                          <select name="ec_state" defaultValue=""><option value="" disabled>Pick state</option>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
                        <div className="field"><label>City <span className="opt">optional</span></label><input type="text" name="ec_city" placeholder="Your city" /></div>
                      </div>
                    </div>
                  )}

                  <div className={`xt${exploreBrand ? ' on' : ''}`} onClick={() => setExploreBrand(v => !v)}>
                    <div className="xl">
                      <span className="xi">🏢</span>
                      <div><div className="xn">We&apos;re a brand</div><div className="xs">Sponsoring or partnering on the road</div></div>
                    </div>
                    <div className={`sw${exploreBrand ? ' on' : ''}`} />
                  </div>
                  {exploreBrand && (
                    <div className="xf on">
                      <div className="field"><label>Company name</label><input type="text" name="eb_company" placeholder="Your brand or company" /></div>
                      <div className="field"><label>What you make or sell</label><input type="text" name="eb_desc" placeholder="Brief description" /></div>
                      <div className="field"><label>What kind of partnership?</label><textarea name="eb_partnership" style={{height:'80px'}} placeholder="Sponsoring a city visit, providing goods, co-creating content..." /></div>
                      <div className="field"><label>Your name</label><input type="text" name="eb_name" placeholder="Who should we reach out to?" /></div>
                      <div className="field"><label>Email <span className="opt">or fill social below</span></label><input type="text" name="eb_email" placeholder="your@email.com" /></div>
                      <div className="field"><label>Social <span className="opt">or fill email above</span></label><input type="text" name="eb_social" placeholder="@handle or brand handle" /></div>
                      <div className="field"><label>Phone <span className="opt">optional</span></label><input type="tel" name="eb_phone" placeholder="(612) 000-0000" /></div>
                      <div className="field-row">
                        <div className="field"><label>State <span className="opt">optional</span></label>
                          <select name="eb_state" defaultValue=""><option value="" disabled>Pick state</option>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
                        <div className="field"><label>City <span className="opt">optional</span></label><input type="text" name="eb_city" placeholder="Your city" /></div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="priv">We use your info to stay in touch and build the community around this journey.</p>
                {err && <p className="form-error">{err}</p>}
                <button className="sub-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send it →'}</button>
              </div>

            </div>
          </form>
        )}
      </div>

      {/* ══ LOVE PANEL ══ */}
      <div className={`panel love-panel${tab === 'love' ? ' active' : ''}`}>
        <div className="form-wrap">

          {/* Pathway picker */}
          <div className="step-card">
            <span className="step-pill pill-l">Step 1</span>
            <div className="step-title">Join me on spreading love</div>
            <div className="step-sub">Pick one — you can always come back.</div>
            {[
              { id: 'sponsor',   emoji: '💛', title: 'Sponsor an act of love',   desc: 'Contribute any amount to help keep the journey going and the acts of kindness it creates along the way' },
              { id: 'community', emoji: '🌍', title: 'Join me in spreading love', desc: "Tell us what you want to do — when we're in your city, we just might do it together" },
              { id: 'idea',      emoji: '💡', title: 'Share an idea',            desc: 'Tell us what act of love should happen and where' },
              { id: 'commit',    emoji: '🤝', title: 'Make your own act',        desc: 'Just for you — commit to something kind this week, no ties to the journey' },
            ].map(p => (
              <div key={p.id} className={`pc${lovePathway === p.id ? ' on' : ''}`} onClick={() => pickPathway(p.id)}>
                <div className="pi">{p.emoji}</div>
                <div><div className="pt">{p.title}</div><div className="pd">{p.desc}</div></div>
              </div>
            ))}
          </div>

          {/* ── Sponsor ── */}
          {lovePathway === 'sponsor' && (
            loveSuccess === 'sponsor' ? (
              <div className="step-card success show">
                <div className="si">💛</div>
                <div className="st">You&apos;re part of this now.</div>
                <div className="sb">Send whatever feels right through any of these. It all goes toward keeping this moving and making moments happen for real people out there.</div>
                <div className="pay-links">
                  <a className="pl" href="https://venmo.com/zaymeetsworld" target="_blank" rel="noreferrer">💚 Venmo @zaymeetsworld</a>
                  <a className="pl" href="https://cash.app/$zaymeetsworld" target="_blank" rel="noreferrer">💵 Cash App $zaymeetsworld</a>
                  <a className="pl" href="https://paypal.me/zaymeetsworld" target="_blank" rel="noreferrer">🅿️ PayPal.me/zaymeetsworld</a>
                </div>
              </div>
            ) : (
              <form ref={sponsorFormRef} onSubmit={e => { e.preventDefault(); submitLove('sponsor', sponsorFormRef, { note: fd(sponsorFormRef.current, 'note') }) }} className="pf on" noValidate>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} />
                <div className="step-card">
                  <span className="step-pill pill-l">Step 2</span>
                  <div className="step-title">Who are you?</div>
                  <ContactFields />
                  <div className="field">
                    <label>A note for Zay <span className="opt">optional</span></label>
                    <textarea name="note" placeholder="Dedicate it to someone, tell us what kind of act, or just say hi..." />
                  </div>
                  <p className="priv">Your contribution — whatever you give — supports the journey and the good it does along the way.</p>
                  {err && <p className="form-error">{err}</p>}
                  <button className="sub-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send love →'}</button>
                </div>
                <LoveExtras />
              </form>
            )
          )}

          {/* ── Join me (community) ── */}
          {lovePathway === 'community' && (
            loveSuccess === 'community' ? (
              <div className="step-card success show">
                <div className="si">🌍</div>
                <div className="st">We&apos;ll find you.</div>
                <div className="sb">When we&apos;re in your city, we&apos;re reaching out. Every act of love on this journey, yours might be one of them.</div>
              </div>
            ) : (
              <form ref={communityFormRef} onSubmit={e => { e.preventDefault(); submitLove('community', communityFormRef, { acts: communityActs, description: fd(communityFormRef.current, 'description') }) }} className="pf on" noValidate>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} />
                <div className="step-card">
                  <span className="step-pill pill-l">Step 2</span>
                  <div className="step-title">What do you want to do?</div>
                  <div className="step-sub">Tell us the act you want to make happen. When we&apos;re in your city, we might just show up and do it with you.</div>
                  <div className="grid g2" style={{marginBottom:'14px'}}>
                    {[['🍽️','Feed someone'],['📞','Check in on someone'],['🙌','Show up for a stranger'],['🏠','Help a neighbor'],['🎁','Give something away'],['✍️','My own thing']].map(([emoji,label]) => (
                      <Chip key={label} emoji={emoji} label={label} selected={communityActs.includes(label)} onToggle={() => toggleCommunityAct(label)} />
                    ))}
                  </div>
                  <div className="field">
                    <textarea name="description" placeholder="Describe the act, the city, the people — the more specific, the better chance we show up for it..." />
                  </div>
                </div>
                <div className="step-card">
                  <span className="step-pill pill-l">Step 3</span>
                  <div className="step-title">Who are you?</div>
                  <ContactFields />
                  <p className="priv">We need at least one way to reach you — email or social. We&apos;ll reach out when we&apos;re in your city.</p>
                  {err && <p className="form-error">{err}</p>}
                  <button className="sub-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : "I'm in →"}</button>
                </div>
                <LoveExtras />
              </form>
            )
          )}

          {/* ── Share an idea ── */}
          {lovePathway === 'idea' && (
            loveSuccess === 'idea' ? (
              <div className="step-card success show">
                <div className="si">💡</div>
                <div className="st">We got your idea.</div>
                <div className="sb">Every act of love this journey makes happen, you helped make happen. We&apos;ll reach out if we&apos;re bringing your idea to life.</div>
              </div>
            ) : (
              <form ref={ideaFormRef} onSubmit={e => { e.preventDefault(); submitLove('idea', ideaFormRef, { idea: fd(ideaFormRef.current, 'idea') }) }} className="pf on" noValidate>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} />
                <div className="step-card">
                  <span className="step-pill pill-l">Step 2</span>
                  <div className="step-title">What&apos;s the idea?</div>
                  <div className="step-sub">Tell us what act of love should happen and where.</div>
                  <div className="field">
                    <textarea name="idea" placeholder="Describe the act, the city, the people involved, why it matters..." />
                  </div>
                </div>
                <div className="step-card">
                  <span className="step-pill pill-l">Step 3</span>
                  <div className="step-title">Who are you?</div>
                  <ContactFields />
                  <p className="priv">We&apos;ll reach out if we&apos;re bringing your idea to life.</p>
                  {err && <p className="form-error">{err}</p>}
                  <button className="sub-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send it →'}</button>
                </div>
                <LoveExtras />
              </form>
            )
          )}

          {/* ── Make your own act ── */}
          {lovePathway === 'commit' && (
            loveSuccess === 'commit' ? (
              <div className="step-card success show">
                <div className="si">🤝</div>
                <div className="st">You&apos;re in.</div>
                <div className="sb">We&apos;ll check in in 3 days. Every act of love this journey collects, yours is part of it. Thank you for being in this with us.</div>
              </div>
            ) : (
              <form ref={commitFormRef} onSubmit={e => { e.preventDefault(); submitLove('commit', commitFormRef, { acts: commitActs, own_act: fd(commitFormRef.current, 'own_act') }) }} className="pf on" noValidate>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{display:'none'}} />
                <div className="step-card">
                  <span className="step-pill pill-l">Step 2</span>
                  <div className="step-title">What will you do?</div>
                  <div className="step-sub">Pick one. You have 7 days. We&apos;ll check in.</div>
                  <div className="grid g2">
                    {[['📞','Call someone I love'],['💬','Tell a friend I appreciate them'],['☕','Take someone to coffee'],['✉️','Write a letter'],['🤝','Sit with someone lonely'],['✍️','My own act']].map(([emoji,label]) => (
                      <Chip key={label} emoji={emoji} label={label} selected={commitActs.includes(label)} onToggle={() => toggleCommitAct(label)} />
                    ))}
                  </div>
                  {commitActs.includes('My own act') && (
                    <div className="field" style={{marginTop:'12px'}}>
                      <input type="text" name="own_act" placeholder="Describe your act..." />
                    </div>
                  )}
                </div>
                <div className="step-card">
                  <span className="step-pill pill-l">Step 3</span>
                  <div className="step-title">Who are you?</div>
                  <ContactFields />
                  <p className="priv">We&apos;ll check in in 3 days.</p>
                  {err && <p className="form-error">{err}</p>}
                  <button className="sub-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : "I'm in →"}</button>
                </div>
              </form>
            )
          )}

        </div>
      </div>

      <footer>
        <p>Zay Meets World · traveling to a place near you soon</p>
      </footer>

    </div>
  )
}
