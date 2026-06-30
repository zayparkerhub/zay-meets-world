'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{
      background: '#0C0C14',
      minHeight: '100vh',
      fontFamily: 'var(--font-dm-sans), DM Sans, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Floating emojis */}
      <div className="float-layer">
        <span className="f f1">🛣️</span><span className="f f2">❤️</span><span className="f f3">🤝</span>
        <span className="f f4">💛</span><span className="f f5">🌄</span><span className="f f6">🩷</span>
        <span className="f f7">✈️</span><span className="f f8">🤍</span><span className="f f9">🌟</span>
        <span className="f f10">🫶</span><span className="f f11">🗺️</span><span className="f f12">💫</span>
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '52px 20px 28px',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 22,
          textAlign: 'center',
        }}>
          Hitchhiking across America · Open-source documentary
        </div>

        {/* Brand */}
        <div style={{
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#FF6600',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          Zay Meets World
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(38px, 9vw, 68px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          textAlign: 'center',
          margin: '0 0 22px',
          maxWidth: 580,
        }}>
          Real life is still out there.
        </h1>

        {/* Body */}
        <p style={{
          fontSize: 'clamp(15px, 3.5vw, 17px)',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7,
          textAlign: 'center',
          maxWidth: 440,
          margin: '0 0 44px',
          fontWeight: 400,
        }}>
          We&apos;re hitting the road with nothing but a camera — carried by strangers, guided by the people who give a damn. This is a movement to prove that human connection is still alive, that we can still come together, and that real life is worth showing up for.
          <br /><br />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            You&apos;re not watching from the outside.
          </span>
        </p>

        {/* Arrows */}
        <div className="landing-arrows">
          <span className="arrow-bounce">↓</span>
          <span className="arrow-bounce-r">↓</span>
        </div>

        {/* Cards */}
        <div className="landing-cards">

          {/* Join */}
          <Link href="/join" className="landing-card landing-card-join">
            <div style={{ fontSize: 30, marginBottom: 12 }}>🏃‍♂️</div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0D0D0D',
              marginBottom: 8,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              Join the journey
            </div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 18 }}>
              Send me somewhere. Spread love in your city. Come be part of it.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 800,
              color: '#FF6600',
            }}>
              I&apos;m in <span style={{ fontSize: 16 }}>→</span>
            </div>
          </Link>

          {/* Support */}
          <Link href="/join?tab=support" className="landing-card landing-card-back">
            <div style={{ fontSize: 30, marginBottom: 12 }}>💛</div>
            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 8,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              Back the movement
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 18 }}>
              Help fuel the road and the good it creates along the way.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.6)',
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
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
          @zaymeetsworld · the road starts soon
        </p>
      </div>

    </div>
  )
}
