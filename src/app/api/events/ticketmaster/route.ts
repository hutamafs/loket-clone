import { NextResponse } from "next/server";
import { transform } from "@/lib/transformTmObj";

const TM_KEY = process.env.TICKETMASTER_API_KEY!;
const TM_BASE = process.env.TICKETMASTER_API_URL!;

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

    // Handle classificationId as an array
    const classificationIds = searchParams.getAll("classificationId");
    if (classificationIds.length > 0) {
      qp.set("classificationId", classificationIds.join(","));
    }

    // Handle genreId as an array
    const genreIds = searchParams.getAll("genreId");
    if (genreIds.length > 0) {
      qp.set("genreId", genreIds.join(","));
    }

    // Handle venueId
    const venueId = searchParams.get("venueId");
    if (venueId) qp.set("venueId", venueId);

    const source = searchParams.get("source");
    if (source) qp.set("source", source); // e.g. "ticketmaster"

    // location by lat/lng (+radius)
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
