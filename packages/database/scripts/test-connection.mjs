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
console.log('       SIKUCEK SUPABASE LIVE CONNECTION TEST        ');
console.log('=====================================================\n');

if (!connectionString) {
  console.error('[GAGAL] DATABASE_URL atau DIRECT_URL tidak ditemukan di .env.local');
  process.exit(1);
}

const maskedUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
console.log(`Connecting to: ${maskedUrl}`);

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function runTest() {
  try {
    await client.connect();
    console.log('[SUKSES] Berhasil terhubung ke Supabase PostgreSQL!');

    const res = await client.query('SELECT current_database(), version(), current_user;');
    console.log('\nInformasi Server Supabase:');
    console.log(`- Database    : ${res.rows[0].current_database}`);
    console.log(`- Current User: ${res.rows[0].current_user}`);
    console.log(`- PostgreSQL  : ${res.rows[0].version.split(' on ')[0]}`);

    // Check existing tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\nTabel yang ada di schema public (${tablesRes.rowCount} tabel):`);
    if (tablesRes.rowCount === 0) {
      console.log('  (Belum ada tabel. Database siap dimigrasi!)');
    } else {
      tablesRes.rows.forEach((r, idx) => {
        console.log(`  ${idx + 1}. public.${r.table_name}`);
      });
    }

    console.log('\n=====================================================');
    console.log('[SELESAI] Konektivitas database 100% valid dan siap pakai.');
    console.log('=====================================================');
  } catch (err) {
    console.error('\n[GAGAL TERKONEKSI]', err.message);
  } finally {
    await client.end();
  }
}

runTest();
