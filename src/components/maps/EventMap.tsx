"use client";
import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/lib/googlemaps";

export function EventMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (ref.current) {
        new google.maps.Map(ref.current, {
          center: { lat: -37.8136, lng: 144.9631 },
          zoom: 12,
        });
      }
    });
  }, []);

  return <div ref={ref} className="h-[400px] w-full rounded-lg" />;
}
