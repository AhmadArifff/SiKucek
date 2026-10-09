import { getSupabaseClient, isSupabaseConfigured } from './client';

export interface QueuedWhatsAppMessage {
  id: string;
  order_id?: string | null;
  recipient_phone: string;
  message_body: string;
  message_type: 'order_received' | 'order_ready' | 'winback' | 'custom';
  status: 'pending' | 'sent' | 'failed';
  retry_count: number;
  error_message?: string | null;
  created_at: string;
  sent_at?: string | null;
}

const LOCAL_WA_QUEUE_KEY = 'sikucek_whatsapp_queue_v1';

export function getLocalWhatsAppQueue(): QueuedWhatsAppMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_WA_QUEUE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage parse error
  }
  return [];
}

export function saveLocalWhatsAppQueue(queue: QueuedWhatsAppMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_WA_QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new Event('sikucek_whatsapp_queue_updated'));
  } catch {
    // Ignore
  }
}

/**
 * Enqueue a WhatsApp message to Supabase database (or local queue in Zero-Cost mode)
 */
export async function enqueueWhatsAppMessage(params: {
  orderId?: string | null;
  recipientPhone: string;
  messageBody: string;
  messageType: 'order_received' | 'order_ready' | 'winback' | 'custom';
}): Promise<{ success: boolean; queueId: string; mode: 'live' | 'mock' }> {
  const queueId = `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const newEntry: QueuedWhatsAppMessage = {
    id: queueId,
    order_id: params.orderId || null,
    recipient_phone: params.recipientPhone,
    message_body: params.messageBody,
    message_type: params.messageType,
    status: 'pending',
    retry_count: 0,
    created_at: now,
  };

  // Always save to local queue for client visibility
  const localQueue = getLocalWhatsAppQueue();
  saveLocalWhatsAppQueue([newEntry, ...localQueue]);

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('whatsapp_queue').insert({
        id: queueId,
        order_id: params.orderId || null,
        recipient_phone: params.recipientPhone,
        message_body: params.messageBody,
        message_type: params.messageType,
        status: 'pending',
        retry_count: 0,
        created_at: now,
      } as any);

      if (!error) {
        return { success: true, queueId, mode: 'live' };
      }
    } catch {
      // Fallback
    }
  }

  return { success: true, queueId, mode: 'mock' };
}
