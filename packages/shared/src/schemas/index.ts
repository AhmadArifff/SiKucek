import { z } from 'zod';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_CHANNEL,
  SERVICE_CATEGORY,
  QC_ISSUE_TYPE,
  DISCOUNT_TYPE,
  USER_ROLE,
  CUSTOMER_TIER,
} from '../constants/index';

export const UserRoleSchema = z.nativeEnum(USER_ROLE as any);
export const CustomerTierSchema = z.nativeEnum(CUSTOMER_TIER as any);
export const OrderStatusSchema = z.nativeEnum(ORDER_STATUS as any);
export const PaymentStatusSchema = z.nativeEnum(PAYMENT_STATUS as any);
export const PaymentChannelSchema = z.nativeEnum(PAYMENT_CHANNEL as any);
export const ServiceCategorySchema = z.nativeEnum(SERVICE_CATEGORY as any);
export const QcIssueTypeSchema = z.nativeEnum(QC_ISSUE_TYPE as any);
export const DiscountTypeSchema = z.nativeEnum(DISCOUNT_TYPE as any);

/**
 * Zod Schema: Input single order item (Satuan or Kiloan)
 */
export const CreateOrderItemSchema = z.object({
  service_id: z.string().uuid(),
  service_name: z.string().min(1),
  category: ServiceCategorySchema,
  quantity: z.number().positive('Jumlah atau berat harus lebih besar dari 0'),
  price_per_unit: z.number().nonnegative(),
  notes: z.string().max(255).optional().nullable(),
});

/**
 * Zod Schema: Intake Order Baru Kasir (Hybrid Kiloan + Satuan)
 */
export const CreateOrderSchema = z.object({
  customer_phone: z
    .string()
    .min(9, 'Nomor HP minimal 9 digit')
    .max(16, 'Nomor HP maksimal 16 digit')
    .regex(/^(\+62|62|08)[0-9]+$/, 'Format nomor HP Indonesia tidak valid (misal: 08123456789)'),
  customer_name: z.string().min(2, 'Nama pelanggan minimal 2 karakter').max(100),
  items: z.array(CreateOrderItemSchema).min(1, 'Pesanan harus memiliki minimal 1 item (kiloan atau satuan)'),
  notes: z.string().max(500).optional().nullable(),
  user_coupon_id: z.string().uuid().optional().nullable(),
  payment_channel: PaymentChannelSchema.optional().default('cash'),
  paid_immediately: z.boolean().default(false),
  cash_received: z.number().nonnegative().optional().default(0),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Zod Schema: Update Status Order dengan Guardrail Rak Fisik
 */
export const UpdateOrderStatusSchema = z
  .object({
    status: OrderStatusSchema,
    rack_location: z.string().max(50).optional().nullable(),
    notes: z.string().max(255).optional().nullable(),
  })
  .refine(
    (data) => {
      // Guardrail Bab 10.5: Jika status READY, rack_location WAJIB diisi
      if (data.status === ORDER_STATUS.READY) {
        return !!data.rack_location && data.rack_location.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Lokasi rak fisik (rack_location) WAJIB diisi sebelum pesanan ditandai SIAP (Ready)!',
      path: ['rack_location'],
    }
  );

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

/**
 * Zod Schema: Unggah Metadata Foto Quality Control (QC)
 */
export const CreateQcPhotoSchema = z.object({
  order_id: z.string().uuid(),
  photo_url: z.string().url('URL foto tidak valid'),
  thumbnail_url: z.string().url('URL thumbnail tidak valid').optional().nullable(),
  issue_type: QcIssueTypeSchema,
  description: z.string().max(255).optional().nullable(),
});

export type CreateQcPhotoInput = z.infer<typeof CreateQcPhotoSchema>;

/**
 * Zod Schema: Alokasi / Pembuatan Master Rak Fisik
 */
export const PhysicalRackSchema = z.object({
  code: z
    .string()
    .min(2, 'Kode rak minimal 2 karakter')
    .max(20, 'Kode rak maksimal 20 karakter')
    .regex(/^[A-Z0-9_-]+$/, 'Kode rak hanya boleh huruf kapital, angka, minus, atau underscore'),
  description: z.string().max(100).optional().nullable(),
});

export type PhysicalRackInput = z.infer<typeof PhysicalRackSchema>;

/**
 * Zod Schema: Konfigurasi App Settings (Zero-Hardcode Vault)
 */
export const AppSettingSchema = z.object({
  key: z.string().min(1).max(100),
  category: z.enum(['payment', 'outlet', 'business_rules', 'whatsapp']),
  value: z.record(z.any()),
  description: z.string().optional().nullable(),
  is_secret: z.boolean().default(false),
});

export type AppSettingInput = z.infer<typeof AppSettingSchema>;
