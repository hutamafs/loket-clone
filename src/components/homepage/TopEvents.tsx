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
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
          {title}
        </h2>

        {/* Each grid cell owns its own number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6">
          {top3.map((e, i) => (
            <article key={e.id} className="relative px-6">
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
