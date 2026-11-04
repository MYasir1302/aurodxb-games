import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdPlaceholder from '@/components/common/AdPlaceholder';

export const metadata: Metadata = {
  metadataBase: new URL('https://aurodxb.com'),
  title: {
    default: 'AuroDXB Games | The Best Free Browser Car Games Portal',
    template: '%s | AuroDXB Games',
  },
  description:
    'Play 10 high-speed, action-packed car games directly in your browser. From Drift Master and Traffic Racer to Parking Master and Car Merge — 100% free with no downloads required!',
  keywords: [
    'car games',
    'free car games',
    'browser racing games',
    'drift games',
    'parking games',
    'stunt car games',
    'online car games',
    'AuroDXB Games',
    'Miniclip car games',
  ],
  authors: [{ name: 'AuroDXB Games', url: 'https://aurodxb.com' }],
  creator: 'AuroDXB Games',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aurodxb.com',
    siteName: 'AuroDXB Games',
    title: 'AuroDXB Games | Free Online Car Games Portal',
    description:
      'Play 10 original browser car games instantly. Racing, drifting, parking puzzles, stunt ramps, and car merge games!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuroDXB Games Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuroDXB Games | Free Browser Car Games',
    description: '10 playable online car games: Drift Master, Traffic Racer, Hill Climb, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-brand-dark text-gray-100 selection:bg-brand-cyan selection:text-brand-darker">
        <Navbar />

        {/* Top Header AdSense Slot */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <AdPlaceholder slot="header" />
        </div>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
