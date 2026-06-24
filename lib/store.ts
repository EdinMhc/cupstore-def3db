// In-memory store — replace with Postgres (DATABASE_URL) for production persistence
import { v4 as uuidv4 } from 'uuid'

export type Category = 'drinks' | 'mains' | 'starters' | 'desserts' | 'snacks'

export interface Ingredient {
  name: string
  note?: string  // e.g. "allergen", "optional", "vegan"
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: Category
  tag?: string          // e.g. "Popular", "New", "Spicy"
  available: boolean
  emoji: string
  imageUrl?: string     // uploaded image path or external URL
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

// ─── Seed Data ───────────────────────────────────────────────────────────────

const menuItems: MenuItem[] = [
  // Drinks
  {
    id: uuidv4(), name: 'Signature Golden Latte', description: 'Turmeric, oat milk, honey and a touch of cinnamon — our house specialty.',
    price: 6.5, category: 'drinks', tag: 'Popular', available: true, emoji: '☕',
    ingredients: [
      { name: 'Turmeric' }, { name: 'Oat Milk', note: 'vegan' }, { name: 'Wildflower Honey' }, { name: 'Cinnamon' },
    ],
  },
  {
    id: uuidv4(), name: 'Cold Brew Tonic', description: 'Slow-steeped 18-hour cold brew over sparkling tonic and a citrus twist.',
    price: 7.0, category: 'drinks', tag: 'New', available: true, emoji: '🧋',
    ingredients: [{ name: 'Cold Brew Coffee' }, { name: 'Sparkling Tonic' }, { name: 'Citrus Twist' }],
  },
  {
    id: uuidv4(), name: 'Berry Hibiscus Cooler', description: 'House-brewed hibiscus tea with muddled mixed berries and fresh mint.',
    price: 5.5, category: 'drinks', available: true, emoji: '🍹',
    ingredients: [{ name: 'Hibiscus Tea' }, { name: 'Mixed Berries' }, { name: 'Fresh Mint' }],
  },
  {
    id: uuidv4(), name: 'Matcha Ceremony', description: 'Ceremonial grade matcha whisked to perfection, served hot or iced.',
    price: 6.0, category: 'drinks', tag: 'Popular', available: true, emoji: '🍵',
    ingredients: [{ name: 'Ceremonial Matcha' }, { name: 'Oat Milk', note: 'vegan' }],
  },
  {
    id: uuidv4(), name: 'Vanilla Cloud Espresso', description: 'Double shot espresso with whipped vanilla cream and chocolate dust.',
    price: 7.5, category: 'drinks', available: true, emoji: '☕',
    ingredients: [{ name: 'Double Espresso' }, { name: 'Vanilla Cream', note: 'contains dairy' }, { name: 'Chocolate Dust' }],
  },
  {
    id: uuidv4(), name: 'Fresh Pressed Citrus', description: 'Seasonal oranges, grapefruit and a squeeze of lemon — pressed daily.',
    price: 5.0, category: 'drinks', available: true, emoji: '🍊',
    ingredients: [{ name: 'Fresh Orange' }, { name: 'Grapefruit' }, { name: 'Lemon' }],
  },
  // Starters
  {
    id: uuidv4(), name: 'Roasted Tomato Bruschetta', description: 'Slow-roasted vine tomatoes, whipped ricotta, basil oil on sourdough.',
    price: 9.0, category: 'starters', tag: 'Popular', available: true, emoji: '🍞',
    ingredients: [{ name: 'Vine Tomatoes' }, { name: 'Ricotta', note: 'contains dairy' }, { name: 'Basil Oil' }, { name: 'Sourdough', note: 'contains gluten' }],
  },
  {
    id: uuidv4(), name: 'Crispy Calamari', description: 'Lightly dusted squid rings, fried golden, with house aioli and lemon.',
    price: 12.0, category: 'starters', available: true, emoji: '🦑',
    ingredients: [{ name: 'Squid Rings' }, { name: 'House Aioli', note: 'contains egg' }, { name: 'Lemon' }],
  },
  {
    id: uuidv4(), name: 'Smoked Salmon Blinis', description: 'House-cured salmon, crème fraîche and dill on buckwheat blinis.',
    price: 13.5, category: 'starters', tag: 'New', available: true, emoji: '🐟',
    ingredients: [{ name: 'House-cured Salmon' }, { name: 'Crème Fraîche', note: 'contains dairy' }, { name: 'Fresh Dill' }, { name: 'Buckwheat Blinis', note: 'contains gluten' }],
  },
  // Mains
  {
    id: uuidv4(), name: 'Pan-Seared Sea Bass', description: 'Crispy skin sea bass, saffron risotto, wilted spinach and beurre blanc.',
    price: 28.0, category: 'mains', tag: "Chef's Pick", available: true, emoji: '🐟',
    ingredients: [{ name: 'Sea Bass Fillet' }, { name: 'Saffron Risotto', note: 'contains dairy' }, { name: 'Wilted Spinach' }, { name: 'Beurre Blanc', note: 'contains dairy' }],
  },
  {
    id: uuidv4(), name: 'Slow-Braised Short Rib', description: '12-hour braised beef rib, truffle mash, roasted carrots and jus.',
    price: 32.0, category: 'mains', tag: 'Popular', available: true, emoji: '🥩',
    ingredients: [{ name: 'Beef Short Rib' }, { name: 'Truffle Mash', note: 'contains dairy' }, { name: 'Roasted Carrots' }, { name: 'Red Wine Jus' }],
  },
  {
    id: uuidv4(), name: 'Wild Mushroom Risotto', description: 'Arborio rice with porcini, oyster and shiitake mushrooms, aged parmesan.',
    price: 22.0, category: 'mains', available: true, emoji: '🍄',
    ingredients: [{ name: 'Arborio Rice' }, { name: 'Porcini Mushrooms' }, { name: 'Oyster Mushrooms' }, { name: 'Shiitake Mushrooms' }, { name: 'Aged Parmesan', note: 'contains dairy' }],
  },
  {
    id: uuidv4(), name: 'Grilled Chicken Supreme', description: 'Free-range chicken, herb butter, roasted roots and rosemary jus.',
    price: 24.0, category: 'mains', available: true, emoji: '🍗',
    ingredients: [{ name: 'Free-range Chicken' }, { name: 'Herb Butter', note: 'contains dairy' }, { name: 'Roasted Root Vegetables' }, { name: 'Rosemary Jus' }],
  },
  {
    id: uuidv4(), name: 'Cupstore Wagyu Burger', description: 'Wagyu patty, aged cheddar, caramelised onions and house-made brioche.',
    price: 26.0, category: 'mains', tag: 'Popular', available: true, emoji: '🍔',
    ingredients: [{ name: 'Wagyu Beef Patty' }, { name: 'Aged Cheddar', note: 'contains dairy' }, { name: 'Caramelised Onions' }, { name: 'Brioche Bun', note: 'contains gluten' }],
  },
  // Snacks
  {
    id: uuidv4(), name: 'Truffle Parmesan Fries', description: 'Double-cooked fries tossed in truffle oil, parmesan and fresh herbs.',
    price: 8.0, category: 'snacks', tag: 'Popular', available: true, emoji: '🍟',
    ingredients: [{ name: 'Potato Fries' }, { name: 'Truffle Oil' }, { name: 'Parmesan', note: 'contains dairy' }, { name: 'Fresh Herbs' }],
  },
  {
    id: uuidv4(), name: 'Spiced Nuts Mix', description: 'House-roasted almonds, cashews and pecans with smoked paprika glaze.',
    price: 5.5, category: 'snacks', available: true, emoji: '🥜',
    ingredients: [{ name: 'Almonds', note: 'tree nut' }, { name: 'Cashews', note: 'tree nut' }, { name: 'Pecans', note: 'tree nut' }, { name: 'Smoked Paprika' }],
  },
  // Desserts
  {
    id: uuidv4(), name: 'Warm Chocolate Fondant', description: 'Dark Valrhona chocolate, molten centre, served with vanilla bean ice cream.',
    price: 11.0, category: 'desserts', tag: 'Popular', available: true, emoji: '🍫',
    ingredients: [{ name: 'Valrhona Dark Chocolate' }, { name: 'Salted Butter', note: 'contains dairy' }, { name: 'Eggs', note: 'contains egg' }, { name: 'Vanilla Ice Cream', note: 'contains dairy' }],
  },
  {
    id: uuidv4(), name: 'Lemon Tart Brûlée', description: 'Classic pâtisserie lemon curd tart with a torched crème brûlée top.',
    price: 9.5, category: 'desserts', tag: 'New', available: true, emoji: '🍋',
    ingredients: [{ name: 'Lemon Curd' }, { name: 'Tart Shell', note: 'contains gluten' }, { name: 'Eggs', note: 'contains egg' }, { name: 'Cream', note: 'contains dairy' }],
  },
  {
    id: uuidv4(), name: 'Seasonal Panna Cotta', description: 'Delicate vanilla panna cotta with a rotating seasonal fruit compote.',
    price: 8.5, category: 'desserts', available: true, emoji: '🍮',
    ingredients: [{ name: 'Double Cream', note: 'contains dairy' }, { name: 'Vanilla Bean' }, { name: 'Gelatin' }, { name: 'Seasonal Fruit Compote' }],
  },
]

const blogPosts: BlogPost[] = [
  {
    id: uuidv4(),
    title: 'The Story Behind Our Signature Golden Latte',
    slug: 'story-behind-golden-latte',
    excerpt: "What started as a late-night experiment in our kitchen became the drink that defines Cupstore. Here's how the Golden Latte was born.",
    content: `What started as a late-night experiment in our kitchen became the drink that defines Cupstore. Three years ago, our head barista Maya was closing up and decided to blend her grandmother's turmeric remedy with our single-origin oat milk. She added a drizzle of wildflower honey and a pinch of cinnamon — and something magical happened.

The next morning she made it for the team. Nobody said a word. They just kept drinking. By lunchtime, it was on the specials board. By the end of the week, regulars were asking for "that golden thing." A month later, it was officially the Signature Golden Latte.

We source our turmeric from a small farm in Kerala that's been growing the spice for four generations. The oat milk is made locally every two days. The honey comes from beehives just outside the city. Every sip is a small supply chain of people who care.

The Golden Latte isn't just our bestseller — it's become a bit of a ritual. We see people order it for first dates, job interviews, bad mornings, and celebrations. It's warm and grounding and a little bit celebratory all at once.

If you haven't tried it yet, come in and say "I'll have the golden one." We'll know exactly what you mean.`,
    author: 'Maya Chen',
    publishedAt: '2024-12-10',
    coverEmoji: '☕',
    published: true,
  },
  {
    id: uuidv4(),
    title: 'Why We Source Every Ingredient Locally (And Why It Matters)',
    slug: 'local-sourcing-philosophy',
    excerpt: 'From the farm to your fork — we break down our commitment to local suppliers and what it means for the quality of your meal.',
    content: `When Cupstore first opened, we made a promise: know every supplier by name. That rule still stands today, and we think it's the most important decision we ever made.

Our vegetables come from a family-run farm 40 minutes away. Our bread is baked three blocks down the road. Our meat is sourced from a butcher who has been working with the same regenerative ranch for over a decade. We visit each supplier at least twice a year.

Why does this matter? Because proximity creates accountability. When you can shake someone's hand and look them in the eye, you don't cut corners. You ask questions. You learn. You build something together.

It also means our menu changes. We don't serve tomatoes in December and we don't pretend asparagus is available in summer. Our kitchen works around the seasons, which keeps the cooking creative and the produce at its best.

The seasonal panna cotta you see on the menu right now? The fruit compote changes every two to three weeks based on what's at peak. Right now it's blood orange and rose. Last month it was fig and vanilla. Next month — we genuinely don't know yet.

That uncertainty is intentional. It keeps us present, keeps our suppliers engaged, and keeps you surprised.`,
    author: 'James Okoro',
    publishedAt: '2024-11-28',
    coverEmoji: '🌿',
    published: true,
  },
  {
    id: uuidv4(),
    title: 'A Weekend Morning at Cupstore: What to Order',
    slug: 'weekend-morning-guide',
    excerpt: "Saturday mornings deserve a ritual. Here's our staff's unofficial guide to building the perfect Cupstore weekend breakfast.",
    content: `Saturday morning at Cupstore is its own kind of magic. The light comes in through the east windows at 9am and hits the bar just right. The playlist is slower. The kitchen is in full swing.

If you're coming in on a weekend morning — here's what the team actually eats:

**Start with a drink, always.** The Berry Hibiscus Cooler if it's warm out — it's refreshing and sets a relaxed tone. The Matcha Ceremony if you want something grounding. Skip the espresso until after you've eaten; it hits harder on an empty stomach.

**For starters**, the Roasted Tomato Bruschetta is non-negotiable on a weekend. The tomatoes are slow-roasted overnight on Fridays so by Saturday morning they're deeply sweet and concentrated. The ricotta is made fresh.

**For mains**, weekends are for the Wagyu Burger. Yes, it's a burger, yes, it's 11am, and yes, it is absolutely worth it. The caramelised onions alone take 45 minutes. It is not a fast breakfast. Plan accordingly.

**Always end with the Warm Chocolate Fondant.** We know it's technically dessert. We don't care. Come in, take a table, and spend two hours eating slowly. That's what Saturday is for.

See you at the table.`,
    author: 'Cupstore Team',
    publishedAt: '2024-11-15',
    coverEmoji: '🌅',
    published: true,
  },
]

const ads: Ad[] = [
  {
    id: uuidv4(),
    title: 'Weekend Brunch Special',
    subtitle: 'Every Saturday & Sunday from 9am — any main + drink combo for just £28. Book your table before Friday.',
    cta: 'Reserve a Table',
    badge: 'Limited Spots',
    bgColor: '#1A1208',
    textColor: '#FDF6EC',
    active: true,
  },
  {
    id: uuidv4(),
    title: '20% Off Your First Visit',
    subtitle: 'First time at Cupstore? Show this card to your server and receive 20% off your entire bill. Welcome home.',
    cta: 'Show to Server',
    badge: 'New Guests',
    bgColor: '#C8A96E',
    textColor: '#1A1208',
    active: true,
  },
  {
    id: uuidv4(),
    title: 'Private Dining Available',
    subtitle: 'Hosting a celebration? Our private dining room seats up to 20 guests with a dedicated chef and sommelier.',
    cta: 'Enquire Now',
    badge: 'Events',
    bgColor: '#2E2010',
    textColor: '#E8C97A',
    active: true,
  },
]

// ─── Store Access ─────────────────────────────────────────────────────────────

let _menuItems = [...menuItems]
let _blogPosts = [...blogPosts]
let _ads = [...ads]

export const store = {
  // Menu
  getMenuItems: () => _menuItems,
  getMenuItemById: (id: string) => _menuItems.find(i => i.id === id),
  addMenuItem: (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: uuidv4() }
    _menuItems.push(newItem)
    return newItem
  },
  updateMenuItem: (id: string, data: Partial<MenuItem>) => {
    _menuItems = _menuItems.map(i => i.id === id ? { ...i, ...data } : i)
    return _menuItems.find(i => i.id === id)
  },
  deleteMenuItem: (id: string) => {
    _menuItems = _menuItems.filter(i => i.id !== id)
  },

  // Blog
  getBlogPosts: () => _blogPosts,
  getBlogPostById: (id: string) => _blogPosts.find(p => p.id === id),
  getBlogPostBySlug: (slug: string) => _blogPosts.find(p => p.slug === slug),
  addBlogPost: (post: Omit<BlogPost, 'id'>) => {
    const newPost = { ...post, id: uuidv4() }
    _blogPosts.push(newPost)
    return newPost
  },
  updateBlogPost: (id: string, data: Partial<BlogPost>) => {
    _blogPosts = _blogPosts.map(p => p.id === id ? { ...p, ...data } : p)
    return _blogPosts.find(p => p.id === id)
  },
  deleteBlogPost: (id: string) => {
    _blogPosts = _blogPosts.filter(p => p.id !== id)
  },

  // Ads
  getAds: () => _ads,
  getAdById: (id: string) => _ads.find(a => a.id === id),
  addAd: (ad: Omit<Ad, 'id'>) => {
    const newAd = { ...ad, id: uuidv4() }
    _ads.push(newAd)
    return newAd
  },
  updateAd: (id: string, data: Partial<Ad>) => {
    _ads = _ads.map(a => a.id === id ? { ...a, ...data } : a)
    return _ads.find(a => a.id === id)
  },
  deleteAd: (id: string) => {
    _ads = _ads.filter(a => a.id !== id)
  },
}
