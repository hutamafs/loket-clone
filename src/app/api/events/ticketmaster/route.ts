import { NextResponse } from "next/server";
import { TicketmasterEvent } from "@/app/types/event";

const TM_KEY = process.env.TICKETMASTER_API_KEY!;
const TM_BASE = "https://app.ticketmaster.com/discovery/v2";

const transform = (tmEvent: TicketmasterEvent) => {
  const venue = tmEvent._embedded?.venues?.[0];
  const image =
    tmEvent.images?.find(
      (img) => typeof img.width === "number" && img.width > 300
    ) || tmEvent.images?.[0];
  const priceRange = tmEvent.priceRanges?.[0];

  return {
    id: tmEvent.id,
    source: "ticketmaster" as const,
    name: tmEvent.name,
    description: tmEvent.info || tmEvent.pleaseNote || "",
    start:
      tmEvent.dates?.start?.dateTime ||
      `${tmEvent.dates?.start?.localDate}T${
        tmEvent.dates?.start?.localTime || "19:00:00"
      }`,
    end: tmEvent.dates?.end?.dateTime || null,
    image: image?.url || "/placeholder-event.jpg",
    venue: {
      name: venue?.name || "TBA",
      address: venue?.address?.line1
        ? `${venue.address.line1}, ${venue.city?.name}, ${venue.state?.stateCode}`
        : venue?.city?.name || "",
      latitude: venue?.location?.latitude
        ? parseFloat(venue.location.latitude)
        : null,
      longitude: venue?.location?.longitude
        ? parseFloat(venue.location.longitude)
        : null,
    },
    price: {
      min: priceRange?.min || 0,
      max: priceRange?.max || 0,
      currency: priceRange?.currency || "AUD",
      display: priceRange
        ? `$${priceRange.min} - $${priceRange.max}`
        : "Price TBA",
    },
    category: tmEvent.classifications?.[0]?.segment?.name || "Entertainment",
    url: tmEvent.url,
    canEdit: false,
    canRegister: true,
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const qp = new URLSearchParams();
    qp.set("apikey", TM_KEY);

    // pagination / sizing
    const size = searchParams.get("size");
    if (size) qp.set("size", size);
    const page = searchParams.get("page");
    if (page) qp.set("page", page);

    // time window
    const startDateTime = searchParams.get("startDateTime");
    if (startDateTime) qp.set("startDateTime", startDateTime);
    const endDateTime = searchParams.get("endDateTime");
    if (endDateTime) qp.set("endDateTime", endDateTime);

    // sorting
    qp.set("sort", searchParams.get("sort") || "relevance,desc");

    // filters
    const countryCode = searchParams.get("countryCode");
    if (countryCode) qp.set("countryCode", countryCode);

    const keyword = searchParams.get("keyword");
    if (keyword) qp.set("keyword", keyword);

    const classificationName = searchParams.get("classificationName");
    if (classificationName) qp.set("classificationName", classificationName);

    const source = searchParams.get("source");
    if (source) qp.set("source", source); // e.g. "ticketmaster"

    // ✅ location by lat/lng (+radius)
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      qp.set("latlong", `${lat},${lng}`); // still supported
      const radius = searchParams.get("radius") || "50";
      qp.set("radius", radius);
      qp.set("unit", searchParams.get("unit") || "km");
    }

    const url = `${TM_BASE}/events.json?${qp.toString()}`;
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

    const data = await res.json();
    const raw = data?._embedded?.events ?? [];
    const events = raw.map(transform);
    const totalPages = data?.page?.totalPages ?? 0;

    return NextResponse.json({
      success: true,
      data: { data: events, total: totalPages },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "failed to fetch events" },
      { status: 500 }
    );
  }
}
