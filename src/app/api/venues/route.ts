import { NextResponse } from "next/server";

const TM_KEY = process.env.TICKETMASTER_API_KEY!;
const TM_BASE = process.env.TICKETMASTER_API_URL!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const qp = new URLSearchParams();
    qp.set("apikey", TM_KEY);
    qp.set("latlong", `${lat},${lng}`);
    qp.set("radius", "50");
    qp.set("size", "35");

    const url = `${TM_BASE}/venues.json?${qp.toString()}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 1000 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `TM ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const raw = data?._embedded?.venues;

    // const formattedArr = raw.map(
    //   (d: {
    //     type: TicketmasterClassification;
    //     segment: TicketmasterClassification;
    //   }) => fmtClassifications(d.segment ?? d.type)
    // );

    return NextResponse.json({
      success: true,
      data: raw,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "failed to fetch events" },
      { status: 500 }
    );
  }
}
