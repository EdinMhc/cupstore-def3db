'use client'
import { useState } from 'react'
import type { MenuItem, Category } from '@/lib/store'

const CATEGORIES: Category[] = ['drinks', 'starters', 'mains', 'snacks', 'desserts']
const EMOJIS = ['☕', '🍹', '🧋', '🍵', '🍊', '🥗', '🍞', '🦑', '🐟', '🥩', '🍄', '🍗', '🍔', '🍟', '🥜', '🍫', '🍋', '🍮', '🍕', '🥑', '🍣', '🍷', '🫖', '🌮']

const EMPTY_FORM = { name: '', description: '', price: '', category: 'mains' as Category, tag: '', emoji: '🍽️', available: true }

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className="toast" style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: ok ? '#1A1208' : '#7F1D1D',
      color: '#FDF6EC',
      padding: '14px 24px',
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {ok ? '✅' : '❌'} {msg}
    </div>
  )
}

interface Props {
  items: MenuItem[]
  onRefresh: () => void
}

export default function MenuManager({ items, onRefresh }: Props) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editId, setEditId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  function startEdit(item: MenuItem) {
    setForm({ name: item.name, description: item.description, price: String(item.price), category: item.category, tag: item.tag || '', emoji: item.emoji, available: item.available })
    setEditId(item.id)
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
    const body = { ...form, price: parseFloat(form.price), tag: form.tag || undefined }
    const url = editId ? `/api/menu/${editId}` : '/api/menu'
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      showToast(editId ? 'Item updated!' : 'Item added!')
      resetForm()
      onRefresh()
    } else {
      showToast('Something went wrong', false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
    setDeleting(null)
    if (res.ok) {
      showToast('Item deleted')
      onRefresh()
    } else {
      showToast('Delete failed', false)
    }
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--brand-dark)' }}>Menu Management</h2>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>{items.length} items · {items.filter(i => i.available).length} available</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: '32px', marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 24, color: 'var(--brand-dark)' }}>
            {editId ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Item Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Golden Latte" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Price (£) *</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="0.00" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="Describe the dish..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tag (optional)</label>
                <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Popular, New, Spicy…" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Emoji</label>
                <select value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={inputStyle}>
                  {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <input type="checkbox" id="available" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--brand-primary)' }} />
              <label htmlFor="available" style={{ fontSize: 14, color: 'var(--brand-dark)', cursor: 'pointer' }}>Available for ordering</label>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary">{editId ? 'Save Changes' : 'Add to Menu'}</button>
              <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c as Category | 'all')} style={{
            padding: '8px 18px', borderRadius: 50,
            background: filter === c ? 'var(--brand-dark)' : '#fff',
            color: filter === c ? '#FDF6EC' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            textTransform: 'capitalize',
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-mid))', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontSize: 48 }}>{item.emoji}</span>
              {item.tag && <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--brand-primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{item.tag}</span>}
              <span style={{ position: 'absolute', top: 8, left: 8, width: 10, height: 10, borderRadius: '50%', background: item.available ? '#22C55E' : '#EF4444' }} />
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--brand-dark)', flex: 1 }}>{item.name}</h4>
                <span style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: 15, marginLeft: 8 }}>£{Number(item.price).toFixed(2)}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--brand-muted)', lineHeight: 1.5, marginBottom: 12 }}>{item.description}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(item)} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: 'var(--brand-dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: deleting === item.id ? 0.5 : 1 }}>
                  {deleting === item.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-color)', fontSize: 14, color: 'var(--brand-dark)', background: '#FAFAF8' }
