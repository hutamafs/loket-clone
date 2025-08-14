"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type Props = {
  watchId: string; // the hero element id to observe
  headerOffsetPx?: number; // height of sticky header (so the switch happens right under it)
  url: string;
  priceText?: string;
  title: string;
  venue: string;
  when: string;
  category?: string;
  organizer?: string;
};

export default function AsideMorph({
  watchId,
  headerOffsetPx, // matches your <main className="pt-24">
  url,
  priceText,
  title,
  venue,
  when,
  category,
  organizer,
}: Props) {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById(watchId);
    if (!hero) return;
    const io = new IntersectionObserver(
      (entries) => setHeroVisible(entries[0].isIntersecting),
      { rootMargin: `-${headerOffsetPx}px 0px 0px 0px`, threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [watchId, headerOffsetPx]);

  return (
    <aside>
      <div
        className="sticky"
        style={{ top: headerOffsetPx /* aligned with tabs */ }}
      >
        <AnimatePresence mode="wait">
          {heroVisible ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Starts from</div>
                  <div className="text-2xl font-bold">
                    {priceText ?? "Price TBA"}
                  </div>
                </div>
                <Link
                  href={url}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-11 px-6 hover:bg-blue-700"
                >
                  See Tickets
                </Link>
              </div>

              {organizer ? (
                <div className="mt-4 text-sm text-gray-600">
                  <div className="font-medium text-gray-800">Organized by</div>
                  <div className="line-clamp-2">{organizer}</div>
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border bg-white p-5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg border bg-gray-50 px-3 py-2.5">
                  <p className="text-xs text-gray-500">Starts from</p>
                  <p className="text-lg font-bold">
                    {priceText ?? "Price TBA"}
                  </p>
                </div>

                <Link
                  href={url}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white h-11 px-6 text-sm font-semibold hover:bg-blue-700"
                >
                  See Tickets
                </Link>
              </div>

              <h3 className="text-xl font-semibold leading-snug mt-5">
                {title}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-700">{venue}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-700">{when}</span>
                </div>
                {category && (
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700">{category}</span>
                  </div>
                )}
              </div>

              {organizer ? (
                <div className="mt-4 text-sm">
                  <div className="text-gray-500">Organized by</div>
                  <div className="font-medium text-gray-900">{organizer}</div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
