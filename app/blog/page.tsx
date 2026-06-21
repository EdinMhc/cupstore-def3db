'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/store'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => {
        setPosts(data.filter((p: BlogPost) => p.published))
        setLoading(false)
      })
  }, [])

  const [featured, ...rest] = posts

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-warm) 100%)',
        padding: '100px 24px 60px',
        textAlign: 'center',
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(253,246,236,0.6)', fontSize: 14, marginBottom: 32 }}>
          ← Back to Home
        </Link>
        <span className="section-label" style={{ color: 'var(--brand-primary)', display: 'block', marginBottom: 16 }}>From the Kitchen</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 58px)', color: '#FDF6EC' }}>Stories & Recipes</h1>
        <p style={{ color: 'rgba(253,246,236,0.65)', fontSize: 17, maxWidth: 500, margin: '24px auto 0' }}>
          Behind every dish is a story worth telling. This is where we tell them.
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--brand-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
            Loading posts…
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--brand-muted)' }}>
            No blog posts yet. Check back soon!
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} style={{ display: 'block', marginBottom: 48 }}>
                <div className="card-hover" style={{
                  background: '#fff',
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '380px 1fr',
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-warm))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: 280,
                  }}>
                    <span style={{ fontSize: 96 }}>{featured.coverEmoji}</span>
                  </div>
                  <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span className="badge badge-gold" style={{ marginBottom: 16, width: 'fit-content' }}>Featured Story</span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.2, marginBottom: 16, color: 'var(--brand-dark)' }}>{featured.title}</h2>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{featured.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--brand-muted)' }}>{featured.publishedAt} · by {featured.author}</span>
                      <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Read Full Story →</span>
                    </div>
                  </div>
                </div>
                <style>{`@media(max-width:768px){.card-hover > div:first-child{grid-template-columns:1fr !important}}`}</style>
              </Link>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {rest.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover" style={{
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    display: 'block',
                  }}>
                    <div style={{ background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-mid))', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 64 }}>{post.coverEmoji}</span>
                    </div>
                    <div style={{ padding: 24 }}>
                      <p style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 10, fontWeight: 500 }}>{post.publishedAt} · {post.author}</p>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.3, marginBottom: 12, color: 'var(--brand-dark)' }}>{post.title}</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.excerpt}</p>
                      <div style={{ marginTop: 20, color: 'var(--brand-primary)', fontWeight: 600, fontSize: 14 }}>Read More →</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
