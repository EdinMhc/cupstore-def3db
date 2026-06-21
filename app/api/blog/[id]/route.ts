import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const updated = store.updateBlogPost(params.id, {
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    author: body.author,
    coverEmoji: body.coverEmoji,
    published: body.published,
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  store.deleteBlogPost(params.id)
  return NextResponse.json({ success: true })
}
