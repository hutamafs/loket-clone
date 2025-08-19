import CheckoutPage from "@/components/checkout/page";

async function getEvent(eventId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/ticketmaster/${eventId}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch event");
  const { data } = await res.json();
  return data;
}

// ✅ Convert page to Client Component wrapper
export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  return <CheckoutPage event={event} />;
}
