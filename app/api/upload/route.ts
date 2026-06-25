import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF or AVIF files are allowed' }, { status: 400 })
    }

    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large — maximum 5 MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const id = uuidv4()
    const db = getDb()
    db.prepare(
      'INSERT INTO images (id, mime, data, created_at) VALUES (?, ?, ?, ?)'
    ).run(id, file.type, buffer, new Date().toISOString())

    // Served back through /api/images/[id]
    return NextResponse.json({ url: `/api/images/${id}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
