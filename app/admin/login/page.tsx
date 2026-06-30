'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [key, setKey] = useState('')
  const router = useRouter()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/admin?key=${encodeURIComponent(key)}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FF6600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '32px 24px',
        width: '100%',
        maxWidth: 340,
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>🧭</div>
        <div style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', marginBottom: 4, color: '#0D0D0D' }}>
          Zay Meets World
        </div>
        <div style={{ fontSize: 13, color: '#999', textAlign: 'center', marginBottom: 24 }}>
          Admin access
        </div>
        <form onSubmit={submit} noValidate>
          <input
            type="password"
            placeholder="Enter your key"
            value={key}
            onChange={e => setKey(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 14px',
              fontSize: 15,
              border: '2px solid #E8E8E8',
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 12,
              fontFamily: 'system-ui',
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#FF6600',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'system-ui',
            }}
          >
            Go →
          </button>
        </form>
      </div>
    </div>
  )
}
