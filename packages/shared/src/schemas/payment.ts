import { z } from 'zod';
import { PAYMENT_STATUS, PAYMENT_CHANNEL } from '../constants/index';

/**
 * Zod Schema: Midtrans Configuration Vault (Zero-Hardcode)
 */
export const MidtransConfigSchema = z.object({
  server_key: z.string().min(1, 'Server Key wajib diisi'),
  client_key: z.string().min(1, 'Client Key wajib diisi'),
  merchant_id: z.string().min(1, 'Merchant ID wajib diisi'),
  is_production: z.boolean().default(false),
  simulation_mode: z.boolean().default(true),
});

export type MidtransConfigInput = z.infer<typeof MidtransConfigSchema>;

/**
 * Zod Schema: Midtrans Notification/Webhook Payload Callback
 */
export const MidtransWebhookPayloadSchema = z.object({
  order_id: z.string().min(1),
  transaction_id: z.string().optional(),
  transaction_status: z.enum([
    'capture',
    'settlement',
    'pending',
    'deny',
    'cancel',
    'expire',
    'refund',
  ]),
  fraud_status: z.string().optional(),
  payment_type: z.string().default('qris'),
  gross_amount: z.string().or(z.number()),
  status_code: z.string().optional(),
  signature_key: z.string().optional(),
  transaction_time: z.string().optional(),
});

export type MidtransWebhookPayload = z.infer<typeof MidtransWebhookPayloadSchema>;

/**
 * Zod Schema: Local Payment Simulation & Checkout Token
 */
export const PaymentSimulationInputSchema = z.object({
  order_id: z.string().min(1),
  amount: z.number().positive(),
  channel: z.enum(['cash', 'midtrans_qris', 'midtrans_va', 'midtrans_gopay']),
  status: z.enum(['paid', 'pending', 'expired', 'refunded']).default('paid'),
});

export type PaymentSimulationInput = z.infer<typeof PaymentSimulationInputSchema>;

/**
 * Zod Schema: WhatsApp Automation & Template Configuration
 */
export const WhatsAppConfigSchema = z.object({
  session_name: z.string().default('sikucek-outlet-01'),
  outlet_phone: z.string().min(9, 'Nomor HP outlet minimal 9 digit'),
  auto_notify_received: z.boolean().default(true),
  auto_notify_ready: z.boolean().default(true),
  template_received: z.string().min(10, 'Template nota masuk minimal 10 karakter'),
  template_ready: z.string().min(10, 'Template siap ambil minimal 10 karakter'),
  template_winback: z.string().optional().nullable(),
});

export type WhatsAppConfigInput = z.infer<typeof WhatsAppConfigSchema>;
