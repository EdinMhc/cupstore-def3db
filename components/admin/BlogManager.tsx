'use client'
import { useState } from 'react'
import type { BlogPost } from '@/lib/store'

const COVER_EMOJIS = ['☕', '🌿', '🌅', '📖', '🍽️', '🥗', '🍰', '🫖', '🍷', '🌸', '🏡', '✨', '📝', '🎉', '🍋', '🌾']

const EMPTY_FORM = { title: '', excerpt: '', content: '', author: 'Cupstore Team', coverEmoji: '📝', published: false }

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className="toast" style={{
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
  posts: BlogPost[]
  onRefresh: () => void
}

export default function BlogManager({ posts, onRefresh }: Props) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editId, setEditId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  function startEdit(post: BlogPost) {
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, author: post.author, coverEmoji: post.coverEmoji, published: post.published })
    setEditId(post.id)
    setShowForm(true)
    setPreview(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM })
    setEditId(null)
    setShowForm(false)
    setPreview(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = editId ? `/api/blog/${editId}` : '/api/blog'
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      showToast(editId ? 'Post updated!' : 'Post created!')
      resetForm()
      onRefresh()
    } else {
      showToast('Something went wrong', false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    setDeleting(null)
    if (res.ok) {
      showToast('Post deleted')
      onRefresh()
    } else {
      showToast('Delete failed', false)
    }
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch(`/api/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, published: !post.published }),
    })
    if (res.ok) {
      showToast(post.published ? 'Post unpublished' : 'Post published!')
      onRefresh()
    }
  }

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--brand-dark)' }}>Blog Management</h2>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>{posts.length} posts · {posts.filter(p => p.published).length} published</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm() }} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border-color)', padding: '32px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--brand-dark)' }}>
              {editId ? 'Edit Post' : 'Write New Post'}
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPreview(false)} style={{ padding: '7px 16px', borderRadius: 8, background: !preview ? 'var(--brand-dark)' : 'transparent', color: !preview ? '#FDF6EC' : 'var(--brand-muted)', border: '1px solid var(--border-color)', fontSize: 13, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => setPreview(true)} style={{ padding: '7px 16px', borderRadius: 8, background: preview ? 'var(--brand-dark)' : 'transparent', color: preview ? '#FDF6EC' : 'var(--brand-muted)', border: '1px solid var(--border-color)', fontSize: 13, cursor: 'pointer' }}>Preview</button>
            </div>
          </div>

          {preview ? (
            <div style={{ maxWidth: 680 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{form.coverEmoji}</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--brand-dark)', marginBottom: 8, lineHeight: 1.2 }}>{form.title || 'Untitled Post'}</h1>
              <p style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 24 }}>by {form.author}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 24 }}>{form.excerpt}</p>
              <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 24 }} />
              {form.content.split('\n').filter(Boolean).map((para, i) => (
                para.startsWith('**') && para.endsWith('**')
                  ? <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--brand-dark)', margin: '24px 0 8px' }}>{para.replace(/\*\*/g, '')}</h3>
                  : <p key={i} style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Post Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Your post title" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Author *</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} required placeholder="Author name" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Cover Emoji</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COVER_EMOJIS.map(em => (
                    <button key={em} type="button" onClick={() => setForm(f => ({ ...f, coverEmoji: em }))} style={{
                      fontSize: 24, padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
                      background: form.coverEmoji === em ? 'rgba(200,169,110,0.2)' : '#F7F2EB',
                      border: form.coverEmoji === em ? '2px solid var(--brand-primary)' : '2px solid transparent',
                    }}>{em}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Excerpt (shown on cards) *</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} required placeholder="A brief summary of the post..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Full Content *</label>
                <p style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 8 }}>Tip: Wrap a line in **double stars** to make it a heading.</p>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required placeholder="Write your full article here..." rows={14} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--brand-primary)' }} />
                <label htmlFor="published" style={{ fontSize: 14, color: 'var(--brand-dark)', cursor: 'pointer' }}>Publish immediately (visible on website)</label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary">{editId ? 'Save Changes' : 'Publish Post'}</button>
                <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--brand-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            No blog posts yet. Write your first post above!
          </div>
        )}
        {posts.map(post => (
          <div key={post.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border-color)', padding: '24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-mid))', borderRadius: 12, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 36 }}>
              {post.coverEmoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 12, flexWrap: 'wrap' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--brand-dark)', lineHeight: 1.2 }}>{post.title}</h4>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: post.published ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: post.published ? '#16A34A' : '#DC2626', whiteSpace: 'nowrap' }}>
                  {post.published ? '● Live' : '○ Draft'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--brand-muted)', marginBottom: 4 }}>by {post.author} · {post.publishedAt}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{post.excerpt}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              <button onClick={() => startEdit(post)} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', color: 'var(--brand-dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => togglePublish(post)} style={{ padding: '8px 16px', borderRadius: 8, background: post.published ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${post.published ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`, color: post.published ? '#DC2626' : '#16A34A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => handleDelete(post.id)} disabled={deleting === post.id} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: deleting === post.id ? 0.5 : 1 }}>
                {deleting === post.id ? '…' : 'Delete'}
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
