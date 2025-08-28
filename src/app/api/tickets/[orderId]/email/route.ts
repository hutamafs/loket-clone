import { NextRequest } from "next/server";
import { getOrderById } from "@/lib/db/orders";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);
    if (!order)
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    // TODO: integrate real email service (Resend, Postmark, etc.)
    // For now just return success to simulate.
    return Response.json({ success: true, message: "Email dispatched (stub)" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ success: false, message }, { status: 500 });
  }
}
