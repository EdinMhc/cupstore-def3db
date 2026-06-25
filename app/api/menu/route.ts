import { NextRequest, NextResponse } from 'next/server'
import { getDb, mapMenuItem, DbMenuItem } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM menu_items ORDER BY category, name').all() as DbMenuItem[]
  return NextResponse.json(rows.map(mapMenuItem))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const id = uuidv4()

  const db = getDb()
  db.prepare(`
    INSERT INTO menu_items (id, name, description, price, category, tag, available, emoji, image_url, ingredients)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.name,
    body.description ?? '',
    parseFloat(body.price) || 0,
    body.category ?? 'mains',
    body.tag || null,
    body.available !== false ? 1 : 0,
    body.emoji || '🍽️',
    body.imageUrl || null,
    JSON.stringify(body.ingredients ?? []),
  )

  const row = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id) as DbMenuItem
  return NextResponse.json(mapMenuItem(row), { status: 201 })
}
