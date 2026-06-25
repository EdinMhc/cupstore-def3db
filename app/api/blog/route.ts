import { NextRequest, NextResponse } from 'next/server'
import { getDb, mapBlogPost, DbBlogPost } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC').all() as DbBlogPost[]
  return NextResponse.json(rows.map(mapBlogPost))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const id = uuidv4()

  const slug = (body.title as string)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)

  const db = getDb()
  db.prepare(`
    INSERT INTO blog_posts (id, title, slug, excerpt, content, author, published_at, cover_emoji, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.title,
    slug,
    body.excerpt ?? '',
    body.content ?? '',
    body.author || 'Cupstore Team',
    new Date().toISOString().split('T')[0],
    body.coverEmoji || '📝',
    body.published ? 1 : 0,
  )

  const row = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as DbBlogPost
  return NextResponse.json(mapBlogPost(row), { status: 201 })
}
