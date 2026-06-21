'use client'
import { useState } from 'react'
import type { Ad } from '@/lib/store'

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  cta: 'Learn More',
  badge: '',
  bgColor: '#1A1208',
  textColor: '#FDF6EC',
  active: true,
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: ok ? '#1A1208' : '#7F1D1D',
      color: '#FDF6EC', padding: '14px 24px', borderRadius: 12, fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {ok ? '✅' : '❌'} {msg}
    </div>
  )
}

interface Props {
  ads: Ad[]
  onRefresh: () => void
}

export default function AdsManager({ ads, onRefresh }: Props) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editId, setEditId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  function startEdit(ad: Ad) {
    setForm({
      title: ad.title,
      subtitle: ad.subtitle,
      cta: ad.cta,
      badge: ad.badge || '',
      bgColor: ad.bgColor,
      textColor: ad.textColor,
      active: ad.active,
    })
    setEditId(ad.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { ...form, badge: form.badge || undefined }
    const url = editId ? `/api/ads/${editId}` : '/api/ads'
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      showToast(editId ? 'Ad updated!' : 'Ad created!')
      resetForm()
      onRefresh()
    } else {
      showToast('Something went wrong', false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' })
    setDeleting(null)
    if (res.ok) {
      showToast('Ad deleted')
      onRefresh()
    } else {
      showToast('Delete failed', false)
    }
  }

  async function toggleActive(ad: Ad) {
    const res = await fetch(`/api/ads/${ad.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ad, active: !ad.active }),
    })
    if (res.ok) {
      showToast(ad.active ? 'Ad deactivated' : 'Ad activated!')
      onRefresh()
    }
  }

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--brand-dark)' }}>Ads & Promotions</h2>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>{ads.length} ads · {ads.filter(a => a.active).length} active</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm() }} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ New Ad'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: '32px', marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, color: 'var(--brand-dark)' }}>
            {editId ? 'Edit Ad' : 'Create New Ad'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Headline *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Weekend Brunch Special" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Badge (optional)</label>
                <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. Limited Spots" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Subtitle / Body *</label>
              <textarea value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} required placeholder="Describe the offer or event…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>CTA Label *</label>
                <input value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} required placeholder="e.g. Reserve a Table" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Background Colour</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))} style={{ width: 44, height: 40, borderRadius: 8, border: '1px solid var(--border-color)', cursor: 'pointer', padding: 2 }} />
                  <input value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))} style={{ ...inputStyle, flex: 1 }} placeholder="#1A1208" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Text Colour</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={form.textColor} onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))} style={{ width: 44, height: 40, borderRadius: 8, border: '1px solid var(--border-color)', cursor: 'pointer', padding: 2 }} />
                  <input value={form.textColor} onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))} style={{ ...inputStyle, flex: 1 }} placeholder="#FDF6EC" />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Preview</label>
              <div style={{
                background: form.bgColor,
                color: form.textColor,
                borderRadius: 16,
                padding: '28px 24px',
                maxWidth: 360,
              }}>
                {form.badge && (
                  <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
                    {form.badge}
                  </span>
                )}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>{form.title || 'Ad Headline'}</div>
                <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5, marginBottom: 14 }}>{form.subtitle || 'Ad body text…'}</div>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 50 }}>
                  {form.cta || 'CTA'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--brand-primary)' }} />
              <label htmlFor="active" style={{ fontSize: 14, color: 'var(--brand-dark)', cursor: 'pointer' }}>Active (visible on homepage)</label>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary">{editId ? 'Save Changes' : 'Create Ad'}</button>
              <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Ads List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ads.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--brand-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📣</div>
            No ads yet. Create your first promotion above!
          </div>
        )}
        {ads.map(ad => (
          <div key={ad.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border-color)', padding: '24px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Swatch */}
            <div style={{ width: 64, height: 64, borderRadius: 12, background: ad.bgColor, flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--brand-dark)' }}>{ad.title}</h4>
                {ad.badge && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'rgba(200,169,110,0.15)', color: 'var(--brand-dark)' }}>{ad.badge}</span>
                )}
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: ad.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: ad.active ? '#16A34A' : '#DC2626' }}>
                  {ad.active ? '● Active' : '○ Inactive'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{ad.subtitle}</p>
              <p style={{ fontSize: 12, color: 'var(--brand-muted)' }}>CTA: "{ad.cta}"</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              <button onClick={() => startEdit(ad)} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: 'var(--brand-dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => toggleActive(ad)} style={{ padding: '8px 16px', borderRadius: 8, background: ad.active ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${ad.active ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`, color: ad.active ? '#DC2626' : '#16A34A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {ad.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(ad.id)} disabled={deleting === ad.id} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: deleting === ad.id ? 0.5 : 1 }}>
                {deleting === ad.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-color)', fontSize: 14, color: 'var(--brand-dark)', background: '#FAFAF8' }
