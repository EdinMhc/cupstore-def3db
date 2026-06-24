import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { getSession } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(store.getMenuItems())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const item = store.addMenuItem({
    name: body.name,
    description: body.description,
    price: parseFloat(body.price),
    category: body.category,
    tag: body.tag || undefined,
    available: body.available ?? true,
    emoji: body.emoji || '🍽️',
    imageUrl: body.imageUrl || undefined,
    ingredients: body.ingredients || [],
  })
  return NextResponse.json(item, { status: 201 })
}
