// src/components/homepage/TopRanked.tsx
import EventCard from "@/components/event/EventCard";
import { Event as EventInterface } from "@/app/types/event";

export default function TopRanked({
  title = "Top Events",
  events,
}: {
  title?: string;
  events: EventInterface[];
}) {
  if (!events?.length) return null;
  const top3 = events.slice(0, 3);

  return (
    // FULL-BLEED background even inside a centered page:
    <section className="relative w-screen -ml-[50vw] left-1/2 right-1/2 -mr-[50vw] bg-[#0f1f38]">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-6">
          {title}
        </h2>

        {/* Each grid cell owns its own number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {top3.map((e, i) => (
            <article
              key={e.id}
              className="relative pl-16 sm:pl-20 md:pl-24 lg:pl-28"
            >
              {/* The rank stays inside THIS cell only */}
              <span
                aria-hidden
                className="pointer-events-none select-none
                           absolute inset-y-0 left-0 flex items-center
                           font-extrabold leading-none text-white/10
                           text-[96px] sm:text-[120px] md:text-[160px] lg:text-[200px]"
              >
                {i + 1}
              </span>

              {/* Card */}
              <div className="relative">
                <EventCard event={e} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
