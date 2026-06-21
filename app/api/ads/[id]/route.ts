import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const updated = store.updateAd(params.id, {
    title: body.title,
    subtitle: body.subtitle,
    cta: body.cta,
    badge: body.badge,
    bgColor: body.bgColor,
    textColor: body.textColor,
    active: body.active,
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  store.deleteAd(params.id)
  return NextResponse.json({ success: true })
}
