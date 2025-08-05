// src/app/(dashboard)/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchNearbyEvents } from "@/lib/eventbrite";
import { toast } from "sonner";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_EVENTBRITE_API_KEY);
    async function load() {
      try {
        const data = await fetchNearbyEvents(-37.8136, 144.9631);
        console.log(data, 16);
        setEvents(data.events || []);
      } catch (err) {
        console.log(err.message);
        toast.error("Failed to load events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Upcoming Events in Melbourne
      </h2>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <a
              key={event.id}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border p-4 rounded-lg hover:shadow transition"
            >
              <img
                src={event.logo?.url || "/placeholder.png"}
                alt={event.name.text}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-bold">{event.name.text}</h3>
              <p className="text-muted-foreground text-sm">
                {event.start.local}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
