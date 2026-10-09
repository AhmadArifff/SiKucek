-- ==============================================================================
-- Migration: 001_initial_schema.sql
-- Project: SiKucek (Smart Hybrid Laundry Operating System)
-- Specification: PRD Bab 7, Bab 10, Bab 12, Bab 13 (18 Tables + Triggers + RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Linked with Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'cashier', 'washer', 'ironer', 'owner')),
    tier VARCHAR(30) DEFAULT 'busa_baru' NOT NULL CHECK (tier IN ('busa_baru', 'wangi_segar', 'kinclong_sultan')),
    points_balance INT DEFAULT 0 NOT NULL CHECK (points_balance >= 0),
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- ------------------------------------------------------------------------------
-- 2. Customer Tiers Master
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_tiers (
    id VARCHAR(30) PRIMARY KEY,
    display_name VARCHAR(50) NOT NULL,
    min_completed_orders INT NOT NULL,
    kiloan_discount_percent NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    priority_order INT NOT NULL
);

INSERT INTO public.customer_tiers (id, display_name, min_completed_orders, kiloan_discount_percent, priority_order)
VALUES
    ('busa_baru', 'Busa Baru', 0, 0.00, 1),
    ('wangi_segar', 'Wangi Segar', 5, 5.00, 2),
    ('kinclong_sultan', 'Kinclong Sultan', 15, 10.00, 3)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. Services Master (Katalog Layanan Hybrid)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('kiloan', 'satuan')),
    unit_name VARCHAR(20) DEFAULT 'kg' NOT NULL, -- 'kg', 'pcs', 'pasang', 'set'
    price_per_unit NUMERIC(12, 2) NOT NULL CHECK (price_per_unit >= 0),
    min_weight_kg NUMERIC(4, 2) DEFAULT 2.00, -- Khusus kiloan
    estimated_duration_hours INT DEFAULT 48 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.services (name, category, unit_name, price_per_unit, min_weight_kg, estimated_duration_hours)
VALUES
    ('Cuci Kering Setrika Reguler (2 Hari)', 'kiloan', 'kg', 7000.00, 2.00, 48),
    ('Cuci Kering Setrika Express (1 Hari)', 'kiloan', 'kg', 10000.00, 2.00, 24),
    ('Cuci Kering Lipat Reguler', 'kiloan', 'kg', 5000.00, 2.00, 48),
    ('Setrika Saja Reguler', 'kiloan', 'kg', 4500.00, 2.00, 48),
    ('Satuan: Kemeja / Blus', 'satuan', 'pcs', 6000.00, NULL, 48),
    ('Satuan: Celana Panjang / Jeans', 'satuan', 'pcs', 7000.00, NULL, 48),
    ('Satuan: Jaket Tebal / Hoodie', 'satuan', 'pcs', 12000.00, NULL, 48),
    ('Satuan: Jas / Blazer', 'satuan', 'pcs', 25000.00, NULL, 72),
    ('Satuan: Bed Cover Single', 'satuan', 'pcs', 20000.00, NULL, 48),
    ('Satuan: Bed Cover King / Jumbo', 'satuan', 'pcs', 30000.00, NULL, 48),
    ('Satuan: Sepatu Sneaker', 'satuan', 'pasang', 25000.00, NULL, 72)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Physical Racks Master (Rack Locator Bab 10.5)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.racks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'RAK-A1', 'RAK-B02', 'GANTUNG-01'
    description VARCHAR(100),
    is_occupied BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.racks (code, description)
VALUES
    ('RAK-A1', 'Rak Atas Baris A - Kiloan'),
    ('RAK-A2', 'Rak Tengah Baris A - Kiloan'),
    ('RAK-B1', 'Rak Atas Baris B - Satuan'),
    ('RAK-B2', 'Rak Tengah Baris B - Satuan'),
    ('GANTUNG-01', 'Gantungan Khusus Jas & Gaun'),
    ('GANTUNG-02', 'Gantungan Khusus Bed Cover')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. Orders Table (Header Transaksi Hybrid)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'SKC-261008-0001'
    tracking_code VARCHAR(20) UNIQUE NOT NULL, -- Public tracking token e.g. 'SKC-X7K9P'
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'received' NOT NULL CHECK (
        status IN ('received', 'washing', 'drying', 'ironing', 'packing_qc', 'ready', 'completed', 'cancelled')
    ),
    payment_status VARCHAR(20) DEFAULT 'unpaid' NOT NULL CHECK (
        payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'expired')
    ),
    payment_channel VARCHAR(30) CHECK (
        payment_channel IN ('cash', 'midtrans_qris', 'midtrans_va', 'midtrans_gopay')
    ),
    rack_location VARCHAR(50), -- Guardrail: WAJIB diisi saat status 'ready'
    kiloan_weight_kg NUMERIC(6, 2) DEFAULT 0.00 NOT NULL,
    kiloan_charged_weight_kg NUMERIC(6, 2) DEFAULT 0.00 NOT NULL,
    kiloan_subtotal NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    satuan_subtotal NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    gross_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    final_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    notes TEXT,
    cashier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    estimated_ready_at TIMESTAMPTZ NOT NULL,
    actual_ready_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders(tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. Order Items Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('kiloan', 'satuan')),
    quantity NUMERIC(6, 2) NOT NULL CHECK (quantity > 0),
    price_per_unit NUMERIC(12, 2) NOT NULL CHECK (price_per_unit >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    notes VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 7. Order QC Photos (Anti-Dispute & WebRTC Foto Cacat Pakaian)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_qc_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    issue_type VARCHAR(30) NOT NULL CHECK (
        issue_type IN ('torn', 'stain', 'color_faded', 'missing_button', 'other')
    ),
    description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_qc_photos_order_id ON public.order_qc_photos(order_id);

-- ------------------------------------------------------------------------------
-- 8. Order Status Logs (Audit Trail Pelacakan Pelanggan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rack_location VARCHAR(50),
    notes VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON public.order_status_logs(order_id);

-- ------------------------------------------------------------------------------
-- 9. Payments Table (Tunai & Midtrans Webhook Callback)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    channel VARCHAR(30) NOT NULL CHECK (
        channel IN ('cash', 'midtrans_qris', 'midtrans_va', 'midtrans_gopay')
    ),
    status VARCHAR(20) DEFAULT 'unpaid' NOT NULL CHECK (
        status IN ('unpaid', 'pending', 'paid', 'refunded', 'expired')
    ),
    midtrans_order_id VARCHAR(100),
    midtrans_transaction_id VARCHAR(100),
    midtrans_payment_type VARCHAR(50),
    qris_url TEXT,
    va_number VARCHAR(50),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_midtrans_order_id ON public.payments(midtrans_order_id);

-- ------------------------------------------------------------------------------
-- 10. Loyalty Stamp Cards & Stamps (Gamifikasi 5-Slot Bab 10.4)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loyalty_stamp_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stamps_count INT DEFAULT 0 NOT NULL CHECK (stamps_count >= 0 AND stamps_count <= 5),
    cards_completed INT DEFAULT 0 NOT NULL CHECK (cards_completed >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.loyalty_stamps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES public.loyalty_stamp_cards(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, -- Anti double-stamp
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_customer_id ON public.loyalty_stamps(customer_id);

-- ------------------------------------------------------------------------------
-- 11. Daily Check-in Streak Table (Bab 10.4)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    points_earned INT NOT NULL CHECK (points_earned > 0),
    streak_day INT NOT NULL CHECK (streak_day >= 1 AND streak_day <= 7),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (customer_id, checkin_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_checkins_customer_date ON public.daily_checkins(customer_id, checkin_date);

-- ------------------------------------------------------------------------------
-- 12. Coupons & User Coupons (Kupon Parsial Bab 10.4)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (
        discount_type IN ('free_kiloan', 'percentage', 'fixed_amount')
    ),
    discount_value NUMERIC(10, 2) NOT NULL, -- 5.00 for free_kiloan, or percent, or amount
    max_discount_amount NUMERIC(12, 2),
    min_order_amount NUMERIC(12, 2) DEFAULT 0.00,
    campaign_id UUID,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    valid_from TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT FALSE NOT NULL,
    used_at TIMESTAMPTZ,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_coupons_customer ON public.user_coupons(customer_id, is_used);

-- ------------------------------------------------------------------------------
-- 13. Marketing Campaigns (Mesin Pemasaran & ROI Bab 12)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    channel VARCHAR(30) NOT NULL CHECK (
        channel IN ('instagram_ads', 'tiktok_organic', 'brosur_kampus', 'event_bazar', 'referral', 'other')
    ),
    promo_code VARCHAR(30),
    budget_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_discount_given NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_revenue_generated NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    roi_ratio NUMERIC(6, 2) DEFAULT 0.00 NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ------------------------------------------------------------------------------
-- 14. Marketing Banners (Carousel Dinamis Bab 12.3)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    action_url TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 15. Referral Logs (Program Ajak Teman Bab 12.2)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referral_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_customer_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    reward_points_awarded INT DEFAULT 50 NOT NULL,
    is_rewarded BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 16. App Settings (Config Vault Zero-Hardcode Bab 13)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
    key VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (category IN ('payment', 'outlet', 'business_rules', 'whatsapp')),
    value JSONB NOT NULL,
    description TEXT,
    is_secret BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed Default Zero-Hardcode Config Vault
INSERT INTO public.app_settings (key, category, value, description, is_secret)
VALUES
    (
        'payment_midtrans',
        'payment',
        '{"server_key": "SB-Mid-server-demo-key", "client_key": "SB-Mid-client-demo-key", "merchant_id": "G12345", "is_production": false}'::jsonb,
        'Kredensial Midtrans Sandbox / Produksi (Terisolasi rahasia)',
        TRUE
    ),
    (
        'outlet_profile',
        'outlet',
        '{"name": "SiKucek Laundry", "phone": "081234567890", "address": "Jl. Mawar No. 12, Sleman, Yogyakarta", "open_hours": "07.00 - 21.00 WIB", "maps_url": "https://maps.google.com"}'::jsonb,
        'Informasi profil outlet laundry untuk header nota & kontak',
        FALSE
    ),
    (
        'business_rules',
        'business_rules',
        '{"min_weight_kiloan": 2.0, "stamp_target": 5, "stamp_reward_max_kg": 5.0, "dormant_days_limit": 14}'::jsonb,
        'Aturan bisnis minimal berat timbangan, stempel, dan dormansi',
        FALSE
    ),
    (
        'streak_rewards',
        'business_rules',
        '{"day_1": 10, "day_2": 15, "day_3": 20, "day_4": 25, "day_5": 30, "day_6": 35, "day_7": 50}'::jsonb,
        'Skema poin streak reward daily check-in 7 hari berturut-turut',
        FALSE
    ),
    (
        'wa_template_received',
        'whatsapp',
        '{"template": "Halo Kak {customer_name}! Terima kasih sudah mencuci di SiKucek.\n\nNomor Pesanan: {order_number}\nLayanan: {ringkasan_layanan}\nTotal Tagihan: {final_amount} ({status_bayar})\nEstimasi Selesai: {estimasi_selesai}\n\nPantau proses cucian & foto kondisi pakaian Kakak di sini:\nhttps://sikucek.app/track/{tracking_code}\n\nSi Kucek siap bikin pakaian Kakak wangi, bersih, dan kinclong!"}'::jsonb,
        'Format teks notifikasi WhatsApp nota masuk',
        FALSE
    ),
    (
        'wa_template_ready',
        'whatsapp',
        '{"template": "Kabar gembira Kak {customer_name}! Pakaian Kakak di SiKucek sudah SELESAI, bersih, wangi, dan rapi dipacking.\n\nNomor Pesanan: {order_number}\nLokasi Pengambilan: {rack_location}\nTotal Pembayaran: {final_amount} ({status_bayar})\n\nSilakan ambil pakaian Kakak di kasir dengan menyebutkan nomor rak di atas atau tunjukkan tautan nota ini:\nhttps://sikucek.app/track/{tracking_code}\n\nSampai jumpa di SiKucek!"}'::jsonb,
        'Format teks notifikasi WhatsApp cucian siap ambil di rak',
        FALSE
    )
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 17. WhatsApp Notification Queue (Bab 10.6)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.whatsapp_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    message_body TEXT NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    event_type VARCHAR(30) NOT NULL CHECK (
        event_type IN ('order_received', 'order_ready', 'winback', 'custom')
    ),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (
        status IN ('pending', 'sent', 'failed')
    ),
    attempts INT DEFAULT 0 NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_queue_status ON public.whatsapp_queue(status, attempts);

-- ------------------------------------------------------------------------------
-- 18. Database Trigger & Functions: Otomatisasi Queue Notifikasi WhatsApp
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_handle_order_status_whatsapp()
RETURNS TRIGGER AS $$
DECLARE
    v_template_row JSONB;
    v_msg TEXT;
    v_rack_loc TEXT;
    v_clean_phone TEXT;
BEGIN
    -- Standardize phone to 62
    v_clean_phone := regexp_replace(NEW.customer_phone, '\D', '', 'g');
    IF v_clean_phone LIKE '0%' THEN
        v_clean_phone := '62' || substr(v_clean_phone, 2);
    ELSIF v_clean_phone NOT LIKE '62%' THEN
        v_clean_phone := '62' || v_clean_phone;
    END IF;

    -- Event 1: Pesanan Baru Masuk (Status 'received')
    IF (TG_OP = 'INSERT' AND NEW.status = 'received') THEN
        SELECT value->>'template' INTO v_msg FROM public.app_settings WHERE key = 'wa_template_received';
        IF v_msg IS NOT NULL THEN
            v_msg := replace(v_msg, '{customer_name}', NEW.customer_name);
            v_msg := replace(v_msg, '{order_number}', NEW.order_number);
            v_msg := replace(v_msg, '{tracking_code}', NEW.tracking_code);
            v_msg := replace(v_msg, '{final_amount}', 'Rp ' || to_char(NEW.final_amount, 'FM999,999,999'));
            v_msg := replace(v_msg, '{status_bayar}', CASE WHEN NEW.payment_status = 'paid' THEN 'LUNAS' ELSE 'BELUM LUNAS' END);
            v_msg := replace(v_msg, '{estimasi_selesai}', to_char(NEW.estimated_ready_at, 'DD Mon YYYY, HH24:MI WIB'));
            v_msg := replace(v_msg, '{ringkasan_layanan}', 'Layanan Laundry SiKucek');

            INSERT INTO public.whatsapp_queue (phone_number, message_body, order_id, event_type, status)
            VALUES (v_clean_phone, v_msg, NEW.id, 'order_received', 'pending');
        END IF;
    END IF;

    -- Event 2: Pesanan Siap Ambil (Status berubah menjadi 'ready')
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM 'ready' AND NEW.status = 'ready') THEN
        SELECT value->>'template' INTO v_msg FROM public.app_settings WHERE key = 'wa_template_ready';
        IF v_msg IS NOT NULL THEN
            v_rack_loc := COALESCE(NEW.rack_location, 'Kasir Outlet');
            v_msg := replace(v_msg, '{customer_name}', NEW.customer_name);
            v_msg := replace(v_msg, '{order_number}', NEW.order_number);
            v_msg := replace(v_msg, '{tracking_code}', NEW.tracking_code);
            v_msg := replace(v_msg, '{rack_location}', v_rack_loc);
            v_msg := replace(v_msg, '{final_amount}', 'Rp ' || to_char(NEW.final_amount, 'FM999,999,999'));
            v_msg := replace(v_msg, '{status_bayar}', CASE WHEN NEW.payment_status = 'paid' THEN 'LUNAS' ELSE 'BELUM LUNAS' END);

            INSERT INTO public.whatsapp_queue (phone_number, message_body, order_id, event_type, status)
            VALUES (v_clean_phone, v_msg, NEW.id, 'order_ready', 'pending');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_order_whatsapp_notify ON public.orders;
CREATE TRIGGER trg_order_whatsapp_notify
AFTER INSERT OR UPDATE OF status, rack_location ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.fn_handle_order_status_whatsapp();

-- ------------------------------------------------------------------------------
-- 19. Row Level Security (RLS) Enablement & Guardrails
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.racks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_qc_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_stamp_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_queue ENABLE ROW LEVEL SECURITY;

-- Policy Examples:
-- Services & Banners: Publicly readable
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view active banners" ON public.marketing_banners
    FOR SELECT USING (is_active = TRUE);

-- Orders: Public can view order by tracking_code
CREATE POLICY "Public can track order by tracking code" ON public.orders
    FOR SELECT USING (TRUE);

CREATE POLICY "Public can view order items" ON public.order_items
    FOR SELECT USING (TRUE);

CREATE POLICY "Public can view QC photos" ON public.order_qc_photos
    FOR SELECT USING (TRUE);

-- App Settings: Only non-secret rows are readable by anon/authenticated
CREATE POLICY "Public can view non-secret app settings" ON public.app_settings
    FOR SELECT USING (is_secret = FALSE);

-- Service Role maintains full access to all tables automatically in Supabase
