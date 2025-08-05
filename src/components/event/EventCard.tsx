import Image from "next/image";
import { CalendarDays, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { EventCardProps } from "@/app/types/event";

export default function EventCard({ event, onRegister }: EventCardProps) {
  const eventDate = new Date(event.start);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Event Image */}
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {event.source === "ticketmaster" ? "Ticketmaster" : "Local"}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {event.name}
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {event.category}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center text-gray-600 mb-2">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span className="text-sm">
            {format(eventDate, "EEE, MMM d")} at {format(eventDate, "h:mm a")}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm line-clamp-1">{event.venue.name}</span>
        </div>

        {/* Price */}
        <div className="flex items-center text-gray-600 mb-4">
          <DollarSign className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{event.price.display}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {event.canRegister && (
            <button
              onClick={() => onRegister?.(event.id)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Register
            </button>
          )}

          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
            Details
          </button>

          {event.canEdit && (
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
