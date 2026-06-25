import { NextRequest, NextResponse } from 'next/server'
import { getDb, mapBlogPost, DbBlogPost } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = getDb()

  const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(params.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare(`
    UPDATE blog_posts
    SET title = ?, excerpt = ?, content = ?, author = ?, cover_emoji = ?, published = ?
    WHERE id = ?
  `).run(
    body.title,
    body.excerpt ?? '',
    body.content ?? '',
    body.author || 'Cupstore Team',
    body.coverEmoji || '📝',
    body.published ? 1 : 0,
    params.id,
  )

  const row = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(params.id) as DbBlogPost
  return NextResponse.json(mapBlogPost(row))
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}
