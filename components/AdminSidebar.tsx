'use client'
import Link from 'next/link'

type Tab = 'overview' | 'menu' | 'blog' | 'ads' | 'qr'

const NAV_ITEMS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'overview', label: 'Overview', emoji: '📊' },
  { key: 'menu', label: 'Menu', emoji: '🍽️' },
  { key: 'blog', label: 'Blog Posts', emoji: '📝' },
  { key: 'ads', label: 'Deals & Ads', emoji: '📣' },
  { key: 'qr', label: 'QR Code', emoji: '📱' },
]

interface Props {
  activeTab: Tab
  setTab: (t: Tab) => void
  onLogout: () => void
}

export default function AdminSidebar({ activeTab, setTab, onLogout }: Props) {
  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>☕</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--brand-primary)' }}>Cupstore</div>
            <div style={{ fontSize: 11, color: 'rgba(253,246,236,0.4)', marginTop: 1 }}>Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '24px 12px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.key} onClick={() => setTab(item.key)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            background: activeTab === item.key ? 'rgba(200,169,110,0.15)' : 'transparent',
            border: activeTab === item.key ? '1px solid rgba(200,169,110,0.2)' : '1px solid transparent',
            color: activeTab === item.key ? 'var(--brand-primary)' : 'rgba(253,246,236,0.6)',
            fontSize: 14,
            fontWeight: activeTab === item.key ? 600 : 400,
            marginBottom: 4,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 18 }}>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '24px 12px', borderTop: '1px solid rgba(200,169,110,0.1)' }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 16px', borderRadius: 10,
          color: 'rgba(253,246,236,0.5)', fontSize: 14,
          marginBottom: 8,
        }}>
          <span>🌐</span> View Site
        </Link>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '10px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#FCA5A5', fontSize: 14, cursor: 'pointer',
        }}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
