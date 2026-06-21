import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cupstore — Restaurant & Café',
  description: 'Cupstore is a modern restaurant and café serving thoughtfully crafted food and drinks. View our full menu, discover our story, and find out about upcoming events.',
  keywords: 'Cupstore, restaurant, café, menu, food, drinks, dining',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
