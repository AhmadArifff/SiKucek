import type { Metadata } from 'next';
import './globals.css';
import MaintenanceBanner from '../components/MaintenanceBanner';

export const metadata: Metadata = {
  title: 'SiKucek - Solusi Laundry Pintar, Cepat, dan Higienis',
  description: 'Portal Pelanggan & Pelacakan Publik Laundry SiKucek',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-sky-50/50 text-slate-900">
        <MaintenanceBanner />
        {children}
      </body>
    </html>
  );
}
