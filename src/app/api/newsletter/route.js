import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const { email, token } = await request.json();

    // 1. Strict Email Regex Check
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 2. Reject obvious fake domains
    if (email.endsWith('@test.com') || email.endsWith('@example.com')) {
      return NextResponse.json({ error: 'Invalid email domain.' }, { status: 400 });
    }

    // 3. Verify Turnstile Token with Cloudflare's servers
    if (!token) {
      return NextResponse.json({ error: 'Bot check failed. Please refresh and try again.' }, { status: 400 });
    }

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || '',
        response: token,
      }),
    });

    const turnstileOutcome = await turnstileRes.json();
    if (!turnstileOutcome.success) {
      return NextResponse.json({ error: 'Bot verification failed. Refresh the page.' }, { status: 400 });
    }

    // 4. Securely Insert into Supabase
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
      }
      return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: "You're on the list!" }, { status: 200 });

  } catch (err) {
    console.error("Newsletter submission error:", err);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}