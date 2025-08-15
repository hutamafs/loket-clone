import Image from "next/image";
import Link from "next/link";
import { Event as EventInterface } from "@/app/types/event";
import { fmtDate, fmtPrice } from "@/lib/transformTmObj";

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
    <article className="snap-start md:h-[375px] w-full md:w-[276px] shrink-0 rounded-2xl border bg-white overflow-hidden flex flex-col">
      <Link
        href={`/event/${e.id}`}
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
        <div className="p-4 space-y-2 md:flex-grow">
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
