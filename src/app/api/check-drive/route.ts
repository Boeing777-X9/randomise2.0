import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ isPublic: false, message: 'URL is required' }, { status: 400 });
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow',
      cache: 'no-store'
    });
    const finalUrl = response.url.toLowerCase();
    if (
      finalUrl.includes('accounts.google.com') ||
      finalUrl.includes('servicelogin') ||
      response.status === 401 ||
      response.status === 403
    ) {
      return NextResponse.json({
        isPublic: false,
        message: "This Drive link is private. Please change permissions to 'Anyone with the link can view'."
      });
    }
    return NextResponse.json({ isPublic: true });
  } catch {
    return NextResponse.json({
      isPublic: false,
      message: 'Could not access the link. Please ensure the link is active and public.'
    });
  }
}