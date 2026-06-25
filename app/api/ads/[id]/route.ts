import { NextRequest, NextResponse } from 'next/server'
import { getDb, mapAd, DbAd } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = getDb()

  const existing = db.prepare('SELECT * FROM ads WHERE id = ?').get(params.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare(`
    UPDATE ads
    SET title = ?, subtitle = ?, cta = ?, badge = ?, bg_color = ?, text_color = ?, active = ?
    WHERE id = ?
  `).run(
    body.title,
    body.subtitle ?? '',
    body.cta ?? '',
    body.badge || null,
    body.bgColor || '#1A1208',
    body.textColor || '#FDF6EC',
    body.active !== false ? 1 : 0,
    params.id,
  )

  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(params.id) as DbAd
  return NextResponse.json(mapAd(row))
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  db.prepare('DELETE FROM ads WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}
