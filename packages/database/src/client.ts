import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let cachedClient: SupabaseClient<Database> | null = null;
let cachedAdminClient: SupabaseClient<Database> | null = null;

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const url =
    (typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    '';
  const anonKey =
    (typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
    '';

  const isConfigured = Boolean(
    url &&
      anonKey &&
      !url.includes('your-project-id') &&
      !anonKey.includes('your-anon-key') &&
      url.startsWith('http')
  );

  return { url, anonKey, isConfigured };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseCredentials().isConfigured;
}

export function getSupabaseClient(): SupabaseClient<Database> | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: true,
      },
    });
  }

  return cachedClient;
}

export function getSupabaseAdminClient(): SupabaseClient<Database> | null {
  const { url } = getSupabaseCredentials();
  const serviceKey =
    (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) || '';

  if (!url || !serviceKey || serviceKey.includes('your-service-role-key')) {
    return null;
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient<Database>(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedAdminClient;
}
