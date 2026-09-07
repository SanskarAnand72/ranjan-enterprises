import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'sonner';
import { getSettings } from '@/actions/settings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      template: `%s | ${settings.business_name || 'Ranjan Enterprises'}`,
      default: settings.seo_title || 'Ranjan Enterprises — Premium Wooden Works & Custom Woodwork',
    },
    description: settings.seo_description || 'Custom crafted premium wooden Woodwork, doors, windows, and luxury woodworking solutions.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: '/',
      siteName: settings.business_name || 'Ranjan Enterprises',
      images: [
        {
          url: settings.logo_url || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: settings.business_name || 'Ranjan Enterprises',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo_title || 'Ranjan Enterprises — Premium Wooden Works & Custom Woodwork',
      description: settings.seo_description || 'Custom crafted premium wooden Woodwork and woodworking.',
      images: [settings.logo_url || '/og-image.jpg'],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <QueryProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
