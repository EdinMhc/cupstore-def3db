'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MenuItem, Category } from '@/lib/store'

const CATEGORIES: { key: Category | 'all'; label: string; emoji: string }[] = [
  { key: 'all',      label: 'All Items', emoji: '🍽️' },
  { key: 'drinks',   label: 'Drinks',    emoji: '☕'  },
  { key: 'starters', label: 'Starters',  emoji: '🥗'  },
  { key: 'mains',    label: 'Mains',     emoji: '🍽️' },
  { key: 'snacks',   label: 'Snacks',    emoji: '🍟'  },
  { key: 'desserts', label: 'Desserts',  emoji: '🍰'  },
]

function MenuCard({ item }: { item: MenuItem }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="card-hover"
      style={{
        background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer',
      }}
      onClick={() => setFlipped(f => !f)}
    >
      {/* Hero — image or emoji */}
      <div style={{ position: 'relative', height: 160, flexShrink: 0 }}>
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-mid) 100%)',
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 64 }}>{item.emoji}</span>
          </div>
        )}
        {/* Gradient overlay on images */}
        {item.imageUrl && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
        )}
        {item.tag && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: 'var(--brand-primary)', color: '#fff',
            fontSize: 11, fontWeight: 700, padding: '4px 10px',
            borderRadius: 20, letterSpacing: 0.5,
          }}>
            {item.tag}
          </span>
        )}
        {item.imageUrl && (
          <span style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 28 }}>{item.emoji}</span>
        )}
        {/* Ingredients hint */}
        {item.ingredients && item.ingredients.length > 0 && (
          <span style={{
            position: 'absolute', bottom: 10, right: 12,
            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
            background: 'rgba(0,0,0,0.35)', padding: '3px 8px', borderRadius: 20,
          }}>
            Tap for ingredients
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.2, color: 'var(--brand-dark)', flex: 1 }}>{item.name}</h3>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--brand-primary)', whiteSpace: 'nowrap' }}>
            £{Number(item.price).toFixed(2)}
          </span>
        </div>

        {/* Description / Ingredients toggle */}
        {!flipped ? (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>{item.description}</p>
        ) : (
          <div style={{ flex: 1 }}>
            {item.ingredients && item.ingredients.length > 0 ? (
              <>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-muted)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Ingredients</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.ingredients.map((ing, i) => (
                    <span key={i} style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 20,
                      background: ing.note ? 'rgba(239,68,68,0.07)' : 'rgba(200,169,110,0.1)',
                      border: `1px solid ${ing.note ? 'rgba(239,68,68,0.2)' : 'rgba(200,169,110,0.25)'}`,
                      color: 'var(--brand-dark)', fontWeight: 500,
                    }}>
                      {ing.name}{ing.note && <span style={{ color: '#DC2626', fontSize: 10 }}> · {ing.note}</span>}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--brand-muted)', fontStyle: 'italic' }}>No ingredients listed</p>
            )}
          </div>
        )}

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-muted)', textTransform: 'capitalize', letterSpacing: 0.3 }}>{item.category}</span>
          <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>● Available</span>
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
  }, [])

  const filtered = (activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)).filter(i => i.available)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-warm) 100%)',
        padding: '100px 24px 60px', textAlign: 'center',
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(253,246,236,0.6)', fontSize: 14, marginBottom: 32 }}>
          ← Back to Home
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 40 }}>☕</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 58px)', color: '#FDF6EC' }}>Our Menu</h1>
        </div>
        <p style={{ color: 'rgba(253,246,236,0.65)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
          Every dish crafted with care. Every ingredient chosen with purpose.
        </p>
        <p style={{ color: 'rgba(253,246,236,0.4)', fontSize: 13, marginTop: 12 }}>Tap a card to see ingredients</p>
      </div>

      {/* Sticky Category Filter */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
              padding: '16px 20px', background: 'none', border: 'none',
              borderBottom: activeCategory === cat.key ? '3px solid var(--brand-primary)' : '3px solid transparent',
              color: activeCategory === cat.key ? 'var(--brand-primary)' : 'var(--text-secondary)',
              fontWeight: activeCategory === cat.key ? 600 : 400,
              fontSize: 14, whiteSpace: 'nowrap', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}>
              <span>{cat.emoji}</span> {cat.label}
              {cat.key !== 'all' && (
                <span style={{ fontSize: 11, background: '#F5F0EA', color: 'var(--brand-muted)', borderRadius: 20, padding: '1px 6px', marginLeft: 2 }}>
                  {items.filter(i => i.category === cat.key && i.available).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--brand-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>☕</div>
            Loading menu…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--brand-muted)' }}>
            No items in this category right now.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </div>

      {/* QR Footer */}
      <div style={{ background: 'var(--brand-primary)', padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--brand-dark)', marginBottom: 8 }}>
          Scan · Browse · Enjoy
        </p>
        <p style={{ color: 'rgba(26,18,8,0.7)', fontSize: 14 }}>This menu is QR accessible — share it or scan from any table</p>
      </div>
    </div>
  )
}
