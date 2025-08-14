import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventTabs from "@/components/event/EventTabs";
import LocationMap from "@/components/event/LocationMap";
import AsideMorph from "@/components/event/AsideMorph";
import { MapPin, Calendar, Tag } from "lucide-react";

const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`${base}/api/events/ticketmaster/${params.id}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const json = await res.json();
  if (!json?.success || !json?.data) notFound();

  const e = json.data as {
    id: string;
    name: string;
    description: string;
    start: string;
    end: string | null;
    image: string;
    venue: {
      name: string;
      address: string;
      latitude: number | null;
      longitude: number | null;
    };
    price: { display: string };
    category: string;
    url: string;
    organizer?: string;
  };

  const startDate = new Date(e.start).toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative">
      {/* HERO */}
      <div
        id="hero"
        className="relative bg-gradient-to-r from-[#111828] to-[#0f243f] bg-teal-200 lg:h-[325px] text-white pt-2"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* breadcrumbs */}
          <nav className="text-sm text-white/80 space-x-2 mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>›</span>
            <span>{e.category || "Event"}</span>
            <span>›</span>
            <span className="text-white">{e.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-start">
            {/* Left: title + meta */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{e.name}</h1>

              <div className="mt-4 space-y-2 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {e.venue.name}
                    {e.venue.address ? `, ${e.venue.address}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{e.category}</span>
                </div>
              </div>
            </div>

            {/* Right: poster */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
                <Image
                  src={e.image}
                  alt={e.name}
                  width={880}
                  height={550}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY CONTAINER - This creates the sticky boundary */}
      <div className="sticky top-40 z-40 bg-white ">
        <div className="max-w-7xl  mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* LEFT: Sticky tabs */}
          <EventTabs description={e.description} ticketUrl={e.url} />

          {/* RIGHT: Sticky aside (desktop only) */}
          <div className="hidden lg:block py-2">
            <AsideMorph
              watchId="hero"
              headerOffsetPx={0}
              url={e.url}
              priceText={e.price?.display}
              title={e.name}
              venue={`${e.venue.name}${
                e.venue.address ? `, ${e.venue.address}` : ""
              }`}
              when={startDate}
              category={e.category}
              organizer={e.organizer}
            />
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* LEFT: Content */}
          <div className="pt-4">
            <div className="mt-10 relative z-0">
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <p className="text-gray-600 mb-4">
                {e.venue.name}
                {e.venue.address ? `, ${e.venue.address}` : ""}
              </p>
              <LocationMap
                lat={e.venue.latitude}
                lng={e.venue.longitude}
                name={e.venue.name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom sticky CTA */}
      <div className="lg:hidden sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 -mb-1">Starts from</div>
            <div className="text-lg font-semibold">
              {e.price?.display || "Price TBA"}
            </div>
          </div>
          <a
            href={e.url}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-11 px-5 hover:bg-blue-700"
          >
            See Tickets
          </a>
        </div>
      </div>
    </div>
  );
}
