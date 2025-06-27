import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    shipmentIds, // array of AWB numbers
    orderPlacedDate, // string, format: YYYY-MM-DD
    productName, // string, from checkout/order
    razorpayPaymentId, // string, from payment
    razorpayOrderId, // string, from payment
    razorpaySignature, // string, from payment
    pickup_end_time = '18:00', // default end time
    client, // optional
    remarks, // optional
    contact_person, // optional
    contact_phone // optional
  } = await req.json();

  // Validate required fields
  if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Missing or invalid shipmentIds' },
      { status: 400 }
    );
  }
  if (!orderPlacedDate) {
    return NextResponse.json(
      { success: false, error: 'Missing orderPlacedDate' },
      { status: 400 }
    );
  }
  if (!productName) {
    return NextResponse.json(
      { success: false, error: 'Missing productName' },
      { status: 400 }
    );
  }
  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return NextResponse.json(
      { success: false, error: 'Missing Razorpay payment details' },
      { status: 400 }
    );
  }

  // Use warehouse code from env/config
  const pickup_location = process.env.DELHIVERY_PICKUP_CODE || "Just4U_Warehouse";
  const pickup_start_time = "10:00"; // fixed start time

  const pickups = shipmentIds.map((id) => {
    const pickupObj: any = {
      pickup_location,
      pickup_date: orderPlacedDate, // format: YYYY-MM-DD
      pickup_start_time,            // format: HH:MM
      pickup_end_time,              // format: HH:MM
      shipment_identifiers: [{ awb: id }],
      product_name: productName,    // include product name for reference
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature
    };
    if (client) pickupObj.client = client;
    if (remarks) pickupObj.remarks = remarks;
    if (contact_person) pickupObj.contact_person = contact_person;
    if (contact_phone) pickupObj.contact_phone = contact_phone;
    return pickupObj;
  });

  const payload = { pickups };

  // Log for debugging
  console.log('[Delhivery Pickup Debug] Payload:', JSON.stringify(payload, null, 2));

  try {
    const DELHIVERY_API_URL = 'https://track.delhivery.com/api/pickup/create'; // no trailing slash
    const res = await fetch(
      DELHIVERY_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${process.env.DELHIVERY_API_TOKEN}`
        },
        body: JSON.stringify(payload)
      }
    );
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error('[Delhivery Pickup Debug] JSON Parse Error:', e);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON from Delhivery Pickup API',
          details: text,
          statusCode: res.status,
        },
        { status: 502 }
      );
    }
    console.log('[Delhivery Pickup Debug] Response:', JSON.stringify(json, null, 2));
    if (json.success) {
      return NextResponse.json(
        { success: true, pickup: json.pickup },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: json.rmk || 'Delhivery Pickup API error',
        details: json,
        statusCode: res.status,
      },
      { status: 502 }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error('[Delhivery Pickup API Error]', err.stack);
    } else {
      console.error('[Delhivery Pickup API Error]', err);
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.',
        details: String(err),
      },
      { status: 500 }
    );
  }
} 