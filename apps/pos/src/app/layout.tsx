import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { AuthGuard } from '../components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'SiKucek POS - Kasir & Operator Laundry',
  description: 'Aplikasi Kasir & Operator Laundry Pintar SiKucek: Order Hybrid, QC Kamera, & Alokasi Rak',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-slate-100 text-slate-900">
        <AuthGuard>
          <Navbar />
          <main className="pb-12">{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}
