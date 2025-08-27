import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  getOrderByStripeSession,
  markOrderPaidBySession,
} from "@/lib/db/orders";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) {
      return Response.json(
        { success: false, message: "Missing session_id" },
        { status: 400 }
      );
    }
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    const paymentStatus = session.payment_status; // paid / unpaid / no_payment_required
    let order = await getOrderByStripeSession(session.id);
    if (paymentStatus === "paid" && session.amount_total != null) {
      // ensure DB marked paid
      if (!order || order.status !== "paid") {
        try {
          order = await markOrderPaidBySession(
            session.id,
            session.amount_total
          );
        } catch (e) {
          console.error("Failed to mark order paid in session-status", e);
        }
      }
    }
    return Response.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        payment_status: paymentStatus,
        amount_total: session.amount_total,
        currency: session.currency,
        order_id: session.metadata?.order_id || order?.id || null,
      },
      order,
    });
  } catch (e: unknown) {
    return Response.json(
      { success: false, message: (e as Error).message },
      { status: 500 }
    );
  }
}
