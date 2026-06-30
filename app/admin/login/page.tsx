'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [key, setKey]     = useState('')
  const [err, setErr]     = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setErr('Wrong password.')
      setLoading(false)
    }
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
            placeholder="Password"
            value={key}
            onChange={e => setKey(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 14px',
              fontSize: 15,
              border: `2px solid ${err ? '#CC1F1F' : '#E8E8E8'}`,
              borderRadius: 10,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 8,
              fontFamily: 'system-ui',
            }}
            autoFocus
          />
          {err && <p style={{ color: '#CC1F1F', fontSize: 12, fontWeight: 600, margin: '0 0 10px' }}>{err}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#FF6600',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '...' : 'Go →'}
          </button>
        </form>
      </div>
    </div>
  )
}
