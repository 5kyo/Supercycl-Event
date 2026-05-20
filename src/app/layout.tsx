import './globals.css';

export const metadata = {
  title: 'Supercycl Mobile Launch Festival',
  description: 'TRADE DIFFERENT · RIDE THE SUPERCYCL — 1 month launch campaign',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
