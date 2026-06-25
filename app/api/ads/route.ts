import { NextRequest, NextResponse } from 'next/server'
import { getDb, mapAd, DbAd } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM ads ORDER BY title').all() as DbAd[]
  return NextResponse.json(rows.map(mapAd))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const id = uuidv4()

  const db = getDb()
  db.prepare(`
    INSERT INTO ads (id, title, subtitle, cta, badge, bg_color, text_color, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.title,
    body.subtitle ?? '',
    body.cta ?? '',
    body.badge || null,
    body.bgColor || '#1A1208',
    body.textColor || '#FDF6EC',
    body.active !== false ? 1 : 0,
  )

  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(id) as DbAd
  return NextResponse.json(mapAd(row), { status: 201 })
}
