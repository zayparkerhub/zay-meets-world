'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{
      background: '#FF6600',
      minHeight: '100vh',
      fontFamily: 'var(--font-dm-sans), DM Sans, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Floating emojis */}
      <div className="float-layer">
        <span className="f f1">🧭</span><span className="f f2">❤️</span><span className="f f3">📍</span>
        <span className="f f4">💛</span><span className="f f5">🌄</span><span className="f f6">🩷</span>
        <span className="f f7">✈️</span><span className="f f8">🤍</span><span className="f f9">⭐</span>
        <span className="f f10">💕</span><span className="f f11">🗺️</span><span className="f f12">💛</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px 32px',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          Open-source documentary · Every US state
        </div>

        {/* Brand */}
        <div style={{
          fontSize: 'clamp(13px, 3vw, 16px)',
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Zay Meets World
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 9vw, 64px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          margin: '0 0 20px',
          maxWidth: 560,
        }}>
          Be part of something real.
        </h1>

        {/* Body */}
        <p style={{
          fontSize: 'clamp(15px, 3.5vw, 18px)',
          color: 'rgba(255,255,255,0.8)',
          lineHeight: 1.65,
          textAlign: 'center',
          maxWidth: 420,
          margin: '0 0 48px',
          fontWeight: 400,
        }}>
          We&apos;re traveling every state filming human connection no one talks about — the kindness, the stories, the people worth knowing. You&apos;re not just watching. You&apos;re the reason it happens.
        </p>

        {/* CTA cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          width: '100%',
          maxWidth: 400,
        }}>

          {/* Join */}
          <Link href="/join" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff',
              borderRadius: 20,
              padding: '24px 24px 22px',
              cursor: 'pointer',
              transition: 'transform 0.18s, box-shadow 0.18s',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏃‍♂️</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: '#0D0D0D', marginBottom: 6, letterSpacing: '-0.01em' }}>
                    Join the journey
                  </div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.55 }}>
                    Send me somewhere. Spread love in your city. Get on the road with us.
                  </div>
                </div>
                <div style={{
                  fontSize: 20,
                  color: '#FF6600',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: 4,
                }}>→</div>
              </div>
            </div>
          </Link>

          {/* Support */}
          <Link href="/join?tab=support" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(0,0,0,0.18)',
              borderRadius: 20,
              padding: '24px 24px 22px',
              cursor: 'pointer',
              border: '1.5px solid rgba(255,255,255,0.25)',
              transition: 'transform 0.18s, background 0.18s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.28)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.18)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>💛</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>
                    Back the movement
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>
                    Help keep this going — for the road and the people on it.
                  </div>
                </div>
                <div style={{
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: 4,
                }}>→</div>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 20px 28px',
      }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          @zaymeetsworld · traveling to a place near you soon
        </p>
      </div>

    </div>
  )
}
