/**
 * lib/store.ts — shared TypeScript types only.
 * All data is now persisted in SQLite via lib/db.ts.
 */

export type Category = 'drinks' | 'mains' | 'starters' | 'desserts' | 'snacks'

export interface Ingredient {
  name: string
  note?: string // e.g. "allergen", "optional", "vegan"
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: Category
  tag?: string       // e.g. "Popular", "New", "Spicy"
  available: boolean
  emoji: string
  imageUrl?: string  // uploaded image path or external URL
  ingredients?: Ingredient[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  coverEmoji: string
  published: boolean
}

export interface Ad {
  id: string
  title: string
  subtitle: string
  cta: string
  badge?: string
  bgColor: string
  textColor: string
  active: boolean
}
