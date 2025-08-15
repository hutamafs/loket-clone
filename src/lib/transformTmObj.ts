import {
  TicketmasterEvent,
  TicketmasterClassification,
} from "@/app/types/event";
import { Event } from "@/app/types/event";

export const transform = (tmEvent: TicketmasterEvent) => {
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

export const fmtDate = (iso?: string | null) => {
  if (!iso) return "Date TBA";
  try {
    return new Intl.DateTimeFormat("en-AU", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "Date TBA";
  }
};

export const fmtPrice = (p?: Event["price"]) => {
  if (!p) return "Price TBA";
  if (p.display && p.display.trim().length) return p.display;
  if (p.min && p.min > 0) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: p.currency || "AUD",
      maximumFractionDigits: 0,
    }).format(p.min);
  }
  return "Price TBA";
};

export const fmtClassifications = (tmClass: TicketmasterClassification) => ({
  id: tmClass?.id,
  name: tmClass?.name,
  genres: tmClass?._embedded.genres,
});
