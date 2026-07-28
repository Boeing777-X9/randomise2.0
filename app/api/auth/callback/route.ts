import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../../lib/supabaseServer';

/**
 * Simplified callback route scaffold.
 * NOTE: Supabase sends the OAuth tokens in the URL fragment which server cannot read.
 * For a production-ready flow, prefer a client-side redirect to capture the fragment,
 * then send the token to the server (via cookie or POST) and verify.
 *
 * For now this route supports an optional query param `email` for dev/testing.
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  // In real flow: extract user email using the provider token and supabase.
  if (!email) {
    // Redirect to login with an instruction for devs
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`;
    return NextResponse.redirect(redirectUrl);
  }

  // server-side check for membership
  try {
    const supabase = getSupabaseServerClient();
    const { data: members } = await supabase.from('members').select('member_id').or(`personal_gmail.eq.${email},muj_email.eq.${email}`).limit(1);
    if (!members || members.length === 0) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/member/profile?email=${encodeURIComponent(email)}`);
    }

    // member exists -> redirect to profile (profile page will query and render)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/member/profile?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error('Callback error', err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`);
  }
}
