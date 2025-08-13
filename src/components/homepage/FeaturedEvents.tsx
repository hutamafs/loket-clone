import EventCard from "@/components/event/EventCard";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { Event as EventInterface } from "@/app/types/event";

export default function FeaturedEvents({
  title = "Featured Events",
  events,
}: {
  title?: string;
  events: EventInterface[];
}) {
  if (!events?.length) return null;

  return (
    <section className="w-full min-w-0 max-w-7xl mx-auto px-4 py-8 mt-12 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <HorizontalScroller>
        {events.slice(0, 12).map((e: EventInterface) => (
          <EventCard key={e.id} event={e} />
        ))}
      </HorizontalScroller>
    </section>
  );
}
