import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface TicketOrderLike {
  id: string;
  attendee_name: string;
  attendee_email: string;
  quantity: number;
  total_amount: number;
  currency: string;
  status: string;
}

export async function generateTicketPdf(
  order: TicketOrderLike
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 300]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();
  const draw = (text: string, y: number, size = 12) =>
    page.drawText(text, { x: 24, y, size, font, color: rgb(0, 0, 0) });
  draw("EventFlow Ticket", height - 40, 18);
  draw(`Order: ${order.id}`, height - 70);
  draw(`Attendee: ${order.attendee_name}`, height - 90);
  draw(`Email: ${order.attendee_email}`, height - 110);
  draw(`Quantity: ${order.quantity}`, height - 130);
  draw(
    `Total Paid: ${(order.total_amount / 100).toFixed(2)} ${order.currency}`,
    height - 150
  );
  draw(`Status: ${order.status}`, height - 170);
  draw("Thank you for your purchase!", 40);
  return pdf.save();
}
