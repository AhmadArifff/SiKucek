import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import MaintenanceBanner from '../components/MaintenanceBanner';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SiKucek - Solusi Laundry Pintar, Cepat, Higienis, dan Transparan',
  description: 'Portal Pelanggan & Pelacakan Publik Laundry Pintar SiKucek. Foto QC Anti-Sengketa, Stamp Card Digital, dan Notifikasi WhatsApp Otomatis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
        <MaintenanceBanner />
        {children}
      </body>
    </html>
  );
}
