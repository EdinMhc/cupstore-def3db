'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MenuItem, BlogPost, Ad } from '@/lib/store'

const NAV_LINKS = [
  { label: 'Menu', href: '/menu' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setMenuItems)
    fetch('/api/blog').then(r => r.json()).then(d => setBlogPosts(d.filter((p: BlogPost) => p.published)))
    fetch('/api/ads').then(r => r.json()).then(d => setAds(d.filter((a: Ad) => a.active)))
  }, [])

  const popular = menuItems.filter(i => i.tag === 'Popular').slice(0, 4)
  const featured = blogPosts.slice(0, 3)
  const activeAds = ads.slice(0, 3)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(26,18,8,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(200,169,110,0.15)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>☕</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: 0.5 }}>Cupstore</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={{ color: '#FDF6EC', fontSize: 14, fontWeight: 500, opacity: 0.85, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}>
                {l.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/menu" className="btn-primary" style={{ fontSize: 14, padding: '10px 22px' }}>View Menu</Link>
            <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', color: '#FDF6EC', fontSize: 22, display: 'none' }} className="menu-btn">☰</button>
          </div>
        </div>

        {navOpen && (
          <div style={{ background: '#1A1208', borderTop: '1px solid rgba(200,169,110,0.1)', padding: '16px 24px 24px' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} onClick={() => setNavOpen(false)}
                style={{ display: 'block', color: '#FDF6EC', padding: '10px 0', fontSize: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .menu-btn { display: block !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1208 0%, #2E2010 50%, #3D2B1A 100%)',
        display: 'flex', alignItems: 'center',
        paddingTop: 72,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(200,169,110,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(200,169,110,0.06)', pointerEvents: 'none' }} />

        <div className="container" style={{ padding: '80px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div className="fade-up">
            <span className="section-label" style={{ color: 'var(--brand-primary)', marginBottom: 20, display: 'block' }}>Welcome to Cupstore</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5vw, 68px)', color: '#FDF6EC', lineHeight: 1.1, marginBottom: 24 }}>
              Where Every Bite<br />
              <em style={{ color: 'var(--brand-primary)' }}>Tells a Story</em>
            </h1>
            <p style={{ color: 'rgba(253,246,236,0.75)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 460 }}>
              Thoughtfully sourced ingredients, crafted with intention. Cupstore is your neighbourhood spot for exceptional food, signature drinks, and a table that always feels like home.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/menu" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Explore Menu</Link>
              <Link href="/blog" className="btn-ghost" style={{ fontSize: 16, padding: '14px 32px', borderColor: 'rgba(200,169,110,0.5)', color: 'var(--brand-primary)' }}>Read Our Blog</Link>
            </div>

            <div style={{ display: 'flex', gap: 40, marginTop: 56 }}>
              {[['5★', 'Google Rating'], ['12K+', 'Happy Guests'], ['3yr', 'Serving the City']].map(([val, lab]) => (
                <div key={lab}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--brand-primary)' }}>{val}</div>
                  <div style={{ color: 'rgba(253,246,236,0.55)', fontSize: 13, marginTop: 4 }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {(popular.length > 0 ? popular : [
              { id: '1', name: 'Golden Latte', emoji: '☕', description: 'Our signature', price: 6.5, tag: 'Popular' },
              { id: '2', name: 'Short Rib', emoji: '🥩', description: 'Chef\'s pick', price: 32, tag: 'Popular' },
              { id: '3', name: 'Choc Fondant', emoji: '🍫', description: 'Dessert', price: 11, tag: 'Popular' },
              { id: '4', name: 'Wagyu Burger', emoji: '🍔', description: 'House special', price: 26, tag: 'Popular' },
            ]).slice(0, 4).map((item, i) => (
              <div key={item.id} className="card-hover" style={{
                background: i % 2 === 0 ? 'rgba(200,169,110,0.12)' : 'rgba(253,246,236,0.06)',
                border: '1px solid rgba(200,169,110,0.2)',
                borderRadius: 20,
                padding: '28px 20px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{item.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', color: '#FDF6EC', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.name}</div>
                <div style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: 15 }}>£{Number(item.price).toFixed(2)}</div>
                {item.tag && <span style={{ display: 'inline-block', marginTop: 8, background: 'rgba(200,169,110,0.2)', color: 'var(--brand-accent)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, letterSpacing: 0.5 }}>{item.tag}</span>}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            section > .container { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── ADS / DEALS ── */}
      {activeAds.length > 0 && (
        <section style={{ background: '#F7F2EB', padding: '80px 0' }}>
          <div className="container">
            <div style={{ marginBottom: 48, textAlign: 'center' }}>
              <span className="section-label">Deals & Events</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', marginTop: 12, color: 'var(--brand-dark)' }}>Current Offers</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {activeAds.map(ad => (
                <div key={ad.id} className="card-hover" style={{
                  background: ad.bgColor,
                  color: ad.textColor,
                  borderRadius: 24,
                  padding: '36px 32px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  minHeight: 220,
                }}>
                  {ad.badge && (
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: ad.textColor, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1, width: 'fit-content', textTransform: 'uppercase' }}>
                      {ad.badge}
                    </span>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.2, color: ad.textColor }}>{ad.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.85, color: ad.textColor, flex: 1 }}>{ad.subtitle}</p>
                  <Link href="/menu" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.15)',
                    color: ad.textColor,
                    padding: '10px 20px',
                    borderRadius: 50,
                    fontSize: 13,
                    fontWeight: 600,
                    width: 'fit-content',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'background 0.2s',
                  }}>
                    {ad.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BLOG PREVIEW ── */}
      {featured.length > 0 && (
        <section style={{ background: 'var(--brand-light)', padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span className="section-label">From the Kitchen</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', marginTop: 12, color: 'var(--brand-dark)' }}>Stories & Recipes</h2>
              </div>
              <Link href="/blog" className="btn-ghost" style={{ fontSize: 14 }}>Read All Posts</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {featured.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover" style={{
                  background: '#fff',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  display: 'block',
                }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-warm))', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 64 }}>{post.coverEmoji}</span>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <p style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 10, fontWeight: 500 }}>{post.publishedAt} · {post.author}</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.3, marginBottom: 12, color: 'var(--brand-dark)' }}>{post.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <div style={{ marginTop: 20, color: 'var(--brand-primary)', fontWeight: 600, fontSize: 14 }}>Read More →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: 'var(--brand-dark)', padding: '100px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <span className="section-label" style={{ color: 'var(--brand-primary)', display: 'block', marginBottom: 16 }}>Our Story</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#FDF6EC', lineHeight: 1.15, marginBottom: 24 }}>
              Born from a Love of<br /><em style={{ color: 'var(--brand-primary)' }}>Good Food & Community</em>
            </h2>
            <p style={{ color: 'rgba(253,246,236,0.7)', fontSize: 17, lineHeight: 1.8, marginBottom: 20 }}>
              Cupstore opened its doors three years ago with a single belief: great food should be accessible, thoughtful, and shared. We built a space where you can linger over a coffee, celebrate a milestone, or simply hide from the rain with a warm bowl of something wonderful.
            </p>
            <p style={{ color: 'rgba(253,246,236,0.7)', fontSize: 17, lineHeight: 1.8 }}>
              Every item on our menu is chosen deliberately. Every supplier is a partner. Every guest is a regular waiting to happen.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { emoji: '🌿', title: 'Locally Sourced', desc: 'Every ingredient traced to a named producer within 60 miles.' },
              { emoji: '👨‍🍳', title: 'Expert Kitchen', desc: 'A brigade of passionate chefs with decades of combined experience.' },
              { emoji: '☕', title: 'Signature Drinks', desc: 'From our Golden Latte to cold brew tonics — drinks worth staying for.' },
              { emoji: '🏡', title: 'Cosy Atmosphere', desc: 'Designed to feel like a home away from home, every single day.' },
            ].map(card => (
              <div key={card.title} style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.15)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{card.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', color: '#FDF6EC', fontSize: 16, marginBottom: 8, fontWeight: 600 }}>{card.title}</div>
                <div style={{ color: 'rgba(253,246,236,0.6)', fontSize: 13, lineHeight: 1.6 }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #about > .container { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── QR CALLOUT ── */}
      <section style={{ background: 'var(--brand-primary)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontSize: 40 }}>📱</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--brand-dark)', marginTop: 16, marginBottom: 12 }}>Scan the Table QR Code</h2>
          <p style={{ color: 'rgba(26,18,8,0.75)', fontSize: 16, maxWidth: 480, margin: '0 auto 28px' }}>Sitting in? Scan the QR code on your table to browse the full menu right here on your phone.</p>
          <Link href="/menu" className="btn-primary" style={{ background: 'var(--brand-dark)', color: 'var(--brand-accent)', fontSize: 15 }}>Open Digital Menu</Link>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: '#F7F2EB', padding: '80px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <span className="section-label">Find Us</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, marginTop: 12, marginBottom: 20, color: 'var(--brand-dark)' }}>Come Visit</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>Whether it's your first time or you're practically a regular — we always have a table for you.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: '📍', label: 'Address', value: '42 Market Street, London EC1A 1BB' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Fri 7am–10pm · Sat–Sun 8am–11pm' },
                { icon: '📞', label: 'Phone', value: '+44 20 7000 0000' },
                { icon: '✉️', label: 'Email', value: 'hello@cupstore.co.uk' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: 'var(--brand-dark)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--brand-dark)', borderRadius: 24, padding: '40px 32px', color: '#FDF6EC' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8, color: '#FDF6EC' }}>Make a Reservation</h3>
            <p style={{ color: 'rgba(253,246,236,0.6)', fontSize: 14, marginBottom: 28 }}>Leave your details and we'll confirm your booking within the hour.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Your Name', 'Email Address', 'Phone Number', 'Preferred Date & Time'].map(placeholder => (
                <input key={placeholder} placeholder={placeholder} style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(200,169,110,0.2)',
                  borderRadius: 10, padding: '12px 16px', color: '#FDF6EC', fontSize: 14,
                  width: '100%',
                }} />
              ))}
              <textarea placeholder="Any special requests?" rows={3} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(200,169,110,0.2)',
                borderRadius: 10, padding: '12px 16px', color: '#FDF6EC', fontSize: 14,
                resize: 'vertical', width: '100%',
              }} />
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                Request Reservation
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #contact > .container { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0D0A05', padding: '48px 0 32px', borderTop: '1px solid rgba(200,169,110,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>☕</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--brand-primary)' }}>Cupstore</span>
            </div>
            <p style={{ color: 'rgba(253,246,236,0.4)', fontSize: 13 }}>© {new Date().getFullYear()} Cupstore. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[...NAV_LINKS, { label: 'Admin', href: '/admin' }].map(l => (
              <Link key={l.label} href={l.href} style={{ color: 'rgba(253,246,236,0.5)', fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,246,236,0.5)')}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
