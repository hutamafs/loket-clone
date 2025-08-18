"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cityCoordinates } from "@/constant/coordinates";
import type {
  ITicketMasterVenue,
  IMappedTicketMasterClassification,
} from "@/app/types/event";

export default function SidebarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [openLocation, setOpenLocation] = useState(true);
  const [openClassification, setOpenClassification] = useState(false);
  const [openVenue, setOpenVenue] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);

  const [options, setOptions] = useState({
    venues: [] as ITicketMasterVenue[],
    classifications: [] as IMappedTicketMasterClassification[],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Get current query parameters
  const getQueryParams = useCallback(() => {
    const city = searchParams.get("city") || "";

    // Handle multiple classificationIds
    const classificationIds = searchParams
      .getAll("classificationId")
      .filter(Boolean);

    // Handle multiple genreIds
    const genreIds = searchParams.getAll("genreId").filter(Boolean);

    return {
      page: searchParams.get("page") || "0",
      lat: searchParams.get("lat") || "",
      lng: searchParams.get("lng") || "",
      // lat: searchParams.get("lat") || cityCoordinates[city].lat,
      // lng: searchParams.get("lng") || cityCoordinates[city].lng,
      radius: searchParams.get("radius") || "50",
      keyword: searchParams.get("keyword") || "",
      city: city,
      size: searchParams.get("size") || "8",
      classificationIds: classificationIds.length > 0 ? classificationIds : [],
      genreIds: genreIds.length > 0 ? genreIds : [],
      venueId: searchParams.get("venueId") || "",
    };
  }, [searchParams]);

  const q = getQueryParams();

  const selectedClassification =
    q.classificationIds.length > 0
      ? options.classifications.find(
          (c) => c.id === q.classificationIds[q.classificationIds.length - 1]
        )
      : undefined;

  // update URL with new parameters and router push to trigger server fetch at events/page
  const updateUrlAndNavigate = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update with new params
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // always reset to page 0 when filter changes
      params.set("page", "0");

      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleLocationSelect = useCallback(
    (city: string) => {
      updateUrlAndNavigate({
        city,
        lat: cityCoordinates[city].lat,
        lng: cityCoordinates[city].lng,
      });
    },
    [updateUrlAndNavigate]
  );

  const handleClassificationSelect = useCallback(
    (classificationId: string) => {
      const currentClassificationIds = q.classificationIds || [];
      let newClassificationIds: string[];

      // Toggle selection logic
      if (currentClassificationIds.includes(classificationId)) {
        // Remove if already selected
        newClassificationIds = currentClassificationIds.filter(
          (id) => id !== classificationId
        );
      } else {
        // Add if not selected
        newClassificationIds = [...currentClassificationIds, classificationId];
      }

      // Build new URL parameters
      const params = new URLSearchParams(searchParams.toString());

      // Remove existing classifications
      params.delete("classificationId");

      // Add new classifications
      newClassificationIds.forEach((id) => {
        params.append("classificationId", id);
      });

      // Always reset to page 0 when filter changes
      params.set("page", "0");

      // Navigate to new URL
      router.push(`/events?${params.toString()}`);

      // Open genre accordion if the selected classification has genres
      if (
        !currentClassificationIds.includes(classificationId) &&
        newClassificationIds.includes(classificationId)
      ) {
        setOpenGenre(
          (options.classifications.find((c) => c.id === classificationId)
            ?.genres?.length ?? 0) > 0
        );
      }
    },
    [q.classificationIds, router, searchParams, options.classifications]
  );

  const handleGenreSelect = useCallback(
    (genreId: string) => {
      const currentGenreIds = q.genreIds || [];
      let newGenreIds: string[];

      // Toggle selection logic
      if (currentGenreIds.includes(genreId)) {
        // Remove if already selected
        newGenreIds = currentGenreIds.filter((id) => id !== genreId);
      } else {
        // Add if not selected
        newGenreIds = [...currentGenreIds, genreId];
      }

      // Build new URL parameters
      const params = new URLSearchParams(searchParams.toString());

      // Remove existing genres
      params.delete("genreId");

      // Add new genres
      newGenreIds.forEach((id) => {
        params.append("genreId", id);
      });

      // Always reset to page 0 when filter changes
      params.set("page", "0");

      // Navigate to new URL
      router.push(`/events?${params.toString()}`);
    },
    [q.genreIds, router, searchParams]
  );

  const handleVenueSelect = useCallback(
    (venueId: string) => {
      updateUrlAndNavigate({
        venueId,
      });
    },
    [updateUrlAndNavigate]
  );

  const fetchFilterData = useCallback(
    async (city: string, lat: string, lng: string) => {
      setIsLoading(true);
      try {
        // Fetch classifications and venues in parallel
        const [classificationsRes, venuesRes] = await Promise.all([
          fetch("/api/classifications"),
          fetch(`/api/venues?lat=${lat}&lng=${lng}&city=${city}`),
        ]);

        const classificationsData = await classificationsRes.json();
        const venuesData = await venuesRes.json();

        console.log(classificationsData);
        setOptions({
          classifications: classificationsData.data || [],
          venues: venuesData.data || [],
        });
      } catch (err) {
        console.error("Error fetching filter data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch data on initial load and when location changes
  useEffect(() => {
    fetchFilterData(q.city, q.lat, q.lng);
  }, [q.city, q.lat, q.lng, fetchFilterData]);

  // Auto-expand accordions based on selected filters
  useEffect(() => {
    // Automatically open venue section if a venue is selected
    if (q.venueId) {
      setOpenVenue(true);
    }

    // Automatically open classification section if classifications are selected
    if (q.classificationIds.length > 0) {
      setOpenClassification(true);
    }

    // Automatically open genre section if genres are selected
    if (q.genreIds.length > 0) {
      setOpenGenre(true);
    }
  }, [q.venueId, q.classificationIds, q.genreIds]);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    // Preserve only the essential parameters
    const params = new URLSearchParams();
    // params.set("city", "Melbourne");
    // params.set("lat", cityCoordinates["Melbourne"].lat);
    // params.set("lng", cityCoordinates["Melbourne"].lng);
    params.set("city", "");
    params.set("lat", "");
    params.set("lng", "");
    params.set("page", "0");

    // Preserve keyword if it exists
    const keyword = searchParams.get("keyword");
    if (keyword) params.set("keyword", keyword);

    // Reset UI state as well
    setOpenClassification(false);
    setOpenVenue(false);
    setOpenGenre(false);
    setOpenLocation(true);

    router.push(`/events?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <aside className="w-full p-8 md:p-0 md:w-64 mr-0 md:mr-8">
      <div className="sticky top-24 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Filter</h2>
          <button
            onClick={handleResetFilters}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            title="Reset all filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Reset</span>
          </button>
        </div>

        {/* Location Accordion */}
        <div>
          <button
            onClick={() => setOpenLocation((prev) => !prev)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800"
          >
            Location
            {openLocation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openLocation && (
            <div className="pl-4 mt-1 space-y-1 max-h-[150px] overflow-y-auto">
              {Object.keys(cityCoordinates).map((city) => (
                <button
                  key={city}
                  onClick={() => handleLocationSelect(city)}
                  className={`block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 ${
                    q.city === city
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* venue Accordion */}
        <div>
          <button
            onClick={() => setOpenVenue((prev) => !prev)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800"
          >
            Venue
            {openVenue ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openVenue && (
            <div className="pl-4 mt-1 space-y-1 max-h-[150px] overflow-y-auto">
              {isLoading ? (
                <div className="text-sm text-gray-500 py-2 text-center">
                  <div className="animate-pulse flex space-x-2 justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              ) : options.venues.length === 0 ? (
                <div className="text-sm text-gray-500 py-2 text-center">
                  No venues found
                </div>
              ) : (
                options.venues.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => v.id && handleVenueSelect(v.id)}
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 ${
                      v.id && q.venueId === v.id
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {v.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Classification Accordion */}
        <div>
          <button
            onClick={() => setOpenClassification((prev) => !prev)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800"
          >
            Classification
            {openClassification ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {openClassification && (
            <div className="pl-4 mt-1 space-y-1 max-h-[150px] overflow-y-auto">
              {isLoading ? (
                <div className="text-sm text-gray-500 py-2 text-center">
                  <div className="animate-pulse flex space-x-2 justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              ) : options.classifications.length === 0 ? (
                <div className="text-sm text-gray-500 py-2 text-center">
                  No classifications found
                </div>
              ) : (
                options.classifications.map((c) => (
                  <div key={c.id} className="flex items-center">
                    <button
                      onClick={() => handleClassificationSelect(c.id)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 ${
                        q.classificationIds.includes(c.id)
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="flex items-center">
                        <span
                          className={`w-4 h-4 mr-2 inline-flex items-center justify-center border rounded ${
                            q.classificationIds.includes(c.id)
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {q.classificationIds.includes(c.id) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                        {c.name}
                      </span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Genre Accordion */}
        {selectedClassification?.genres &&
          selectedClassification.genres.length > 0 && (
            <div>
              <button
                onClick={() => setOpenGenre((prev) => !prev)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-800"
              >
                Genre
                {openGenre ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {openGenre && (
                <div className="pl-4 mt-1 space-y-1 max-h-[150px] overflow-y-auto">
                  {isLoading ? (
                    <div className="text-sm text-gray-500 py-2 text-center">
                      <div className="animate-pulse flex space-x-2 justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    selectedClassification.genres.map((g) => (
                      <div key={g.id} className="flex items-center">
                        <button
                          onClick={() => handleGenreSelect(g.id)}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 ${
                            q.genreIds.includes(g.id)
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="flex items-center">
                            <span
                              className={`w-4 h-4 mr-2 inline-flex items-center justify-center border rounded ${
                                q.genreIds.includes(g.id)
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "border-gray-400"
                              }`}
                            >
                              {q.genreIds.includes(g.id) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </span>
                            {g.name}
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
      </div>
    </aside>
  );
}
