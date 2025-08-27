import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  attachStripeSessionToOrder,
  markOrderPaidBySession,
  getOrderByStripeSession,
} from "@/lib/db/orders";

// We need the raw body to verify Stripe signature
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  const hdrs = await headers();
  const sig = hdrs.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET env var");
    return NextResponse.json({ received: true }, { status: 200 });
  }
  if (!sig)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  let event; // Stripe.Event
  let rawBody: string;
  try {
    rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sessionObj = event.data.object as unknown as {
          id: string;
          amount_total?: number | null;
          metadata?: Record<string, string> | null;
        };
        const sessionId = sessionObj.id;
        const amountTotal = sessionObj.amount_total ?? null;
        // Ensure order has session id (should already) & mark paid
        const order = await getOrderByStripeSession(sessionId);
        if (!order && sessionObj.metadata?.order_id) {
          try {
            await attachStripeSessionToOrder(
              sessionObj.metadata.order_id,
              sessionId
            );
          } catch (e) {
            console.warn("Failed attaching session id in webhook", e);
          }
        }
        if (amountTotal != null) {
          try {
            await markOrderPaidBySession(sessionId, amountTotal);
          } catch (e) {
            console.error("Failed marking order paid", e);
          }
        }
        break;
      }
      default: {
        // ignore
      }
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json(
      { error: "Webhook handler failure" },
      { status: 500 }
    );
  }
}
