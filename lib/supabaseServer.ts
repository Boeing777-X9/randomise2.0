import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client. Use only on the server.
 * Set these env vars in your deployment (never commit keys):
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (server only)
 */

let serverSupabase: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverSupabase) return serverSupabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  }
  serverSupabase = createClient(url, key, {
    // disable cookies / local auth on server
    global: { headers: { 'x-client-info': 'member-profile-portal' } },
  });
  return serverSupabase;
}

/**
 * Member and timeline types used across server components
 */
export type Member = {
  id: string;
  member_id: string; // RA... e.g. RA25001
  full_name: string;
  personal_gmail?: string | null;
  muj_email?: string | null;
  phone?: string | null;
  course?: string | null;
  specialization?: string | null;
  graduation_year?: number | null;
  dob?: string | null; // ISO string
  current_position?: string | null;
  current_domain?: string | null;
  member_since?: string | null; // ISO date
  profile_image_url?: string | null;
  joined_at?: string | null;
};

export type TimelineEntry = {
  id: string;
  member_id: string; // FK to members.member_id
  title: string;
  description?: string | null;
  month: string; // e.g. "October"
  year: number;
  position?: string | null;
  domain?: string | null;
  created_at: string;
};

/**
 * Helper to generate Member IDs following the rules:
 * RA + last two digits of joining year + sequence (3 digits)
 * Exception: reserve RA25777
 * This function does not perform DB inserts; it assumes caller will ensure uniqueness.
 */
export function formatMemberId(joinDate: string, sequence: number) {
  const date = new Date(joinDate);
  const yy = String(date.getFullYear()).slice(-2);
  return `RA${yy}${String(sequence).padStart(3, '0')}`;
}
