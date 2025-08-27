import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  insertPendingOrder,
  attachStripeSessionToOrder,
} from "@/lib/db/orders";

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
    // For now we allow guest orders (userId null). RLS currently requires auth.uid() = user_id; will fail for null.
    // TODO: Create a permissive policy for guest inserts OR require auth and pass user id.
    // Temporarily we wrap in try/catch and return a clear error.
    let order;
    try {
      order = await insertPendingOrder({
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
    } catch {
      return Response.json(
        {
          success: false,
          message:
            "Order insert blocked by RLS: configure policy for guest orders or authenticate.",
        },
        { status: 403 }
      );
    }

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
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/checkout/success?id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/checkout/${eventId}`,
      metadata: {
        order_id: order.id,
        event_id: eventId,
        ...metadata,
      },
    });

    try {
      await attachStripeSessionToOrder(order.id, session.id!);
    } catch (e) {
      console.warn(
        "Failed to attach stripe session id to order (RLS likely)",
        e
      );
    }

    return Response.json({
      success: true,
      url: session.url,
      orderId: order.id,
    });
  } catch (e: unknown) {
    console.error("checkout session error", e);
    return Response.json(
      { success: false, message: (e as Error).message },
      { status: 500 }
    );
  }
}
