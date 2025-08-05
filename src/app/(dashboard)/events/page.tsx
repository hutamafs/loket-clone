// app/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import EventGrid from "@/components/event/EventGrid";
import { Search, Filter, MapPin } from "lucide-react";
import { Event } from "@/app/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Melbourne");

  // Fetch events from our API
  const fetchEvents = async (city: string = "Melbourne") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/ticketmaster`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        console.log(`Loaded ${data.events.length} events for ${city}`);
      } else {
        setError(data.error || "Failed to load events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Network error - please try again");
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount and city change
  useEffect(() => {
    fetchEvents(selectedCity);
  }, [selectedCity]);

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle event registration (placeholder)
  const handleEventRegister = async (eventId: string) => {
    console.log("Registering for event:", eventId);
    // TODO: Implement registration logic
    alert(`Registration for event ${eventId} - Coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Events in {selectedCity}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover amazing events happening near you
              </p>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Melbourne">Melbourne</option>
                <option value="Sydney">Sydney</option>
                <option value="Brisbane">Brisbane</option>
                <option value="Perth">Perth</option>
                <option value="Adelaide">Adelaide</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, venues, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {searchTerm ? (
                <>
                  Showing {filteredEvents.length} of {events.length} events
                  matching &quot;{searchTerm}&quot;
                </>
              ) : (
                <>
                  Showing {events.length} events in {selectedCity}
                </>
              )}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800">
              <h3 className="font-medium">Error loading events</h3>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchEvents(selectedCity)}
                className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <EventGrid
          events={filteredEvents}
          loading={loading}
          onRegister={handleEventRegister}
        />
      </div>
    </div>
  );
}
