import { createClient } from '@supabase/supabase-js';

// -----------------------------------------------------------------------------
// supabaseClient.js
//
// This module centralises the creation of Supabase clients for both client-
// side and server-side environments. You must provide the correct environment
// variables in `.env.local` or via your hosting provider (Lovable) for these
// values. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser; it should
// only be used on the server.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or anon key is missing. Did you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY?'
  );
}

// Client instance (safe to use in browser) with RLS enforced.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Factory for privileged server-side client using the service role key.
export function createSupabaseServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing. This key must only be used on the server.'
    );
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}