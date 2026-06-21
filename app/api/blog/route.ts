import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { getSession } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(store.getBlogPosts())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)

  const post = store.addBlogPost({
    title: body.title,
    slug,
    excerpt: body.excerpt,
    content: body.content,
    author: body.author || 'Cupstore Team',
    publishedAt: new Date().toISOString().split('T')[0],
    coverEmoji: body.coverEmoji || '📝',
    published: body.published ?? false,
  })
  return NextResponse.json(post, { status: 201 })
}
