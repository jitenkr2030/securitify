import { NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/lib/payment/stripe';

export async function GET() {
  try {
    return NextResponse.json({
      plans: SUBSCRIPTION_PLANS,
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}