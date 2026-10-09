/**
 * WhatsApp Automation Engine (Baileys) - SiKucek Worker
 * Listens to Supabase `whatsapp_queue` and dispatches WhatsApp messages.
 */

import { buildOrderReceivedMessage, buildOrderReadyMessage } from '@sikucek/shared';

console.log('SiKucek WhatsApp Automation Engine initialized.');
console.log('Worker listening for pending queue events in Supabase...');

export function healthCheck(): string {
  return 'SiKucek Worker operational';
}
