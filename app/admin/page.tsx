'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1208 0%, #2E2010 60%, #3D2B1A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>☕</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--brand-primary)' }}>Cupstore</h1>
          <p style={{ color: 'rgba(253,246,236,0.5)', fontSize: 14, marginTop: 6 }}>Admin Dashboard</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(200,169,110,0.2)',
          borderRadius: 24,
          padding: '40px 36px',
          backdropFilter: 'blur(12px)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#FDF6EC', fontSize: 24, marginBottom: 8 }}>Sign In</h2>
          <p style={{ color: 'rgba(253,246,236,0.5)', fontSize: 14, marginBottom: 32 }}>Enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: 'rgba(253,246,236,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="admin"
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(200,169,110,0.25)',
                  borderRadius: 12,
                  padding: '13px 16px',
                  color: '#FDF6EC',
                  fontSize: 15,
                }}
              />
            </div>
            <div>
              <label style={{ color: 'rgba(253,246,236,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(200,169,110,0.25)',
                  borderRadius: 12,
                  padding: '13px 16px',
                  color: '#FDF6EC',
                  fontSize: 15,
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
                padding: '12px 16px',
                color: '#FCA5A5',
                fontSize: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(200,169,110,0.08)', borderRadius: 10, border: '1px solid rgba(200,169,110,0.15)' }}>
            <p style={{ color: 'rgba(253,246,236,0.5)', fontSize: 12, textAlign: 'center' }}>
              Default credentials: <strong style={{ color: 'var(--brand-primary)' }}>admin</strong> / <strong style={{ color: 'var(--brand-primary)' }}>cupstore2024</strong><br />
              <span style={{ opacity: 0.7 }}>Set ADMIN_USERNAME & ADMIN_PASSWORD env vars to change.</span>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: 'rgba(253,246,236,0.4)', fontSize: 13 }}>← Back to Website</a>
        </div>
      </div>
    </div>
  )
}
