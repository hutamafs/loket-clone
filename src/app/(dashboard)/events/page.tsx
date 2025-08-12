"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import EventGrid from "@/components/event/EventGrid";
import { Search, Filter, MapPin } from "lucide-react";
import { Event } from "@/app/types/event";
import { EventPagination } from "@/components/pagination/Pagination";
import { cityCoordinates } from "@/constant/coordinates";

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState({
    page: searchParams.get("page") || "0",
    lat: searchParams.get("lat") || cityCoordinates["Melbourne"].lat,
    lng: searchParams.get("lng") || cityCoordinates["Melbourne"].lng,
    radius: searchParams.get("radius") || "50",
    keyword: searchParams.get("keyword") || "",
    city: "Melbourne",
  });
  const shouldFetchRef = useRef(true);

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams({
      ...q,
      page: String(p),
      city: q.city,
    }).toString();
    router.push(`/events?${params}`);
    setQ((prevState) => ({
      ...prevState,
      page: String(p),
    }));
    shouldFetchRef.current = true;
  };

  // Fetch events from our API
  const fetchEvents = useCallback(async (queryParams: typeof q) => {
    const p = new URLSearchParams({
      ...queryParams,
      city: queryParams.city,
    }).toString();
    setError(null);

    try {
      const params = new URLSearchParams(p).toString();
      const apiResp = await fetch(`/api/events/ticketmaster?${params}`);
      const res = await apiResp.json();

      if (res.success) {
        setEvents(res.data.data);
        setTotalPages(res.total);
      } else {
        setError(res.error || "Failed to load events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Network error - please try again");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle URL search params changes (back/forward navigation, initial load)
  useEffect(() => {
    const page = searchParams.get("page") || "0";
    const lat = searchParams.get("lat") || cityCoordinates["Melbourne"].lat;
    const lng = searchParams.get("lng") || cityCoordinates["Melbourne"].lng;
    const radius = searchParams.get("radius") || "50";
    const keyword = searchParams.get("keyword") || "";

    console.log("URL params changed:", { page, lat, lng, radius, keyword });

    setQ((prev) => ({
      ...prev,
      page,
      lat,
      lng,
      radius,
      keyword,
    }));

    // Always fetch when URL changes
    shouldFetchRef.current = true;
  }, [searchParams]);

  // Only fetch when shouldFetchRef is true
  useEffect(() => {
    if (shouldFetchRef.current) {
      console.log("Fetching with params:", q);
      fetchEvents(q);
      shouldFetchRef.current = false;
    }
  }, [q, fetchEvents]);

  // Handle event registration (placeholder)
  const handleEventRegister = async (eventId: string) => {
    console.log("Registering for event:", eventId);
    // TODO: Implement registration logic
    alert(`Registration for event ${eventId} - Coming soon!`);
  };

  const handleSelectChange = (value: string) => {
    setQ((prev) => ({
      ...prev,
      city: value,
    }));
    const params = new URLSearchParams({
      ...q,
      lat: cityCoordinates[value].lat,
      lng: cityCoordinates[value].lng,
      city: value,
    }).toString();
    router.push(`/events?${params}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    shouldFetchRef.current = true;
    // Include keyword in URL params
    const params = new URLSearchParams({ ...q }).toString();
    router.push(`/events?${params}`);
  };

  const handleKeywordChange = (keyword: string) => {
    setQ((prevState) => ({
      ...prevState,
      keyword,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Events in {q.city}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover amazing events happening near you
              </p>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <select
                value={q.city}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(cityCoordinates).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
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
            <form onSubmit={handleSubmit}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, venues, or categories..."
                value={q.keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800">
              <h3 className="font-medium">Error loading events</h3>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => {
                  shouldFetchRef.current = true;
                  fetchEvents(q);
                }}
                className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <EventGrid
          events={events}
          loading={loading}
          onRegister={handleEventRegister}
        />
        {events.length > 0 && (
          <EventPagination
            page={Number(q.page)}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
