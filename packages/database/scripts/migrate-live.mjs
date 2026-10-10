import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local if exists
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...vals] = trimmed.split('=');
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join('=').trim();
        }
      }
    }
  }
}

loadEnv();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

console.log('=====================================================');
console.log('       SIKUCEK LIVE SUPABASE SCHEMA MIGRATOR         ');
console.log('=====================================================\n');

if (!connectionString) {
  console.error('[GAGAL] DATABASE_URL atau DIRECT_URL tidak ditemukan di .env.local');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '../migrations/001_initial_schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('[GAGAL] File migrasi 001_initial_schema.sql tidak ditemukan!');
  process.exit(1);
}

const sqlContent = fs.readFileSync(schemaPath, 'utf8');

const maskedUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
console.log(`Target Host  : ${maskedUrl}`);
console.log(`Ukuran SQL   : ${(fs.statSync(schemaPath).size / 1024).toFixed(2)} KB\n`);

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

async function runMigration() {
  try {
    console.log('Menghubungkan ke Supabase Cloud PostgreSQL...');
    await client.connect();
    console.log('[SUKSES] Terhubung ke instance database.\n');

    console.log('Mengeksekusi skrip 001_initial_schema.sql...');
    const startTime = Date.now();
    await client.query(sqlContent);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[SUKSES] Seluruh skema DDL berhasil dieksekusi dalam ${duration} detik!\n`);

    // Verify created tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`Tabel yang terdaftar di schema public (${tablesRes.rowCount} tabel):`);
    tablesRes.rows.forEach((r, idx) => {
      console.log(`  ${String(idx + 1).padStart(2, '0')}. public.${r.table_name}`);
    });

    console.log('\n=====================================================');
    console.log('[SELESAI] Migrasi database SiKucek ke Supabase Cloud 100% SUKSES!');
    console.log('=====================================================');
  } catch (err) {
    console.error('\n[GAGAL EKSEKUSI MIGRASI]:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
