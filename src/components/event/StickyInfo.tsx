// app/event/[id]/StickyInfo.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Tags } from "lucide-react";
import Link from "next/link";

type StickyInfoProps = {
  watchId: string; // the banner/hero element id
  title: string;
  venue: string;
  when: string;
  category?: string;
  priceText?: string;
  organizer?: string;
  url: string;
  headerOffsetPx?: number; // height of your sticky header; default ≈ pt-24 = 96
  ticketBarId?: string; // optional id of a sticky “price” bar to add to the top offset
};

export default function StickyInfo({
  watchId,
  title,
  venue,
  when,
  category,
  priceText,
  organizer,
  url,
  headerOffsetPx = 96,
  ticketBarId,
}: StickyInfoProps) {
  const [top, setTop] = useState<number>(headerOffsetPx);
  const [ratio, setRatio] = useState(1); // 1 = fully visible, 0 = fully gone

  // Build a dense threshold array so we get smooth ratio updates
  const thresholds = useMemo(
    () => Array.from({ length: 101 }, (_, i) => i / 100),
    []
  );

  // Measure sticky offset = header + optional ticket bar height
  useEffect(() => {
    const measure = () => {
      let t = headerOffsetPx;
      if (ticketBarId) {
        const bar = document.getElementById(ticketBarId);
        if (bar) t += bar.getBoundingClientRect().height;
      }
      setTop(t);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [headerOffsetPx, ticketBarId]);

  // Observe the hero to derive a scroll "progress" feel
  useEffect(() => {
    const hero = document.getElementById(watchId);
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // entry.intersectionRatio: 0…1
        setRatio(entry.intersectionRatio);
      },
      {
        root: null,
        // Start “counting down” as soon as the hero starts sliding under the header
        rootMargin: `-${top}px 0px 0px 0px`,
        threshold: thresholds,
      }
    );

    io.observe(hero);
    return () => io.disconnect();
  }, [watchId, thresholds, top]);

  // Map ratio (1 → 0) to a gentle translate/opacity
  const progress = 1 - ratio; // 0 = hero fully visible, 1 = fully gone
  const opacity = 0.25 + progress * 0.75; // 0.25 → 1
  const translateY = 12 + progress * 12; // 12px → 24px (subtle slide)

  return (
    <aside
      className="hidden lg:block sticky transition-[opacity,transform] duration-150 ease-linear"
      style={{
        top,
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: "transform,opacity",
        pointerEvents: progress > 0.05 ? "auto" : "none",
      }}
    >
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold leading-snug line-clamp-2">
            {title}
          </h3>
          {organizer && (
            <p className="mt-1 text-xs text-gray-500">
              Organized by <span className="font-medium">{organizer}</span>
            </p>
          )}
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
            <span className="text-gray-700">{venue}</span>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
            <span className="text-gray-700">{when}</span>
          </div>
          {category && (
            <div className="flex items-start gap-3">
              <Tags className="h-4 w-4 mt-0.5 text-gray-500" />
              <span className="text-gray-700">{category}</span>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          {priceText && (
            <div className="mb-3 rounded-md border bg-gray-50 px-3 py-2">
              <p className="text-xs text-gray-500">Starts from</p>
              <p className="text-base font-semibold">{priceText}</p>
            </div>
          )}
          <Link
            href={url}
            target="_blank"
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 text-white h-11 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            See Tickets
          </Link>
        </div>
      </div>
    </aside>
  );
}
