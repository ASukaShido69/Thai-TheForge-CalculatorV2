import type { Metadata } from 'next';
import { Prompt, Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-prompt',
  display: 'swap',
});

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Forge Thailand | เดอะฟอร์จ ไทยแลนด์',
  description: 'เครื่องมือคำนวณการสร้างอาวุธและเกราะขั้นสูง สำหรับเกม The Forge - Advanced crafting calculator for The Forge game',
  keywords: ['The Forge', 'calculator', 'crafting', 'weapon', 'armor', 'ore', 'Thailand'],
  authors: [{ name: 'Subsomboon Leo' }],
  creator: 'Subsomboon Leo',
  openGraph: {
    title: 'The Forge Thailand | เดอะฟอร์จ ไทยแลนด์',
    description: 'เครื่องมือคำนวณการสร้างอาวุธและเกราะขั้นสูง',
    type: 'website',
    locale: 'th_TH',
    alternateLocale: ['en_US'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${prompt.variable} ${inter.variable} font-thai antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
