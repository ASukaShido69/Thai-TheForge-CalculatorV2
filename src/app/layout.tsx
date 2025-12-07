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
  title: {
    default: 'The Forge Thailand - เครื่องมือคำนวณอาวุธ เกราะ แร่ และรูน',
    template: '%s | The Forge Thailand'
  },
  description: 'เครื่องมือคำนวณการสร้างอาวุธและเกราะแบบมืออาชีพ เพิ่มระบบตี + และรองรับระบบคำนวณแร่ (Ore) รูน (Rune) และ Traits ครบครัน พร้อม Multiplier Calculator สำหรับเกม The Forge | Advanced Weapon & Armor Crafting Calculator with Ore, Rune & Traits Systems',
  keywords: [
    'The Forge',
    'The Forge Thailand',
    'The Forge Calculator',
    'Ore Calculator',
    'Rune Calculator',
    'Weapon Calculator',
    'Armor Calculator',
    'Crafting Calculator',
    'เดอะฟอร์จ',
    'คำนวณแร่',
    'คำนวณรูน',
    'คำนวณอาวุธ',
    'คำนวณเกราะ',
    'forge game',
    'ore multiplier',
    'weapon forge',
    'armor forge',
    'rune traits',
    'Thailand'
  ],
  authors: [{ name: 'Subsomboon Leo' }],
  creator: 'Subsomboon Leo',
  publisher: 'The Forge Thailand Community',
  applicationName: 'The Forge Thailand Calculator',
  category: 'Gaming Tools',
  icons: {
    icon: [
      { url: './web.ico', sizes: 'any' },
      { url: './web.ico', type: 'image/x-icon' },
    ],
    shortcut: ['./web.ico'],
    apple: [
      { url: './web.ico', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: './web.ico',
      },
    ],
  },
  openGraph: {
    title: 'The Forge Thailand | เครื่องมือคำนวณการสร้างอาวุธและเกราะอัจฉริยะ',
    description: 'เครื่องมือคำนวณการผลิตอาวุธและเกราะแบบมืออาชีพ ที่พัฒนาโดยคนไทยผู้มีความตั้งใจสูง Subsomboon Leo เพื่อให้เหล่าผู้เล่นเกม The Forge ทุกคนสามารถวางแผนการคราฟต์ได้อย่างแม่นยำและมีประสิทธิภาพสูงสุด',
    type: 'website',
    locale: 'th_TH',
    alternateLocale: ['en_US'],
    siteName: 'The Forge Thailand',
    images: [
      {
        url: './gamethumb.png',
        width: 1200,
        height: 630,
        alt: 'The Forge Thailand - Advanced Weapon & Armor Calculator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Forge Thailand | เครื่องมือคำนวณอาวุธและเกราะอัจฉริยะ',
    description: 'คำนวณการสร้างอาวุธและเกราะแบบมืออาชีพ พร้อมระบบ Ore และ Rune Calculator',
    images: ['./gamethumb.png'],
    creator: '@TheForgeThailand',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbbf24' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Forge TH',
    startupImage: [
      {
        url: './gamethumb.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://thai-theforgecalculator.vercel.app',
    languages: {
      'th-TH': 'https://thai-theforgecalculator.vercel.app',
      'en-US': 'https://thai-theforgecalculator.vercel.app',
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
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
}
