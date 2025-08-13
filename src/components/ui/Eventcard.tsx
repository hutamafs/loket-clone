import Image from "next/image";
import Link from "next/link";

type TMEvent = {
  id: string;
  name: string;
  url?: string;
  images?: { url: string }[];
  dates?: { start?: { localDate?: string; dateTime?: string } };
  priceRanges?: { min?: number; max?: number; currency?: string }[];
  _embedded?: { venues?: { name?: string }[] };
};

function money(p?: { min?: number; currency?: string }) {
  if (!p?.min) return "Price TBA";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: p.currency || "AUD",
    maximumFractionDigits: 0,
  }).format(p.min);
}

export default function EventCard({ e }: { e: TMEvent }) {
  const img = e.images?.[0]?.url || "/placeholder-event.jpg";
  const date =
    e.dates?.start?.localDate ??
    (e.dates?.start?.dateTime ? e.dates?.start?.dateTime.slice(0, 10) : "");
  const venue = e._embedded?.venues?.[0]?.name || "Venue TBA";
  const price = money(e.priceRanges?.[0]);

  return (
    <article className="snap-start w-[280px] md:w-[320px] shrink-0 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link href={e.url || "#"} target="_blank">
        <div className="relative h-[160px] md:h-[180px] w-full overflow-hidden rounded-t-xl">
          <Image
            src={img}
            alt={e.name}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="line-clamp-2 font-semibold">{e.name}</h3>
        <p className="text-sm text-muted-foreground">{date}</p>
        <p className="text-sm font-medium">{price}</p>
        <p className="text-xs text-muted-foreground mt-1">{venue}</p>
      </div>

      <div className="p-4 pt-0">
        <Link
          href={e.url || "#"}
          target="_blank"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 text-white text-sm h-9 hover:bg-blue-700"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
