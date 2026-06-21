'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { BlogPost } from '@/lib/store'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then((data: BlogPost[]) => {
        const published = data.filter(p => p.published)
        const found = published.find(p => p.slug === slug)
        if (found) {
          setPost(found)
          setAllPosts(published.filter(p => p.slug !== slug).slice(0, 2))
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--brand-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
        Loading article…
      </div>
    </div>
  )

  if (notFound || !post) return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--brand-dark)', marginBottom: 12 }}>Post Not Found</h2>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    </div>
  )

  const paragraphs = post.content.split('\n').filter(Boolean)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-light)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-warm) 100%)',
        padding: '100px 24px 60px',
        textAlign: 'center',
      }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(253,246,236,0.6)', fontSize: 14, marginBottom: 32 }}>
          ← Back to Blog
        </Link>
        <div style={{ fontSize: 72, marginBottom: 24 }}>{post.coverEmoji}</div>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#FDF6EC', lineHeight: 1.15, marginBottom: 20 }}>{post.title}</h1>
          <div style={{ color: 'rgba(253,246,236,0.55)', fontSize: 14 }}>
            By <strong style={{ color: 'var(--brand-primary)' }}>{post.author}</strong> · {post.publishedAt}
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, fontStyle: 'italic' }}>
          {post.excerpt}
        </p>
        <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 40 }} />
        {paragraphs.map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**')) {
            return <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--brand-dark)', margin: '32px 0 12px' }}>{para.replace(/\*\*/g, '')}</h3>
          }
          return (
            <p key={i} style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 20 }}>{para}</p>
          )
        })}
      </div>

      {/* More Articles */}
      {allPosts.length > 0 && (
        <div style={{ background: '#F7F2EB', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--brand-dark)', marginBottom: 32 }}>More from Cupstore</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {allPosts.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="card-hover" style={{
                  background: '#fff', borderRadius: 20, overflow: 'hidden',
                  border: '1px solid var(--border-color)', display: 'block',
                }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-mid))', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 56 }}>{p.coverEmoji}</span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.3, marginBottom: 10, color: 'var(--brand-dark)' }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--brand-muted)' }}>by {p.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
