import { NextResponse } from "next/server";
import { createApiResponse } from "@/app/dto/apiResponse";

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_BASE = "https://app.ticketmaster.com/discovery/v2/";

import { TicketmasterEvent } from "@/app/types/event";

const transformTicketmasterEvent = (tmEvent: TicketmasterEvent) => {
  const venue = tmEvent._embedded?.venues?.[0];
  const image =
    tmEvent.images?.find(
      (img) => typeof img.width === "number" && img.width > 300
    ) || tmEvent.images?.[0];
  const priceRange = tmEvent.priceRanges?.[0];

  return {
    id: tmEvent.id,
    source: "ticketmaster",
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
        : venue?.city?.name || "Melbourne",
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

const fetchTicketmasterEvents = async ({
  page,
  lat,
  lng,
  radius,
  keyword,
  city,
}: {
  page?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  keyword?: string;
  city?: string;
}) => {
  console.log(lat, lng, 70);
  const query = new URLSearchParams({
    apikey: TICKETMASTER_API_KEY!,
    latlong: `${lat},${lng}`,
    radius: radius || "50",
    page: String(page || 0),
    keyword: keyword || "",
    unit: "km",
    sort: "date,asc",
    city: city || "",
  });
  try {
    const response = await fetch(
      `${TICKETMASTER_BASE}events.json?apikey=${TICKETMASTER_API_KEY}&${query.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data._embedded?.events) {
      console.log("No events found in Ticketmaster response");
      return {
        data: [],
        totalPages: 0,
      };
    }

    const mappedEvents = data._embedded.events.map(transformTicketmasterEvent);
    return {
      data: mappedEvents,
      totalPages: data.page.totalPages,
    };
  } catch (error) {
    console.error("Error fetching Ticketmaster events:", error);
    return {
      data: [],
      totalPages: 0,
    };
  }
};

// Main API route
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = String(searchParams.get("page"));
    const lat = searchParams.get("lat")!;
    const lng = searchParams.get("lng")!;
    const radius = searchParams.get("radius") || "50";
    const keyword = searchParams.get("keyword") || "";
    const city = searchParams.get("city") || "";

    // Get Ticketmaster events
    const { data, totalPages } = await fetchTicketmasterEvents({
      page,
      lat,
      lng,
      radius,
      keyword,
      city,
    });

    // TODO: Later add user-created events from Supabase
    // const userEvents = await fetchUserEvents()

    const response = createApiResponse({
      success: true,
      data: {
        data,
        total: totalPages,
      },
      code: 200,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("API route error:", error);
    const response = createApiResponse({
      success: false,
      code: 500,
      error: "failed to fetch events",
    });
    return NextResponse.json(response);
  }
}
