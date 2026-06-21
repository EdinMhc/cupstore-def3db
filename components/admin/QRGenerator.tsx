'use client'
import { useState, useEffect, useRef } from 'react'

export default function QRGenerator() {
  const [url, setUrl] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Pre-fill with the current origin on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin + '/menu')
    }
  }, [])

  async function generateQR() {
    if (!url.trim()) return
    setGenerating(true)
    setError('')
    setQrDataUrl(null)
    try {
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(url.trim(), {
        width: 400,
        margin: 2,
        color: { dark: '#1A1208', light: '#FFFDF9' },
      })
      setQrDataUrl(dataUrl)
    } catch {
      setError('Failed to generate QR code. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  function downloadQR() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'cupstore-menu-qr.png'
    a.click()
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available — silently ignore
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--brand-dark)' }}>QR Code Generator</h2>
        <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>
          Generate a scannable QR code for your restaurant tables, pointing guests to the digital menu.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Left: controls */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Menu URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://your-domain.com/menu"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={copyUrl}
                title="Copy URL"
                style={{ padding: '11px 16px', borderRadius: 10, background: copied ? 'rgba(34,197,94,0.1)' : '#F7F2EB', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: 16 }}>
                {copied ? '✅' : '📋'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 6 }}>
              Change this to any URL you want the QR code to link to.
            </p>
          </div>

          <button
            onClick={generateQR}
            disabled={generating || !url.trim()}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', opacity: generating || !url.trim() ? 0.6 : 1 }}>
            {generating ? 'Generating…' : '⚡ Generate QR Code'}
          </button>

          {error && (
            <div style={{ marginTop: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Tips */}
          <div style={{ marginTop: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-dark)', marginBottom: 12 }}>💡 Tips for use</p>
            <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Print the QR code and laminate for each table.</li>
              <li>Recommended print size: 6 × 6 cm or larger.</li>
              <li>Test the scan before placing on tables.</li>
              <li>Re-generate whenever your menu URL changes.</li>
            </ul>
          </div>
        </div>

        {/* Right: QR preview */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: 32, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {qrDataUrl ? (
            <>
              <div style={{ background: '#FFFDF9', borderRadius: 16, padding: 16, border: '1px solid var(--border-color)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} src={qrDataUrl} alt="QR Code" width={240} height={240} style={{ display: 'block' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--brand-dark)', marginBottom: 4 }}>☕ Cupstore</div>
                <div style={{ fontSize: 12, color: 'var(--brand-muted)' }}>Scan to view menu</div>
              </div>
              <button onClick={downloadQR} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                ⬇ Download PNG
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--brand-muted)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📱</div>
              <p style={{ fontSize: 14 }}>Your QR code will appear here after you generate it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-color)', fontSize: 14, color: 'var(--brand-dark)', background: '#FAFAF8' }
