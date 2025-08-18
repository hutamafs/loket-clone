import EventCheckout from "@/components/checkout/CheckoutForm";

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
  params: { eventId: string };
}) {
  const event = await getEvent(params.eventId);

  return <EventCheckout event={event} />;
}
