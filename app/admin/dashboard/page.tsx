'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MenuItem, BlogPost, Ad } from '@/lib/store'
import AdminSidebar from '@/components/AdminSidebar'
import MenuManager from '@/components/admin/MenuManager'
import BlogManager from '@/components/admin/BlogManager'
import AdsManager from '@/components/admin/AdsManager'
import QRGenerator from '@/components/admin/QRGenerator'

type Tab = 'overview' | 'menu' | 'blog' | 'ads' | 'qr'

export default function DashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchAll() {
    try {
      const [m, b, a] = await Promise.all([
        fetch('/api/menu').then(r => r.json()),
        fetch('/api/blog').then(r => r.json()),
        fetch('/api/ads').then(r => r.json()),
      ])
      setMenuItems(m)
      setBlogPosts(b)
      setAds(a)
    } catch {
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F2EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--brand-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>☕</div>
        Loading dashboard…
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activeTab={tab} setTab={setTab} onLogout={handleLogout} />

      <div className="admin-content" style={{ flex: 1, padding: '40px 32px', overflowY: 'auto' }}>
        {tab === 'overview' && (
          <OverviewTab
            menuItems={menuItems}
            blogPosts={blogPosts}
            ads={ads}
            setTab={setTab}
          />
        )}
        {tab === 'menu' && <MenuManager items={menuItems} onRefresh={fetchAll} />}
        {tab === 'blog' && <BlogManager posts={blogPosts} onRefresh={fetchAll} />}
        {tab === 'ads' && <AdsManager ads={ads} onRefresh={fetchAll} />}
        {tab === 'qr' && <QRGenerator />}
      </div>
    </div>
  )
}

function OverviewTab({ menuItems, blogPosts, ads, setTab }: {
  menuItems: MenuItem[]
  blogPosts: BlogPost[]
  ads: Ad[]
  setTab: (t: Tab) => void
}) {
  const stats = [
    { label: 'Menu Items', value: menuItems.length, sub: `${menuItems.filter(i => i.available).length} available`, emoji: '🍽️', tab: 'menu' as Tab },
    { label: 'Blog Posts', value: blogPosts.length, sub: `${blogPosts.filter(p => p.published).length} published`, emoji: '📝', tab: 'blog' as Tab },
    { label: 'Active Ads', value: ads.filter(a => a.active).length, sub: `${ads.length} total`, emoji: '📣', tab: 'ads' as Tab },
    { label: 'Categories', value: 5, sub: 'drinks · mains · more', emoji: '📂', tab: 'menu' as Tab },
  ]

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--brand-dark)', marginBottom: 8 }}>Good morning! ☀️</h1>
        <p style={{ color: 'var(--brand-muted)', fontSize: 15 }}>Here's what's happening at Cupstore today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(stat => (
          <button key={stat.label} onClick={() => setTab(stat.tab)} style={{
            background: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: 20,
            padding: '28px 24px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 4 }}>{stat.sub}</div>
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16, color: 'var(--brand-dark)' }}>Recent Menu Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {menuItems.slice(0, 5).map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F0EA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--brand-dark)' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--brand-muted)', textTransform: 'capitalize' }}>{item.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-primary)' }}>£{Number(item.price).toFixed(2)}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.available ? '#22C55E' : '#EF4444', display: 'inline-block' }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setTab('menu')} style={{ marginTop: 16, color: 'var(--brand-primary)', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Manage All Items →
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16, color: 'var(--brand-dark)' }}>Recent Blog Posts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {blogPosts.slice(0, 4).map(post => (
              <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #F5F0EA', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                  <span style={{ fontSize: 18 }}>{post.coverEmoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--brand-dark)', lineHeight: 1.3 }}>{post.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 3 }}>{post.publishedAt}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                  background: post.published ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: post.published ? '#16A34A' : '#DC2626',
                  whiteSpace: 'nowrap',
                }}>
                  {post.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setTab('blog')} style={{ marginTop: 16, color: 'var(--brand-primary)', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Manage All Posts →
          </button>
        </div>
      </div>

      {/* QR Shortcut */}
      <div style={{ marginTop: 20, background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-warm))', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#FDF6EC', marginBottom: 8 }}>Generate QR Code</h3>
          <p style={{ color: 'rgba(253,246,236,0.6)', fontSize: 14 }}>Create a scannable QR code for your restaurant tables pointing to the digital menu.</p>
        </div>
        <button onClick={() => setTab('qr')} className="btn-primary">Generate QR Code</button>
      </div>
    </div>
  )
}
