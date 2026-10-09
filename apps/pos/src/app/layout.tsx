import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SiKucek POS - Kasir & Operator Laundry',
  description: 'Aplikasi Kasir & Operator Laundry Pintar SiKucek',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
