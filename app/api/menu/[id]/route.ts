import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const updated = store.updateMenuItem(params.id, {
    name: body.name,
    description: body.description,
    price: parseFloat(body.price),
    category: body.category,
    tag: body.tag || undefined,
    available: body.available,
    emoji: body.emoji,
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  store.deleteMenuItem(params.id)
  return NextResponse.json({ success: true })
}
