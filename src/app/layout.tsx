import './globals.css';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { MockStateProvider } from '@/lib/mock-state';
import { DebugDrawer } from '@/components/debug/DebugDrawer';
import { ViewportFrame } from '@/components/ViewportFrame';
import { InconsistentStateWarning } from '@/components/shared/InconsistentStateWarning';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
  title: 'Supercycl Mobile Launch Event',
  description: 'TRADE DIFFERENT · RIDE THE SUPERCYCL — 1 month launch campaign',
  openGraph: {
    title: 'Supercycl Mobile Launch Event',
    description: 'Trade $500 → 20 USDT · Complete survey → ICX. Limited 1-month event.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="absolute left-2 top-2 z-[100] -translate-y-20 rounded-md bg-mono-green px-3 py-2 text-text-inverse transition focus:translate-y-0"
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
