import { NextRequest } from "next/server";
// Lazy import to avoid build failure if dependency missing initially
import { getOrderById } from "@/lib/db/orders";
import { generateTicketPdf } from "@/lib/tickets/pdf";

// Using default Node.js runtime (PDF generation not ideal on edge yet)

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);
    if (!order) {
      return new Response("Not found", { status: 404 });
    }
    const bytes = await generateTicketPdf(order);
    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ticket-${order.id}.pdf"`,
      },
    });
  } catch (e: unknown) {
    return new Response(e instanceof Error ? e.message : "Error", {
      status: 500,
    });
  }
}
