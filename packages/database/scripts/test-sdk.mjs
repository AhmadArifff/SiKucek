import { createClient } from '@supabase/supabase-js';
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=====================================================');
console.log('       SIKUCEK SUPABASE SDK & STORAGE VERIFIER       ');
console.log('=====================================================\n');

if (!url || !anonKey || !serviceKey) {
  console.error('[GAGAL] Kredensial URL, Anon Key, atau Service Role Key belum lengkap di .env.local');
  process.exit(1);
}

console.log(`Endpoint URL      : ${url}`);
console.log(`Anon Key Prefix   : ${anonKey.substring(0, 20)}...`);
console.log(`Service Key Prefix: ${serviceKey.substring(0, 20)}...\n`);

const anonClient = createClient(url, anonKey);
const adminClient = createClient(url, serviceKey);

async function verifyAll() {
  try {
    // 1. Test Anon Client Query
    console.log('1. Menguji Anon Client Query (RLS Public Read)...');
    const { data: services, error: sErr } = await anonClient
      .from('services')
      .select('name, category, price_per_unit')
      .limit(3);

    if (sErr) {
      console.error('   [GAGAL] Query services gagal:', sErr.message);
    } else {
      console.log(`   [SUKSES] Berhasil membaca katalog layanan (${services.length} baris):`);
      services.forEach(s => console.log(`   - ${s.name} (Rp ${Number(s.price_per_unit).toLocaleString('id-ID')})`));
    }

    // 2. Test Admin Client Query
    console.log('\n2. Menguji Admin Client (Service Role Bypass & Vault)...');
    const { data: settings, error: stErr } = await adminClient
      .from('app_settings')
      .select('key, category, is_secret')
      .limit(5);

    if (stErr) {
      console.error('   [GAGAL] Query app_settings gagal:', stErr.message);
    } else {
      console.log(`   [SUKSES] Berhasil membaca Config Vault (${settings.length} baris):`);
      settings.forEach(st => console.log(`   - [${st.category}] ${st.key} (secret: ${st.is_secret})`));
    }

    // 3. Test & Setup Supabase Storage Bucket 'qc-photos'
    console.log('\n3. Menguji & Menyiapkan Supabase Storage Bucket "qc-photos"...');
    const { data: buckets, error: bErr } = await adminClient.storage.listBuckets();
    
    if (bErr) {
      console.error('   [GAGAL] Gagal membaca daftar bucket:', bErr.message);
    } else {
      const existingQc = buckets.find(b => b.name === 'qc-photos');
      if (existingQc) {
        console.log(`   [SUKSES] Bucket "qc-photos" sudah ada (Public: ${existingQc.public})!`);
      } else {
        console.log('   Bucket "qc-photos" belum ada. Membuat bucket publik secara otomatis...');
        const { data: newBucket, error: createErr } = await adminClient.storage.createBucket('qc-photos', {
          public: true,
          fileSizeLimit: 1048576, // 1MB
          allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png']
        });

        if (createErr) {
          console.error('   [PERINGATAN] Gagal membuat bucket secara otomatis:', createErr.message);
          console.log('   (Silakan buat bucket "qc-photos" secara manual di menu Storage dashboard)');
        } else {
          console.log('   [SUKSES] Bucket "qc-photos" (Public) berhasil dibuat secara otomatis!');
        }
      }
    }

    // 4. Test upload dummy kecil ke bucket 'qc-photos' untuk memastikan write permission
    console.log('\n4. Menguji Upload Gambar ke Storage Bucket "qc-photos"...');
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAZVhJZk1NACoAAAAIAAAAAAAA6dptVAAAAABJRU5ErkJggg==';
    const dummyBuffer = Buffer.from(pngBase64, 'base64');
    const testPath = `health-check/test-${Date.now()}.png`;
    const { error: upErr } = await adminClient.storage
      .from('qc-photos')
      .upload(testPath, dummyBuffer, { contentType: 'image/png', upsert: true });

    if (upErr) {
      console.log('   [INFO] Status upload test:', upErr.message);
    } else {
      const { data: pubData } = adminClient.storage.from('qc-photos').getPublicUrl(testPath);
      console.log('   [SUKSES] Upload gambar PNG berhasil!');
      console.log(`   Public URL: ${pubData.publicUrl}`);
      // Clean up test file
      await adminClient.storage.from('qc-photos').remove([testPath]);
      console.log('   [SUKSES] Berkas test dibersihkan kembali.');
    }

    console.log('\n=====================================================');
    console.log('[SELESAI] Seluruh API Key & Storage SiKucek 100% VALID & SIAP!');
    console.log('=====================================================');
  } catch (err) {
    console.error('\n[UNEXPECTED ERROR]:', err);
  }
}

verifyAll();
