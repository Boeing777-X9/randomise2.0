import { NextResponse } from 'next/server';

export async function GET() {
  const paymentUrl = process.env.RAZORPAY_MEMBERSHIP_PAYMENT_URL;

  if (!paymentUrl) {
    return NextResponse.json(
      { error: 'Payment gateway configuration missing' },
      { status: 500 }
    );
  }

  // 307 Temporary Redirect directly to Razorpay
  return NextResponse.redirect(paymentUrl, { status: 307 });
}