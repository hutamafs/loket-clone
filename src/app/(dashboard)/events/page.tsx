import EventGrid from "@/components/event/EventGrid";
import { Event } from "@/app/types/event";
import { EventPagination } from "@/components/pagination/Pagination";
import { cityCoordinates } from "@/constant/coordinates";
import SidebarFilter from "@/components/event/SidebarFilter";
import MobileFilterToggle from "@/components/event/MobileFilterToggle";
import { createSearchParamsString } from "@/lib/event";

// Helper function to parse query params with defaults
function getQueryParams(params: {
  [key: string]: string | string[] | undefined;
}) {
  const defaults = {
    page: "0",
    city: "Melbourne",
    radius: "50",
    keyword: "",
    size: "8",
    genreId: "",
    venueId: "",
  };

  const city = typeof params.city === "string" ? params.city : defaults.city;
  const lat =
    typeof params.lat === "string"
      ? params.lat
      : cityCoordinates[city]?.lat || cityCoordinates[defaults.city].lat;
  const lng =
    typeof params.lng === "string"
      ? params.lng
      : cityCoordinates[city]?.lng || cityCoordinates[defaults.city].lng;

  const getParam = (key: keyof typeof defaults) =>
    typeof params[key] === "string" ? params[key] : defaults[key];

  const classificationId = Array.isArray(params.classificationId)
    ? params.classificationId
    : typeof params.classificationId === "string"
    ? [params.classificationId]
    : [];

  return {
    page: getParam("page"),
    lat,
    lng,
    radius: getParam("radius"),
    keyword: getParam("keyword"),
    city,
    size: getParam("size"),
    classificationId,
    genreId: getParam("genreId"),
    venueId: getParam("venueId"),
  };
}

async function fetchEventData(params: Record<string, string | string[]>) {
  try {
    // Create URLSearchParams manually to handle arrays
    const searchParams = new URLSearchParams();

    // Add all non-array parameters
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "classificationId") {
        searchParams.append(key, value as string);
      }
    });

    // Add each classificationId separately for arrays
    if (Array.isArray(params.classificationId)) {
      params.classificationId.forEach((id) => {
        if (id) searchParams.append("classificationId", id);
      });
    }

    const queryString = searchParams.toString();
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiResp = await fetch(
      `${baseUrl}/api/events/ticketmaster?${queryString}`,
      { next: { revalidate: 60 } }
    );

    if (!apiResp.ok) {
      throw new Error(`API responded with status: ${apiResp.status}`);
    }

    const res = await apiResp.json();

    if (!res.success) {
      throw new Error(res.error || "Failed to load events");
    }

    return {
      events: res.data.data as Event[],
      totalPages: res.data.total as number,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching events:", err);
    return {
      events: [],
      totalPages: 1,
      error:
        err instanceof Error ? err.message : "Network error - please try again",
    };
  }
}

// Server component to fetch event data - now async and awaits searchParams
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  const queryParams = getQueryParams(resolvedSearchParams);

  // Fetch data directly in the main component
  const { events, totalPages, error } = await fetchEventData(queryParams);

  return (
    <div className="min-h-screen bg-white pt-[145px] md:pt-[186px]">
      <div className="flex flex-col md:flex-row px-4 md:px-10 py-4 md:py-8 relative">
        {/* Mobile Filter Toggle Button */}
        <MobileFilterToggle />

        {/* Sidebar Filter - Hidden on mobile by default */}
        <div id="sidebar-container" className="hidden md:block md:w-64 lg:w-72">
          <SidebarFilter />
        </div>

        {/* Main Content */}
        <main className="flex flex-col items-center w-full md:flex-1 md:items-start">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-red-800">
                <h3 className="font-medium">Error loading events</h3>
                <p className="text-sm mt-1">{error}</p>
                <a
                  href={`/events?${createSearchParamsString(queryParams)}`}
                  className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded inline-block"
                >
                  Try Again
                </a>
              </div>
            </div>
          )}

          {/* Event Grid */}
          <EventGrid events={events} loading={false} />

          {/* Pagination */}
          {events.length > 0 && (
            <EventPagination
              page={Number(queryParams.page)}
              totalPages={totalPages}
              onPageChange={undefined}
              currentQueryParams={Object.fromEntries(
                Object.entries(queryParams).map(([k, v]) => [
                  k,
                  Array.isArray(v) ? v.join(",") : v,
                ])
              )}
            />
          )}
        </main>
      </div>
    </div>
  );
}
