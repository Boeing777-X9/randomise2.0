import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const paymentUrl = type === 'Renewal'
    ? (process.env.RAZORPAY_MEMBERSHIP_RENEWAL_URL || process.env.RAZORPAY_MEMBERSHIP_PAYMENT_URL)
    : process.env.RAZORPAY_MEMBERSHIP_PAYMENT_URL;

  if (!paymentUrl) {
    return NextResponse.json(
      { error: 'Payment gateway configuration missing' },
      { status: 500 }
    );
  }

  // 307 Temporary Redirect directly to Razorpay
  return NextResponse.redirect(paymentUrl, { status: 307 });
}