import { NextResponse } from "next/server";

const TM_KEY = process.env.TICKETMASTER_API_KEY!;

import { TicketmasterEvent } from "@/app/types/event";

function transform(tm: TicketmasterEvent) {
  const venue = tm._embedded?.venues?.[0];
  const img =
    tm.images?.find((i) => typeof i.width === "number" && i.width > 800) ??
    tm.images?.[0];

  const price = tm.priceRanges?.[0];

  return {
    id: tm.id,
    source: "ticketmaster" as const,
    name: tm.name,
    description: tm.info || tm.pleaseNote || "",
    start:
      tm.dates?.start?.dateTime ||
      `${tm.dates?.start?.localDate}T${
        tm.dates?.start?.localTime || "19:00:00"
      }`,
    end: tm.dates?.end?.dateTime || null,
    image: img?.url || "/placeholder-event.jpg",
    venue: {
      name: venue?.name || "TBA",
      address: venue?.address?.line1
        ? `${venue.address.line1}, ${venue.city?.name ?? ""} ${
            venue.state?.stateCode ?? ""
          }`.trim()
        : venue?.city?.name || "",
      latitude: venue?.location?.latitude
        ? Number(venue.location.latitude)
        : null,
      longitude: venue?.location?.longitude
        ? Number(venue.location.longitude)
        : null,
    },
    price: {
      min: price?.min ?? 0,
      max: price?.max ?? 0,
      currency: price?.currency ?? "AUD",
      display: price ? `$${price.min} - $${price.max}` : "Price TBA",
    },
    category: tm.classifications?.[0]?.segment?.name || "Entertainment",
    url: tm.url,
    organizer: tm.promoter?.name || tm.promoters?.[0]?.name || "",
  };
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = `${process.env.TICKETMASTER_API_URL}/events/${params.id}.json?apikey=${TM_KEY}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `TM ${res.status}` },
        { status: res.status }
      );
    }
    const raw = await res.json();
    return NextResponse.json({ success: true, data: transform(raw) });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "failed to fetch event" },
      { status: 500 }
    );
  }
}
