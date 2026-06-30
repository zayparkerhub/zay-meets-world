'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{
      background: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: 'var(--font-dm-sans), DM Sans, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Floating emojis — subtle on white */}
      <div className="float-layer" style={{ opacity: 0.09 }}>
        <span className="f f1">🛣️</span><span className="f f2">❤️</span><span className="f f3">🤝</span>
        <span className="f f4">💛</span><span className="f f5">🌄</span><span className="f f6">🫶</span>
        <span className="f f7">✈️</span><span className="f f8">🌟</span><span className="f f9">📍</span>
        <span className="f f10">💫</span><span className="f f11">🗺️</span><span className="f f12">❤️</span>
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 20px 32px',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#FF6600',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          Open-source documentary · A first of its kind
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 10vw, 72px)',
          fontWeight: 800,
          color: '#0D0D0D',
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          margin: '0 0 24px',
          maxWidth: 600,
        }}>
          Can we still come together?
        </h1>

        {/* Body */}
        <p style={{
          fontSize: 'clamp(15px, 3.5vw, 17px)',
          color: '#555',
          lineHeight: 1.75,
          textAlign: 'center',
          maxWidth: 460,
          margin: '0 0 16px',
          fontWeight: 400,
        }}>
          Zay is venturing into the unknown — no car, no fixed plan, just the kindness of strangers
          and a camera pointed at the human experience. Every person he meets. Every place he finds.
          Every moment in between.
        </p>
        <p style={{
          fontSize: 'clamp(15px, 3.5vw, 17px)',
          color: '#0D0D0D',
          lineHeight: 1.75,
          textAlign: 'center',
          maxWidth: 460,
          margin: '0 0 48px',
          fontWeight: 700,
        }}>
          This is a test to see if human connection is still real. And you&apos;re part of what happens next.
        </p>

        {/* Arrows */}
        <div className="landing-arrows" style={{ color: '#FF6600' }}>
          <span className="arrow-bounce">↓</span>
          <span className="arrow-bounce-r">↓</span>
        </div>

        {/* Cards */}
        <div className="landing-cards">

          {/* Join */}
          <Link href="/join" className="landing-card" style={{
            background: '#FF6600',
            borderRadius: 22,
            padding: '28px 24px 24px',
            textDecoration: 'none',
            display: 'block',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏃‍♂️</div>
            <div style={{
              fontSize: 19,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 8,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              Join the journey
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: 20 }}>
              Send Zay somewhere. Spread love in your city. Get on the road with us.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 800,
              color: '#fff',
              background: 'rgba(0,0,0,0.18)',
              padding: '8px 14px',
              borderRadius: 20,
            }}>
              I&apos;m in <span style={{ fontSize: 16 }}>→</span>
            </div>
          </Link>

          {/* Support */}
          <Link href="/join?tab=support" className="landing-card" style={{
            background: '#0D0D0D',
            borderRadius: 22,
            padding: '28px 24px 24px',
            textDecoration: 'none',
            display: 'block',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💛</div>
            <div style={{
              fontSize: 19,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 8,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              Back the movement
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 20 }}>
              Help fuel the road and the good it creates along the way.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 800,
              color: '#fff',
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 14px',
              borderRadius: 20,
            }}>
              Support <span style={{ fontSize: 16 }}>→</span>
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
        <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
          @zaymeetsworld · the road starts soon
        </p>
      </div>

    </div>
  )
}
