import { NextResponse } from 'next/server';

/**
 * Redirects user to Supabase Google OAuth authorize URL.
 * Make sure you set SUPABASE_URL and NEXT_PUBLIC_SITE_URL in env.
 * Configure Supabase OAuth redirect to /api/auth/callback
 */

export async function GET() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const REDIRECT_TO = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`;

  if (!SUPABASE_URL) {
    return NextResponse.json({ error: 'Missing SUPABASE_URL' }, { status: 500 });
  }

  // Using Supabase Auth v1 authorize endpoint pattern.
  const url = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(REDIRECT_TO)}`;
  return NextResponse.redirect(url);
}
