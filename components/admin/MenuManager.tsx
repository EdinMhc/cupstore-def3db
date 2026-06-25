'use client'
import { useState, useRef } from 'react'
import type { MenuItem, Category, Ingredient } from '@/lib/store'

const CATEGORIES: Category[] = ['drinks', 'starters', 'mains', 'snacks', 'desserts']
const EMOJIS = ['☕','🍹','🧋','🍵','🍊','🥗','🍞','🦑','🐟','🥩','🍄','🍗','🍔','🍟','🥜','🍫','🍋','🍮','🍕','🥑','🍣','🍷','🫖','🌮','🥐','🧆','🫕','🍜','🥞','🧇','🫙','🧁','🍰','🥧']

const EMPTY_INGREDIENT: Ingredient = { name: '', note: '' }
const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'mains' as Category,
  tag: '', emoji: '🍽️', available: true, imageUrl: '', ingredients: [] as Ingredient[],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: ok ? '#1A1208' : '#7F1D1D',
      color: '#FDF6EC', padding: '14px 24px', borderRadius: 12,
      fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360,
      animation: 'fadeSlideUp 0.25s ease',
    }}>
      {ok ? '✅' : '❌'} {msg}
    </div>
  )
}

function ImageUploader({
  current, onUploaded,
}: {
  current: string
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Always derive the displayed preview from the `current` prop (controlled).
  // The parent form owns the truth; we just call onUploaded to update it.
  const preview = current

  async function handleFile(file: File) {
    setError('')
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Upload failed'); return }
      onUploaded(data.url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
      // reset input so the same file can be re-selected if needed
      e.target.value = ''
    }
  }

  return (
    <div>
      <label style={labelStyle}>Photo (optional)</label>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: '2px dashed var(--border-color)', borderRadius: 14, overflow: 'hidden',
          cursor: uploading ? 'wait' : 'pointer', position: 'relative',
          background: '#FAFAF8', transition: 'border-color 0.2s',
          minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand-primary)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
      >
        {uploading ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--brand-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Uploading…</div>
          </div>
        ) : preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={preview}
              style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>📷 Change Photo</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--brand-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)' }}>Click or drag to upload</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>JPEG, PNG, WebP · max 5 MB</div>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleChange} style={{ display: 'none' }} />
      </div>

      {/* Manual URL fallback */}
      <div style={{ marginTop: 8 }}>
        <input
          value={preview}
          onChange={e => onUploaded(e.target.value)}
          placeholder="…or paste an external image URL"
          style={{ ...inputStyle, fontSize: 12 }}
        />
      </div>
      {error && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  )
}

function IngredientsEditor({
  ingredients, onChange,
}: {
  ingredients: Ingredient[]
  onChange: (v: Ingredient[]) => void
}) {
  function add() {
    onChange([...ingredients, { ...EMPTY_INGREDIENT }])
  }
  function remove(i: number) {
    onChange(ingredients.filter((_, idx) => idx !== i))
  }
  function update(i: number, field: keyof Ingredient, value: string) {
    onChange(ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <label style={labelStyle}>Ingredients <span style={{ color: 'var(--brand-muted)', fontWeight: 400 }}>(optional)</span></label>
        <button type="button" onClick={add} style={{
          fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)',
          background: 'rgba(200,169,110,0.12)', border: '1px solid rgba(200,169,110,0.25)',
          borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
        }}>
          + Add
        </button>
      </div>

      {ingredients.length === 0 && (
        <div style={{
          border: '1.5px dashed var(--border-color)', borderRadius: 10, padding: '16px',
          textAlign: 'center', color: 'var(--brand-muted)', fontSize: 13,
        }}>
          No ingredients yet — click "+ Add" to list them
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ingredients.map((ing, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}>
            <input
              value={ing.name}
              onChange={e => update(i, 'name', e.target.value)}
              placeholder={`Ingredient ${i + 1}`}
              style={inputStyle}
            />
            <input
              value={ing.note || ''}
              onChange={e => update(i, 'note', e.target.value)}
              placeholder="Note (e.g. vegan, allergen)"
              style={{ ...inputStyle, fontSize: 12 }}
            />
            <button type="button" onClick={() => remove(i)} style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#DC2626', fontSize: 16, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Item Card ────────────────────────────────────────────────────────────────

function ItemCard({
  item, onEdit, onDelete, deleting,
}: {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
  deleting: boolean
}) {
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <div style={{
      background: '#fff', borderRadius: 18, border: '1px solid var(--border-color)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = '' }}
    >
      {/* Image / Emoji header */}
      <div style={{ position: 'relative', height: 130, flexShrink: 0 }}>
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-mid))', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 52 }}>{item.emoji}</span>
          </div>
        )}
        {/* Overlays */}
        {item.imageUrl && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
        )}
        <span style={{
          position: 'absolute', top: 8, left: 10,
          width: 10, height: 10, borderRadius: '50%',
          background: item.available ? '#22C55E' : '#EF4444',
          boxShadow: '0 0 0 2px rgba(255,255,255,0.8)',
        }} />
        {item.tag && (
          <span style={{
            position: 'absolute', top: 8, right: 10,
            background: 'var(--brand-primary)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
          }}>
            {item.tag}
          </span>
        )}
        {item.imageUrl && (
          <span style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 24 }}>{item.emoji}</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--brand-dark)', flex: 1, lineHeight: 1.3 }}>{item.name}</h4>
          <span style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: 15, marginLeft: 8, flexShrink: 0 }}>£{Number(item.price).toFixed(2)}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--brand-muted)', lineHeight: 1.5, flex: 1, marginBottom: 10 }}>
          {item.description.length > 80 ? item.description.slice(0, 80) + '…' : item.description}
        </p>

        {/* Ingredients preview */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {item.ingredients.slice(0, 4).map((ing, i) => (
              <span key={i} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 20,
                background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)',
                color: 'var(--brand-dark)', fontWeight: 500,
              }}>
                {ing.name}{ing.note ? ` · ${ing.note}` : ''}
              </span>
            ))}
            {item.ingredients.length > 4 && (
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#F0EDE8', color: 'var(--brand-muted)' }}>
                +{item.ingredients.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Category chip */}
        <div style={{ marginBottom: 12 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
            padding: '3px 10px', borderRadius: 20,
            background: '#F5F0EA', color: 'var(--brand-muted)',
          }}>
            {item.category}
          </span>
        </div>

        {/* Actions */}
        {!confirmDel ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onEdit} style={{
              flex: 1, padding: '9px', borderRadius: 9,
              background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)',
              color: 'var(--brand-dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,169,110,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,169,110,0.1)')}
            >
              ✏️ Edit
            </button>
            <button onClick={() => setConfirmDel(true)} style={{
              flex: 1, padding: '9px', borderRadius: 9,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              🗑 Delete
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onDelete} disabled={deleting} style={{
              flex: 1, padding: '9px', borderRadius: 9,
              background: '#DC2626', border: 'none',
              color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              opacity: deleting ? 0.6 : 1,
            }}>
              {deleting ? '…' : 'Confirm'}
            </button>
            <button onClick={() => setConfirmDel(false)} style={{
              flex: 1, padding: '9px', borderRadius: 9,
              background: '#F5F0EA', border: '1px solid var(--border-color)',
              color: 'var(--brand-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props { items: MenuItem[]; onRefresh: () => void }

export default function MenuManager({ items, onRefresh }: Props) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ingredients: [] as Ingredient[] })
  const [editId, setEditId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  function startEdit(item: MenuItem) {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      tag: item.tag || '',
      emoji: item.emoji,
      available: item.available,
      imageUrl: item.imageUrl || '',
      ingredients: item.ingredients ? item.ingredients.map(i => ({ ...i })) : [],
    })
    setEditId(item.id)
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function startAdd() {
    setForm({ ...EMPTY_FORM, ingredients: [] })
    setEditId(null)
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM, ingredients: [] })
    setEditId(null)
    setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const cleanIngredients = form.ingredients.filter(i => i.name.trim() !== '')
    const body = {
      ...form,
      price: parseFloat(form.price),
      tag: form.tag || undefined,
      imageUrl: form.imageUrl || undefined,
      ingredients: cleanIngredients,
    }
    const url = editId ? `/api/menu/${editId}` : '/api/menu'
    const method = editId ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) {
        showToast(editId ? '✅ Item updated!' : '✅ Item added!')
        resetForm()
        onRefresh()
      } else {
        showToast('Something went wrong', false)
      }
    } catch {
      showToast('Network error', false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (res.ok) { showToast('Item deleted'); onRefresh() }
      else showToast('Delete failed', false)
    } catch {
      showToast('Network error', false)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = items
    .filter(i => filter === 'all' || i.category === filter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))

  const availableCount = items.filter(i => i.available).length

  return (
    <div>
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--brand-dark)' }}>Menu Management</h2>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>
            {items.length} items · {availableCount} available · {items.length - availableCount} hidden
          </p>
        </div>
        <button onClick={showForm ? resetForm : startAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div ref={formRef} style={{
          background: '#fff', borderRadius: 20, border: '2px solid var(--brand-primary)',
          padding: '32px', marginBottom: 32,
          boxShadow: '0 8px 40px rgba(200,169,110,0.15)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 28, color: 'var(--brand-dark)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {editId ? '✏️ Edit Item' : '➕ Add New Item'}
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Row 1 — Name + Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Item Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required placeholder="e.g. Signature Golden Latte"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Price (£) *</label>
                <input
                  type="number" step="0.01" min="0"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  required placeholder="0.00" style={inputStyle}
                />
              </div>
            </div>

            {/* Row 2 — Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required placeholder="Describe the dish or drink…"
                rows={3} style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Row 3 — Category / Tag / Emoji */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tag <span style={{ fontWeight: 400, color: 'var(--brand-muted)' }}>(optional)</span></label>
                <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Popular, New, Spicy…" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Emoji</label>
                <select value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={inputStyle}>
                  {EMOJIS.map(em => <option key={em} value={em}>{em} {em}</option>)}
                </select>
              </div>
            </div>

            {/* Row 4 — Image uploader */}
            <div style={{ marginBottom: 16 }}>
              <ImageUploader
                current={form.imageUrl}
                onUploaded={url => setForm(f => ({ ...f, imageUrl: url }))}
              />
            </div>

            {/* Row 5 — Ingredients */}
            <div style={{ marginBottom: 20, background: '#FAFAF8', borderRadius: 14, padding: 20, border: '1px solid var(--border-color)' }}>
              <IngredientsEditor
                ingredients={form.ingredients}
                onChange={v => setForm(f => ({ ...f, ingredients: v }))}
              />
            </div>

            {/* Row 6 — Availability */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div
                onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                  background: form.available ? 'var(--brand-primary)' : '#D1D5DB',
                  position: 'relative', transition: 'background 0.25s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: form.available ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--brand-dark)', fontWeight: 500 }}>
                {form.available ? 'Available for ordering' : 'Hidden from menu'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1, minWidth: 140 }}>
                {saving ? '⏳ Saving…' : editId ? '💾 Save Changes' : '✅ Add to Menu'}
              </button>
              <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter + Search bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--brand-muted)' }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search menu items…"
            style={{ ...inputStyle, paddingLeft: 38 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', ...CATEGORIES] as const).map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '8px 16px', borderRadius: 50,
              background: filter === c ? 'var(--brand-dark)' : '#fff',
              color: filter === c ? '#FDF6EC' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              textTransform: 'capitalize', transition: 'all 0.15s',
            }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: 'var(--brand-muted)', marginBottom: 16 }}>
        Showing {filtered.length} of {items.length} items
        {search && ` · searching "${search}"`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff', borderRadius: 20, border: '1px dashed var(--border-color)',
          color: 'var(--brand-muted)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--brand-dark)' }}>No items found</p>
          <p style={{ fontSize: 14, marginTop: 6 }}>
            {search ? 'Try a different search term' : 'Add your first menu item above'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
          {filtered.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => startEdit(item)}
              onDelete={() => handleDelete(item.id)}
              deleting={deleting === item.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  border: '1px solid var(--border-color)', fontSize: 14,
  color: 'var(--brand-dark)', background: '#FAFAF8',
  outline: 'none', boxSizing: 'border-box',
}
