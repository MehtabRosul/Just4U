// src/app/api/create-order/route.ts
import { NextRequest } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, notes } = body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: 'rcpt_' + Date.now(),
      notes: notes || {},
    });

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error('[RAZORPAY_ORDER_ERROR]', error);
    return new Response(JSON.stringify({ error: 'Order creation failed' }), { status: 500 });
  }
}