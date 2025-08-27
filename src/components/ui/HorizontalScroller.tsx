// components/ui/HorizontalScroller.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function HorizontalScroller({
  children,
  className = "",
  gapPx = 20, // gap between cards (match container gap)
}: {
  children: React.ReactNode;
  className?: string;
  gapPx?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [stepPx, setStepPx] = useState(600); // will be recalculated

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

    // compute step: how many items fit -> scroll by that viewport width
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    if (firstCard) {
      const cardW = firstCard.getBoundingClientRect().width;
      const visible = Math.max(1, Math.floor(el.clientWidth / (cardW + gapPx)));
      setStepPx(visible * (cardW + gapPx));
    }
  };

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const nav = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = dir === "left" ? -stepPx : stepPx;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div
      className={`relative w-full min-w-0 overflow-hidden group ${className}`}
    >
      {/* scrollable track */}
      <div
        ref={trackRef}
        className="
      w-full min-w-0
      overflow-x-auto scroll-smooth snap-x snap-mandatory
      [scrollbar-width:none] [-ms-overflow-style:none]
      -mx-4 px-4 md:mx-0 md:px-0
    "
      >
        <div className="w-max flex gap-5 md:gap-6 [&::-webkit-scrollbar]:hidden">
          {Array.isArray(children) ? (
            children.map((c, i) => (
              <div key={i} data-card className="shrink-0">
                {c}
              </div>
            ))
          ) : (
            <div data-card className="shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* gradient fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-2xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-2xl" />

      {/* chevrons */}
      {canLeft && (
        <button
          aria-label="Scroll left"
          onClick={() => nav("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          ‹
        </button>
      )}
      {canRight && (
        <button
          aria-label="Scroll right"
          onClick={() => nav("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          ›
        </button>
      )}
    </div>
  );
}
