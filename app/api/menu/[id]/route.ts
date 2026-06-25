import { NextRequest, NextResponse } from 'next/server'
import { getDb, mapMenuItem, DbMenuItem } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = getDb()

  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(params.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  db.prepare(`
    UPDATE menu_items
    SET name = ?, description = ?, price = ?, category = ?, tag = ?,
        available = ?, emoji = ?, image_url = ?, ingredients = ?
    WHERE id = ?
  `).run(
    body.name,
    body.description ?? '',
    parseFloat(body.price) || 0,
    body.category ?? 'mains',
    body.tag || null,
    body.available !== false ? 1 : 0,
    body.emoji || '🍽️',
    body.imageUrl || null,
    JSON.stringify(body.ingredients ?? []),
    params.id,
  )

  const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(params.id) as DbMenuItem
  return NextResponse.json(mapMenuItem(row))
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  db.prepare('DELETE FROM menu_items WHERE id = ?').run(params.id)
  return NextResponse.json({ success: true })
}
