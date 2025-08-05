import { NextResponse } from "next/server";

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

const fetchTicketmasterEvents = async () => {
  try {
    const response = await fetch(
      `${TICKETMASTER_BASE}events.json?apikey=${TICKETMASTER_API_KEY}`,
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
      return [];
    }

    return data._embedded.events.map(transformTicketmasterEvent);
  } catch (error) {
    console.error("Error fetching Ticketmaster events:", error);
    return [];
  }
};

// Main API route
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Melbourne";

    console.log(`Fetching events for ${city}...`);

    // Get Ticketmaster events
    const ticketmasterEvents = await fetchTicketmasterEvents();

    // TODO: Later add user-created events from Supabase
    // const userEvents = await fetchUserEvents()

    const allEvents = [
      ...ticketmasterEvents,
      // ...userEvents
    ];

    return NextResponse.json({
      success: true,
      events: allEvents,
      total: allEvents.length,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
