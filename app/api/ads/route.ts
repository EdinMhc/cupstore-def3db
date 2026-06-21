import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { getSession } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(store.getAds())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const ad = store.addAd({
    title: body.title,
    subtitle: body.subtitle,
    cta: body.cta,
    badge: body.badge || undefined,
    bgColor: body.bgColor || '#1A1208',
    textColor: body.textColor || '#FDF6EC',
    active: body.active ?? true,
  })
  return NextResponse.json(ad, { status: 201 })
}
