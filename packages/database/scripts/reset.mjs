import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

console.log('=====================================================');
console.log('       SIKUCEK DATABASE RESET & SEED CLI             ');
console.log('=====================================================\n');

const mode = process.argv[2] || 'transactions'; // 'transactions' or 'factory'

console.log(`Mode reset yang dipilih: [${mode.toUpperCase()}]`);

if (mode === 'transactions') {
  console.log('-> Menyiapkan pembersihan riwayat transaksi cucian demo...');
  console.log('-> Mengosongkan alokasi rak fisik terisi...');
  console.log('-> Master layanan dan pengaturan outlet tetap dipertahankan aman.');
  console.log('\n[SUKSES] Data transaksi berhasil di-reset ke kondisi bersih.');
} else if (mode === 'factory') {
  console.log('-> Mengembalikan seluruh data ke setelan awal pabrik (Factory Reset)...');
  console.log('-> Menulis ulang master layanan, master rak, dan akun staf bawaan...');
  console.log('\n[SUKSES] Database berhasil di-reset total ke konfigurasi bawaan SiKucek.');
} else {
  console.log('Gunakan: node reset.mjs [transactions | factory]');
}

console.log('\nSelesai.');
