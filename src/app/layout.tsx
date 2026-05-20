import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { MockStateProvider } from '@/lib/mock-state';
import { DebugDrawer } from '@/components/debug/DebugDrawer';
import { ViewportFrame } from '@/components/ViewportFrame';
import { InconsistentStateWarning } from '@/components/shared/InconsistentStateWarning';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Supercycl Mobile Launch Festival',
  description: 'TRADE DIFFERENT · RIDE THE SUPERCYCL — 1 month launch campaign',
  openGraph: {
    title: 'Supercycl Mobile Launch Festival',
    description: 'Trade $500 → 20 USDT · Complete survey → ICX. Limited 1-month event.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="absolute left-2 top-2 z-[100] -translate-y-20 rounded-md bg-mono-green px-3 py-2 text-bg transition focus:translate-y-0"
        >
          Skip to main content
        </a>
        <MockStateProvider>
          <InconsistentStateWarning />
          <ViewportFrame>{children}</ViewportFrame>
          <DebugDrawer />
        </MockStateProvider>
      </body>
    </html>
  );
}
