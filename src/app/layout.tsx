import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Steam Game Tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="dark:bg-black dark:text-white">{children}</body>
    </html>
  )
}
