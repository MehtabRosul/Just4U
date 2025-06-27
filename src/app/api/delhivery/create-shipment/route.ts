import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    orderId,
    address, // should include .state, .city, .street, .country, .zip, .phone, .email, .name
    weight,
    dimensions,
    payment_mode, // "Prepaid" or "COD"
    product // "D" for prepaid, "C" for COD
  } = await req.json();

  // Validate required fields
  if (!orderId || !address?.street || !weight || !dimensions || !payment_mode || !product) {
    console.warn('[Delhivery Debug] Missing required fields:', {
      orderId, address, weight, dimensions, payment_mode, product
    });
    return NextResponse.json(
      { success: false, rmk: 'Missing required fields' },
      { status: 200 }
    );
  }
  if (!address.state || !address.country) {
    console.warn('[Delhivery Debug] Missing address state or country:', address);
    return NextResponse.json(
      { success: false, rmk: 'Missing address state or country' },
      { status: 200 }
    );
  }

  // --- TEST MODE MOCK FOR PROOF OF FLOW ---
  if (process.env.DELHIVERY_API_TOKEN && process.env.DELHIVERY_API_TOKEN.startsWith('test_')) {
    console.log('[Delhivery Debug] Using test-mode mock response for shipment creation.');
    return NextResponse.json({
      success: true,
      shipments: [{ awb: 'TESTAWB123456', status: 'created' }]
    }, { status: 200 });
  }
  // --- END TEST MODE MOCK ---

  // Prepare strict, flat payload for Delhivery V2
  const payload = {
    format: "json",
    data: {
      shipments: [
        {
          order: orderId,
          product, // "D" or "C"
          payment_mode, // "Prepaid" or "COD"
          name: address.name,
          address: address.street,
          city: address.city,
          state: address.state,      // dynamic
          country: address.country,  // dynamic
          phone: address.phone,
          email: address.email,
          pin: address.zip,
          pickup_location: process.env.DELHIVERY_PICKUP_CODE || "Just4U_Warehouse",
          weight: weight,
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
          service_type: "Express"
        }
      ]
    }
  };

  // Log all relevant debug info
  console.log("[Delhivery Debug] ENV:", {
    DELHIVERY_BASE_URL: process.env.DELHIVERY_BASE_URL,
    DELHIVERY_PICKUP_CODE: process.env.DELHIVERY_PICKUP_CODE,
    // DELHIVERY_API_TOKEN intentionally omitted for security
  });
  console.log("[Delhivery Debug] Request Headers:", {
    'Content-Type': 'application/json',
    'Authorization': 'Token <hidden>'
  });
  console.log("[Delhivery Debug] Request Payload:", JSON.stringify(payload, null, 2));

  let res, text, json;
  try {
    // Use the correct v2 endpoint for Delhivery bulk shipment creation
    const DELHIVERY_API_URL = 'https://track.delhivery.com/api/v1/packages/create/json';
    console.log('[Delhivery Debug] Using endpoint:', DELHIVERY_API_URL);
    res = await fetch(
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
    text = await res.text();
    // Log raw response and status
    console.log("[Delhivery Debug] Response Status:", res.status);
    console.log("[Delhivery Debug] Raw Response:", text);
    if (res.status === 404) {
      console.error("[Delhivery Debug] Invalid endpoint or resource missing (404)");
    }
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("[Delhivery Debug] JSON Parse Error:", e);
      json = {
        success: false,
        rmk: 'Invalid JSON from Delhivery v2',
        details: text,
        statusCode: res.status,
      };
    }
    // Log parsed response
    console.log("[Delhivery Debug] Parsed Response:", JSON.stringify(json, null, 2));
    if (res.status === 500) {
      return NextResponse.json(
        { success: false, rmk: 'Delhivery V2 API returned 500', details: text },
        { status: 200 }
      );
    }
    if (json.success && Array.isArray(json.shipments) && json.shipments.length > 0) {
      return NextResponse.json(
        { success: true, shipments: json.shipments },
        { status: 200 }
      );
    }
    // If AWB or shipments missing, return error
    return NextResponse.json(
      { success: false, rmk: json.rmk || 'Delhivery V2 error', details: json },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error('[Delhivery V2 Error]', err.stack);
    } else {
      console.error('[Delhivery V2 Error]', err);
    }
    return NextResponse.json(
      { success: false, rmk: 'Delhivery V2 fetch error', details: String(err) },
      { status: 200 }
    );
  }
} 