import { NextResponse } from "next/server";
import { fmtClassifications } from "@/lib/transformTmObj";
import { TicketmasterClassification } from "@/app/types/event";

const TM_KEY = process.env.TICKETMASTER_API_KEY!;
const TM_BASE = process.env.TICKETMASTER_API_URL!;

export async function GET() {
  try {
    const qp = new URLSearchParams();
    qp.set("apikey", TM_KEY);

    const url = `${TM_BASE}/classifications.json?${qp.toString()}`;
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
    const raw = data?._embedded?.classifications;

    const formattedArr = raw.map(
      (d: {
        type: TicketmasterClassification;
        segment: TicketmasterClassification;
      }) => fmtClassifications(d.segment ?? d.type)
    );

    return NextResponse.json({
      success: true,
      data: formattedArr,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "failed to fetch events" },
      { status: 500 }
    );
  }
}
