import EventCard from "./EventCard";
import { Event } from "@/app/types/event";

interface EventGridProps {
  events: Event[];
  loading?: boolean;
  onRegister?: (eventId: string) => void;
}

export default function EventGrid({
  events,
  loading,
  onRegister,
}: EventGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎪</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No events found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={`${event.source}-${event.id}`}
          event={event}
          onRegister={onRegister}
        />
      ))}
    </div>
  );
}
