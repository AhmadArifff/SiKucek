import { formatRupiah, formatIndonesianDateTime } from './formatters';

export interface WhatsAppOrderTemplateVariables {
  customerName: string;
  orderNumber: string;
  trackingCode: string;
  serviceSummary: string;
  finalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  estimatedReadyAt: string;
  rackLocation?: string | null;
  outletName?: string;
  baseUrl?: string;
}

/**
 * Generate standard WhatsApp message for newly received orders
 * Follows PRD Bab 10.6 & Antislop R-02 (No em dash)
 */
export function buildOrderReceivedMessage(vars: WhatsAppOrderTemplateVariables): string {
  const statusBayar = vars.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM LUNAS';
  const url = `${vars.baseUrl || 'https://sikucek.app'}/track/${vars.trackingCode}`;

  return `Halo Kak ${vars.customerName}! Terima kasih sudah mencuci di ${vars.outletName || 'SiKucek'}.\n\n` +
    `Nomor Pesanan: ${vars.orderNumber}\n` +
    `Layanan: ${vars.serviceSummary}\n` +
    `Total Tagihan: ${formatRupiah(vars.finalAmount)} (${statusBayar})\n` +
    `Estimasi Selesai: ${formatIndonesianDateTime(vars.estimatedReadyAt)}\n\n` +
    `Pantau proses cucian & foto kondisi pakaian Kakak di sini:\n` +
    `${url}\n\n` +
    `Si Kucek siap bikin pakaian Kakak wangi, bersih, dan kinclong!`;
}

/**
 * Generate standard WhatsApp message when an order is ready for pickup
 * Requires valid rackLocation (PRD Bab 10.5 & 10.6)
 */
export function buildOrderReadyMessage(vars: WhatsAppOrderTemplateVariables): string {
  const statusBayar = vars.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM LUNAS';
  const url = `${vars.baseUrl || 'https://sikucek.app'}/track/${vars.trackingCode}`;
  const rack = vars.rackLocation || 'Kasir SiKucek';

  return `Kabar gembira Kak ${vars.customerName}! Pakaian Kakak di ${vars.outletName || 'SiKucek'} sudah SELESAI, bersih, wangi, dan rapi dipacking.\n\n` +
    `Nomor Pesanan: ${vars.orderNumber}\n` +
    `Lokasi Pengambilan: ${rack}\n` +
    `Total Pembayaran: ${formatRupiah(vars.finalAmount)} (${statusBayar})\n\n` +
    `Silakan ambil pakaian Kakak di kasir dengan menyebutkan nomor rak di atas atau tunjukkan tautan nota ini:\n` +
    `${url}\n\n` +
    `Sampai jumpa di SiKucek!`;
}
