import Image from "next/image";
import Link from "next/link";
import { Event as EventInterface } from "@/app/types/event";

export type UEvent = {
  id: string;
  source: "ticketmaster" | string;
  name: string;
  description?: string;
  start?: string | null; // ISO
  end?: string | null;
  image?: string | null;
  venue?: { name?: string; address?: string | null };
  price?: {
    min?: number | null;
    max?: number | null;
    currency?: string;
    display?: string;
  };
  category?: string;
  url?: string;
  canRegister?: boolean;
};

function fmtDate(iso?: string | null) {
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
}

function fmtPrice(p?: UEvent["price"]) {
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
}

export default function LoketEventCard({
  event: e,
}: {
  event: EventInterface;
}) {
  const img = e.image || "/placeholder-event.jpg";
  const category = e.category || "Entertainment";
  const date = fmtDate(e.start);
  const price = fmtPrice(e.price);
  const venue = e.venue?.name || "Venue TBA";

  return (
    <article className="snap-start h-[375px] w-[276px] md:w-[300px] shrink-0 rounded-2xl border bg-white overflow-hidden flex flex-col">
      <Link
        href={e.url || "#"}
        target="_blank"
        className="block flex-grow overflow-hidden"
      >
        {/* Poster */}
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={img}
            alt={e.name}
            fill
            sizes="(max-width: 768px) 280px, 300px"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 text-[10px] px-2 py-1 rounded-full bg-white/90 text-gray-900 border">
            {category}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2 flex-grow">
          <h3 className="font-semibold leading-snug line-clamp-2">{e.name}</h3>
          <p className="text-sm text-gray-600">{date}</p>
          <p className="text-sm font-medium">{price}</p>
          <p className="text-xs text-gray-500 truncate">{venue}</p>
        </div>
      </Link>

      {/* Action */}
      <div className="mt-auto">
        <Link
          href={e.url || "#"}
          target="_blank"
          className="flex items-center justify-center w-full bg-blue-600 text-white text-sm h-11 hover:bg-blue-700 font-medium transition-colors"
        >
          {e.canRegister === false ? "Details" : "Register"}
        </Link>
      </div>
    </article>
  );
}
