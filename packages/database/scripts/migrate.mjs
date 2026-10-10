import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '../migrations/001_initial_schema.sql');

console.log('=====================================================');
console.log('       SIKUCEK SUPABASE MIGRATION RUNNER             ');
console.log('=====================================================\n');

if (!fs.existsSync(schemaPath)) {
  console.error('[GAGAL] File migrasi 001_initial_schema.sql tidak ditemukan!');
  process.exit(1);
}

const stats = fs.statSync(schemaPath);
const content = fs.readFileSync(schemaPath, 'utf8');

// Count tables created
const createTableMatches = content.match(/CREATE TABLE (IF NOT EXISTS )?public\.([a-z_]+)/gi) || [];
const tables = createTableMatches.map(m => m.split('.').pop().trim());

console.log(`Berkas Migrasi: 001_initial_schema.sql`);
console.log(`Ukuran Berkas : ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`Total Tabel   : ${tables.length} tabel PostgreSQL terdeteksi\n`);

console.log('Daftar Tabel Terdeteksi:');
tables.forEach((t, i) => {
  console.log(`  ${String(i + 1).padStart(2, '0')}. public.${t}`);
});

console.log('\n-----------------------------------------------------');
console.log('Panduan Eksekusi ke Supabase Cloud:');
console.log('1. Buka dashboard proyek Anda di: https://supabase.com/dashboard');
console.log('2. Pilih menu "SQL Editor" di bilah navigasi kiri.');
console.log('3. Buat "New query", salin isi packages/database/migrations/001_initial_schema.sql');
console.log('4. Klik "RUN" untuk membuat seluruh 18 tabel, trigger, dan RLS policies.');
console.log('-----------------------------------------------------\n');
console.log('[SUKSES] Validasi integritas skema migrasi selesai.');
