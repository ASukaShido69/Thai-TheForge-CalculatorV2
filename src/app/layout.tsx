import type { Metadata } from 'next';
import { Mali } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';
import { Analytics } from "@vercel/analytics/next"

const mali = Mali({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-mali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Forge Thailand | เดอะฟอร์จ ไทยแลนด์',
  description: 'เครื่องมือคำนวณการสร้างอาวุธและเกราะขั้นสูง สำหรับเกม The Forge - Advanced crafting calculator for The Forge game',
  keywords: ['The Forge', 'calculator', 'crafting', 'weapon', 'armor', 'ore', 'Thailand', 'forge calculator', 'ore calculator', 'rune calculator'],
  authors: [{ name: 'Subsomboon Leo' }],
  creator: 'Subsomboon Leo',
  publisher: 'The Forge Thailand',
  icons: {
    icon: [
      { url: '/web.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/web.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'The Forge Thailand | เดอะฟอร์จ ไทยแลนด์',
    description: 'เครื่องมือคำนวณการสร้างอาวุธและเกราะขั้นสูง สำหรับเกม The Forge - Advanced crafting calculator',
    type: 'website',
    locale: 'th_TH',
    alternateLocale: ['en_US'],
    siteName: 'The Forge Thailand',
    images: [
      {
        url: '/gamethumb.png',
        width: 1200,
        height: 630,
        alt: 'The Forge Thailand Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Forge Thailand | เดอะฟอร์จ ไทยแลนด์',
    description: 'เครื่องมือคำนวณการสร้างอาวุธและเกราะขั้นสูง',
    images: ['/gamethumb.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbbf24' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Forge TH',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${mali.variable} font-mali antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
