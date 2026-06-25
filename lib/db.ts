/**
 * lib/db.ts
 * SQLite database via better-sqlite3.
 * The DB file is stored at /data/cupstore.db (mounted volume on Railway)
 * falling back to <project-root>/cupstore.db for local dev.
 *
 * All data that was previously in the in-memory store is seeded here on
 * first run (when the tables are empty).
 */

import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// ─── Resolve DB path ──────────────────────────────────────────────────────────
function getDbPath(): string {
  const volumePath = '/data'
  if (fs.existsSync(volumePath)) {
    return path.join(volumePath, 'cupstore.db')
  }
  return path.join(process.cwd(), 'cupstore.db')
}

// ─── Singleton ────────────────────────────────────────────────────────────────
let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(getDbPath())
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  migrate(_db)
  return _db
}

// ─── Migrations ───────────────────────────────────────────────────────────────
function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price       REAL NOT NULL DEFAULT 0,
      category    TEXT NOT NULL DEFAULT 'mains',
      tag         TEXT,
      available   INTEGER NOT NULL DEFAULT 1,
      emoji       TEXT NOT NULL DEFAULT '🍽️',
      image_url   TEXT,
      ingredients TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      slug         TEXT NOT NULL UNIQUE,
      excerpt      TEXT NOT NULL DEFAULT '',
      content      TEXT NOT NULL DEFAULT '',
      author       TEXT NOT NULL DEFAULT 'Cupstore Team',
      published_at TEXT NOT NULL,
      cover_emoji  TEXT NOT NULL DEFAULT '📝',
      published    INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ads (
      id         TEXT PRIMARY KEY,
      title      TEXT NOT NULL,
      subtitle   TEXT NOT NULL DEFAULT '',
      cta        TEXT NOT NULL DEFAULT '',
      badge      TEXT,
      bg_color   TEXT NOT NULL DEFAULT '#1A1208',
      text_color TEXT NOT NULL DEFAULT '#FDF6EC',
      active     INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS images (
      id           TEXT PRIMARY KEY,
      mime         TEXT NOT NULL,
      data         BLOB NOT NULL,
      created_at   TEXT NOT NULL
    );
  `)

  seedIfEmpty(db)
}

// ─── Seed data (only runs when tables are empty) ──────────────────────────────
function seedIfEmpty(db: Database.Database) {
  const count = (db.prepare('SELECT COUNT(*) as c FROM menu_items').get() as { c: number }).c
  if (count > 0) return

  // ── Menu items ──────────────────────────────────────────────────────────────
  const insertItem = db.prepare(`
    INSERT INTO menu_items (id, name, description, price, category, tag, available, emoji, image_url, ingredients)
    VALUES (@id, @name, @description, @price, @category, @tag, @available, @emoji, @imageUrl, @ingredients)
  `)

  const menuItems = [
    // Drinks
    { id: uuidv4(), name: 'Signature Golden Latte', description: 'Turmeric, oat milk, honey and a touch of cinnamon — our house specialty.', price: 6.5, category: 'drinks', tag: 'Popular', available: 1, emoji: '☕', imageUrl: null, ingredients: JSON.stringify([{ name: 'Turmeric' }, { name: 'Oat Milk', note: 'vegan' }, { name: 'Wildflower Honey' }, { name: 'Cinnamon' }]) },
    { id: uuidv4(), name: 'Cold Brew Tonic', description: 'Slow-steeped 18-hour cold brew over sparkling tonic and a citrus twist.', price: 7.0, category: 'drinks', tag: 'New', available: 1, emoji: '🧋', imageUrl: null, ingredients: JSON.stringify([{ name: 'Cold Brew Coffee' }, { name: 'Sparkling Tonic' }, { name: 'Citrus Twist' }]) },
    { id: uuidv4(), name: 'Berry Hibiscus Cooler', description: 'House-brewed hibiscus tea with muddled mixed berries and fresh mint.', price: 5.5, category: 'drinks', tag: null, available: 1, emoji: '🍹', imageUrl: null, ingredients: JSON.stringify([{ name: 'Hibiscus Tea' }, { name: 'Mixed Berries' }, { name: 'Fresh Mint' }]) },
    { id: uuidv4(), name: 'Matcha Ceremony', description: 'Ceremonial grade matcha whisked to perfection, served hot or iced.', price: 6.0, category: 'drinks', tag: 'Popular', available: 1, emoji: '🍵', imageUrl: null, ingredients: JSON.stringify([{ name: 'Ceremonial Matcha' }, { name: 'Oat Milk', note: 'vegan' }]) },
    { id: uuidv4(), name: 'Vanilla Cloud Espresso', description: 'Double shot espresso with whipped vanilla cream and chocolate dust.', price: 7.5, category: 'drinks', tag: null, available: 1, emoji: '☕', imageUrl: null, ingredients: JSON.stringify([{ name: 'Double Espresso' }, { name: 'Vanilla Cream', note: 'contains dairy' }, { name: 'Chocolate Dust' }]) },
    { id: uuidv4(), name: 'Fresh Pressed Citrus', description: 'Seasonal oranges, grapefruit and a squeeze of lemon — pressed daily.', price: 5.0, category: 'drinks', tag: null, available: 1, emoji: '🍊', imageUrl: null, ingredients: JSON.stringify([{ name: 'Fresh Orange' }, { name: 'Grapefruit' }, { name: 'Lemon' }]) },
    // Starters
    { id: uuidv4(), name: 'Roasted Tomato Bruschetta', description: 'Slow-roasted vine tomatoes, whipped ricotta, basil oil on sourdough.', price: 9.0, category: 'starters', tag: 'Popular', available: 1, emoji: '🍞', imageUrl: null, ingredients: JSON.stringify([{ name: 'Vine Tomatoes' }, { name: 'Ricotta', note: 'contains dairy' }, { name: 'Basil Oil' }, { name: 'Sourdough', note: 'contains gluten' }]) },
    { id: uuidv4(), name: 'Crispy Calamari', description: 'Lightly dusted squid rings, fried golden, with house aioli and lemon.', price: 12.0, category: 'starters', tag: null, available: 1, emoji: '🦑', imageUrl: null, ingredients: JSON.stringify([{ name: 'Squid Rings' }, { name: 'House Aioli', note: 'contains egg' }, { name: 'Lemon' }]) },
    { id: uuidv4(), name: 'Smoked Salmon Blinis', description: 'House-cured salmon, crème fraîche and dill on buckwheat blinis.', price: 13.5, category: 'starters', tag: 'New', available: 1, emoji: '🐟', imageUrl: null, ingredients: JSON.stringify([{ name: 'House-cured Salmon' }, { name: 'Crème Fraîche', note: 'contains dairy' }, { name: 'Fresh Dill' }, { name: 'Buckwheat Blinis', note: 'contains gluten' }]) },
    // Mains
    { id: uuidv4(), name: 'Pan-Seared Sea Bass', description: 'Crispy skin sea bass, saffron risotto, wilted spinach and beurre blanc.', price: 28.0, category: 'mains', tag: "Chef's Pick", available: 1, emoji: '🐟', imageUrl: null, ingredients: JSON.stringify([{ name: 'Sea Bass Fillet' }, { name: 'Saffron Risotto', note: 'contains dairy' }, { name: 'Wilted Spinach' }, { name: 'Beurre Blanc', note: 'contains dairy' }]) },
    { id: uuidv4(), name: 'Slow-Braised Short Rib', description: '12-hour braised beef rib, truffle mash, roasted carrots and jus.', price: 32.0, category: 'mains', tag: 'Popular', available: 1, emoji: '🥩', imageUrl: null, ingredients: JSON.stringify([{ name: 'Beef Short Rib' }, { name: 'Truffle Mash', note: 'contains dairy' }, { name: 'Roasted Carrots' }, { name: 'Red Wine Jus' }]) },
    { id: uuidv4(), name: 'Wild Mushroom Risotto', description: 'Arborio rice with porcini, oyster and shiitake mushrooms, aged parmesan.', price: 22.0, category: 'mains', tag: null, available: 1, emoji: '🍄', imageUrl: null, ingredients: JSON.stringify([{ name: 'Arborio Rice' }, { name: 'Porcini Mushrooms' }, { name: 'Oyster Mushrooms' }, { name: 'Shiitake Mushrooms' }, { name: 'Aged Parmesan', note: 'contains dairy' }]) },
    { id: uuidv4(), name: 'Grilled Chicken Supreme', description: 'Free-range chicken, herb butter, roasted roots and rosemary jus.', price: 24.0, category: 'mains', tag: null, available: 1, emoji: '🍗', imageUrl: null, ingredients: JSON.stringify([{ name: 'Free-range Chicken' }, { name: 'Herb Butter', note: 'contains dairy' }, { name: 'Roasted Root Vegetables' }, { name: 'Rosemary Jus' }]) },
    { id: uuidv4(), name: 'Cupstore Wagyu Burger', description: 'Wagyu patty, aged cheddar, caramelised onions and house-made brioche.', price: 26.0, category: 'mains', tag: 'Popular', available: 1, emoji: '🍔', imageUrl: null, ingredients: JSON.stringify([{ name: 'Wagyu Beef Patty' }, { name: 'Aged Cheddar', note: 'contains dairy' }, { name: 'Caramelised Onions' }, { name: 'Brioche Bun', note: 'contains gluten' }]) },
    // Snacks
    { id: uuidv4(), name: 'Truffle Parmesan Fries', description: 'Double-cooked fries tossed in truffle oil, parmesan and fresh herbs.', price: 8.0, category: 'snacks', tag: 'Popular', available: 1, emoji: '🍟', imageUrl: null, ingredients: JSON.stringify([{ name: 'Potato Fries' }, { name: 'Truffle Oil' }, { name: 'Parmesan', note: 'contains dairy' }, { name: 'Fresh Herbs' }]) },
    { id: uuidv4(), name: 'Spiced Nuts Mix', description: 'House-roasted almonds, cashews and pecans with smoked paprika glaze.', price: 5.5, category: 'snacks', tag: null, available: 1, emoji: '🥜', imageUrl: null, ingredients: JSON.stringify([{ name: 'Almonds', note: 'tree nut' }, { name: 'Cashews', note: 'tree nut' }, { name: 'Pecans', note: 'tree nut' }, { name: 'Smoked Paprika' }]) },
    // Desserts
    { id: uuidv4(), name: 'Warm Chocolate Fondant', description: 'Dark Valrhona chocolate, molten centre, served with vanilla bean ice cream.', price: 11.0, category: 'desserts', tag: 'Popular', available: 1, emoji: '🍫', imageUrl: null, ingredients: JSON.stringify([{ name: 'Valrhona Dark Chocolate' }, { name: 'Salted Butter', note: 'contains dairy' }, { name: 'Eggs', note: 'contains egg' }, { name: 'Vanilla Ice Cream', note: 'contains dairy' }]) },
    { id: uuidv4(), name: 'Lemon Tart Brûlée', description: 'Classic pâtisserie lemon curd tart with a torched crème brûlée top.', price: 9.5, category: 'desserts', tag: 'New', available: 1, emoji: '🍋', imageUrl: null, ingredients: JSON.stringify([{ name: 'Lemon Curd' }, { name: 'Tart Shell', note: 'contains gluten' }, { name: 'Eggs', note: 'contains egg' }, { name: 'Cream', note: 'contains dairy' }]) },
    { id: uuidv4(), name: 'Seasonal Panna Cotta', description: 'Delicate vanilla panna cotta with a rotating seasonal fruit compote.', price: 8.5, category: 'desserts', tag: null, available: 1, emoji: '🍮', imageUrl: null, ingredients: JSON.stringify([{ name: 'Double Cream', note: 'contains dairy' }, { name: 'Vanilla Bean' }, { name: 'Gelatin' }, { name: 'Seasonal Fruit Compote' }]) },
  ]

  const insertManyItems = db.transaction(() => {
    for (const item of menuItems) insertItem.run(item)
  })
  insertManyItems()

  // ── Blog posts ───────────────────────────────────────────────────────────────
  const insertPost = db.prepare(`
    INSERT INTO blog_posts (id, title, slug, excerpt, content, author, published_at, cover_emoji, published)
    VALUES (@id, @title, @slug, @excerpt, @content, @author, @publishedAt, @coverEmoji, @published)
  `)

  const blogPosts = [
    {
      id: uuidv4(),
      title: 'The Story Behind Our Signature Golden Latte',
      slug: 'story-behind-golden-latte',
      excerpt: "What started as a late-night experiment in our kitchen became the drink that defines Cupstore. Here's how the Golden Latte was born.",
      content: `What started as a late-night experiment in our kitchen became the drink that defines Cupstore. Three years ago, our head barista Maya was closing up and decided to blend her grandmother's turmeric remedy with our single-origin oat milk. She added a drizzle of wildflower honey and a pinch of cinnamon — and something magical happened.

The next morning she made it for the team. Nobody said a word. They just kept drinking. By lunchtime, it was on the specials board. By the end of the week, regulars were asking for "that golden thing." A month later, it was officially the Signature Golden Latte.

We source our turmeric from a small farm in Kerala that's been growing the spice for four generations. The oat milk is made locally every two days. The honey comes from beehives just outside the city. Every sip is a small supply chain of people who care.`,
      author: 'Maya Chen',
      publishedAt: '2024-12-10',
      coverEmoji: '☕',
      published: 1,
    },
    {
      id: uuidv4(),
      title: 'Why We Source Every Ingredient Locally (And Why It Matters)',
      slug: 'local-sourcing-philosophy',
      excerpt: 'From the farm to your fork — we break down our commitment to local suppliers and what it means for the quality of your meal.',
      content: `When Cupstore first opened, we made a promise: know every supplier by name. That rule still stands today, and we think it's the most important decision we ever made.

Our vegetables come from a family-run farm 40 minutes away. Our bread is baked three blocks down the road. Our meat is sourced from a butcher who has been working with the same regenerative ranch for over a decade. We visit each supplier at least twice a year.

Why does this matter? Because proximity creates accountability. When you can shake someone's hand and look them in the eye, you don't cut corners. You ask questions. You learn. You build something together.`,
      author: 'James Okoro',
      publishedAt: '2024-11-28',
      coverEmoji: '🌿',
      published: 1,
    },
    {
      id: uuidv4(),
      title: 'A Weekend Morning at Cupstore: What to Order',
      slug: 'weekend-morning-guide',
      excerpt: "Saturday mornings deserve a ritual. Here's our staff's unofficial guide to building the perfect Cupstore weekend breakfast.",
      content: `Saturday morning at Cupstore is its own kind of magic. The light comes in through the east windows at 9am and hits the bar just right. The playlist is slower. The kitchen is in full swing.

Start with a drink, always. The Berry Hibiscus Cooler if it's warm out. The Matcha Ceremony if you want something grounding. For mains, weekends are for the Wagyu Burger. Always end with the Warm Chocolate Fondant. Come in, take a table, and spend two hours eating slowly. That's what Saturday is for.`,
      author: 'Cupstore Team',
      publishedAt: '2024-11-15',
      coverEmoji: '🌅',
      published: 1,
    },
  ]

  const insertManyPosts = db.transaction(() => {
    for (const post of blogPosts) insertPost.run(post)
  })
  insertManyPosts()

  // ── Ads ──────────────────────────────────────────────────────────────────────
  const insertAd = db.prepare(`
    INSERT INTO ads (id, title, subtitle, cta, badge, bg_color, text_color, active)
    VALUES (@id, @title, @subtitle, @cta, @badge, @bgColor, @textColor, @active)
  `)

  const ads = [
    { id: uuidv4(), title: 'Weekend Brunch Special', subtitle: 'Every Saturday & Sunday from 9am — any main + drink combo for just £28. Book your table before Friday.', cta: 'Reserve a Table', badge: 'Limited Spots', bgColor: '#1A1208', textColor: '#FDF6EC', active: 1 },
    { id: uuidv4(), title: '20% Off Your First Visit', subtitle: 'First time at Cupstore? Show this card to your server and receive 20% off your entire bill. Welcome home.', cta: 'Show to Server', badge: 'New Guests', bgColor: '#C8A96E', textColor: '#1A1208', active: 1 },
    { id: uuidv4(), title: 'Private Dining Available', subtitle: 'Hosting a celebration? Our private dining room seats up to 20 guests with a dedicated chef and sommelier.', cta: 'Enquire Now', badge: 'Events', bgColor: '#2E2010', textColor: '#E8C97A', active: 1 },
  ]

  const insertManyAds = db.transaction(() => {
    for (const ad of ads) insertAd.run(ad)
  })
  insertManyAds()
}

// ─── Type helpers (mirror lib/store.ts types) ─────────────────────────────────
export interface DbMenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  tag: string | null
  available: number
  emoji: string
  image_url: string | null
  ingredients: string // JSON string
}

export interface DbBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  published_at: string
  cover_emoji: string
  published: number
}

export interface DbAd {
  id: string
  title: string
  subtitle: string
  cta: string
  badge: string | null
  bg_color: string
  text_color: string
  active: number
}

// ─── Row mappers (DB snake_case → app camelCase) ──────────────────────────────
export function mapMenuItem(row: DbMenuItem) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category as import('./store').Category,
    tag: row.tag ?? undefined,
    available: row.available === 1,
    emoji: row.emoji,
    imageUrl: row.image_url ?? undefined,
    ingredients: JSON.parse(row.ingredients) as import('./store').Ingredient[],
  }
}

export function mapBlogPost(row: DbBlogPost) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    publishedAt: row.published_at,
    coverEmoji: row.cover_emoji,
    published: row.published === 1,
  }
}

export function mapAd(row: DbAd) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    cta: row.cta,
    badge: row.badge ?? undefined,
    bgColor: row.bg_color,
    textColor: row.text_color,
    active: row.active === 1,
  }
}
