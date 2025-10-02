import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Oud & Perfume ERP',
    template: '%s | Oud & Perfume ERP',
  },
  description:
    'Comprehensive ERP system for managing perfume and oud business operations including inventory, sales, customers, and analytics.',
  keywords: [
    'ERP',
    'perfume',
    'oud',
    'inventory management',
    'sales tracking',
    'business management',
    'luxury fragrances',
  ],
  authors: [{ name: 'Oud & Perfume ERP Team' }],
  creator: 'Oud & Perfume ERP',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://oud-erp.onrender.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Oud & Perfume ERP',
    description:
      'Comprehensive ERP system for managing perfume and oud business operations',
    siteName: 'Oud & Perfume ERP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oud & Perfume ERP',
    description:
      'Comprehensive ERP system for managing perfume and oud business operations',
  },
  robots: {
    index: false, // Don't index in production
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}