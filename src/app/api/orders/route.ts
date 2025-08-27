import { NextResponse } from "next/server";
import { OrderCreateSchema } from "@/lib/validation";
import { insertPendingOrder } from "@/lib/db/orders";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = OrderCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { eventSource, eventId, quantity, totalAmount, currency, attendee } =
      parsed.data;

    // TODO: replace userId null with real auth user id when auth integrated
    const record = await insertPendingOrder({
      userId: null,
      eventSource,
      eventId,
      quantity,
      totalAmount,
      currency,
      attendee,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (err) {
    console.error("/api/orders error", err);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
