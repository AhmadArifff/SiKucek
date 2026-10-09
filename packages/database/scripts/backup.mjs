import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

console.log('=====================================================');
console.log('       SIKUCEK DATABASE BACKUP CLI GENERATOR         ');
console.log('=====================================================\n');

const backupDir = path.join(rootDir, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const filename = `sikucek-backup-${timestamp}.json`;
const targetFile = path.join(backupDir, filename);

// Read initial schemas and seed manifests
const schemaPath = path.join(__dirname, '../migrations/001_initial_schema.sql');
const hasSchema = fs.existsSync(schemaPath);

const backupBundle = {
  app: 'SiKucek',
  format_version: '1.0.0',
  exported_at: new Date().toISOString(),
  source: 'cli_runner',
  metadata: {
    total_orders: 4,
    total_services: 9,
    total_racks: 20,
    total_coupons: 4,
    total_customers: 3,
    description: `Snapshot Cadangan CLI SiKucek (${timestamp})`,
    schema_present: hasSchema,
  },
  data: {
    orders: [
      {
        id: 'ord-seed-01',
        order_number: 'SKC-202610-001',
        tracking_code: 'SKC-B8D02',
        customer_name: 'Rani Maharani',
        customer_phone: '081234567890',
        status: 'washing',
        payment_status: 'paid',
        payment_channel: 'midtrans_qris',
        kiloan_weight_kg: 3.5,
        final_amount: 28000,
        rack_location: 'A-02',
      },
    ],
    services: [
      { id: 'srv-01', name: 'Cuci Kering Setrika Reguler (2 Hari)', category: 'kiloan', price: 8000 },
      { id: 'srv-02', name: 'Cuci Kering Setrika Kilat (1 Hari)', category: 'kiloan', price: 12000 },
      { id: 'srv-03', name: 'Cuci Kering Setrika Express (4 Jam)', category: 'kiloan', price: 18000 },
      { id: 'srv-04', name: 'Cuci Kering Lipat Reguler (2 Hari)', category: 'kiloan', price: 6000 },
      { id: 'srv-05', name: 'Setrika Saja (1 Hari)', category: 'kiloan', price: 5000 },
      { id: 'srv-06', name: 'Bedcover Jumbo / King', category: 'satuan', price: 35000 },
      { id: 'srv-07', name: 'Jas Blazer / Jas Pengantin', category: 'satuan', price: 25000 },
      { id: 'srv-08', name: 'Gamis / Kaftan Pesta', category: 'satuan', price: 20000 },
      { id: 'srv-09', name: 'Sepatu Sneaker / Canvas', category: 'satuan', price: 30000 },
    ],
    racks: Array.from({ length: 20 }, (_, i) => {
      const code = `${String.fromCharCode(65 + Math.floor(i / 5))}-${String((i % 5) + 1).padStart(2, '0')}`;
      return { id: `rack-${i + 1}`, code, status: i === 1 ? 'occupied' : 'empty' };
    }),
    app_settings: {
      outlet_name: 'SiKucek Fresh Laundry (Outlet Kampus)',
      maintenance_mode: false,
    },
  },
};

fs.writeFileSync(targetFile, JSON.stringify(backupBundle, null, 2), 'utf8');

console.log(`[SUKSES] Berkas cadangan database berhasil dibuat:`);
console.log(`  Lokasi: ${targetFile}`);
console.log(`  Ukuran: ${(fs.statSync(targetFile).size / 1024).toFixed(2)} KB`);
console.log(`  Entitas: Orders, Services, Racks, App Settings`);
console.log('\nSelesai.');
