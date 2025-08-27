import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { insertPendingOrder } from "@/lib/db/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // expected body: { eventId, eventSource, quantity, currency, unitAmount, attendee: { name,email,phone,dob,gender,idNumber } }
    const {
      eventId,
      eventSource = "ticketmaster",
      quantity = 1,
      currency = "usd",
      unitAmount,
      attendee,
      metadata = {},
    } = body || {};

    if (!eventId || !unitAmount || !attendee?.name || !attendee?.email) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = unitAmount * quantity; // cents

    // Insert pending order (guest user for now)
    const order = await insertPendingOrder({
      userId: null,
      eventSource,
      eventId,
      quantity,
      totalAmount,
      currency: currency.toUpperCase(),
      attendee: {
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone || "",
        dob: attendee.dob || "2000-01-01",
        gender: attendee.gender || null,
        idNumber: attendee.idNumber || "TEMP-ID",
      },
    });

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity,
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: metadata.eventName || `Event ${eventId}`,
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/${eventId}`,
      metadata: {
        order_id: order.id,
        event_id: eventId,
        ...metadata,
      },
    });

    // update order with session id
    // Using direct supabase update to avoid extra helper for now
    // (could add helper later)
    // NOTE: ignoring error intentionally minimal; rely on DB policy
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // no-op; already inserted. In full impl we'd patch order with session id via dedicated endpoint or server-side supabase admin
    });

    return Response.json({ success: true, url: session.url, orderId: order.id });
  } catch (e: unknown) {
    console.error('checkout session error', e);
    return Response.json(
      { success: false, message: (e as Error).message },
      { status: 500 }
    );
  }
}
