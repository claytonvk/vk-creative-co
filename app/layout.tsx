import React from "react"
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const _inter = Inter({ subsets: ["latin"] });
const _cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'VK Creative | Cinematic Photo & Video',
    template: '%s | VK Creative',
  },
  description: 'Cinematic photo and video for weddings, brands, and lifestyle. Creating timeless visual stories for engaged couples and local businesses in Los Angeles.',
  keywords: ['wedding photography', 'videography', 'Los Angeles photographer', 'cinematic video', 'brand photography', 'lifestyle photography', 'VK Creative'],
  authors: [{ name: 'VK Creative' }],
  creator: 'VK Creative',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'VK Creative',
    title: 'VK Creative | Cinematic Photo & Video',
    description: 'Cinematic photo and video for weddings, brands, and lifestyle. Creating timeless visual stories.',
    images: [
      {
        url: '/images/logo.png',
        alt: 'VK Creative',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VK Creative | Cinematic Photo & Video',
    description: 'Cinematic photo and video for weddings, brands, and lifestyle.',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
