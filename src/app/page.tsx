// app/page.tsx
import CategoriesSection from "@/components/homepage/Categories";
import FeaturedEvents from "@/components/homepage/FeaturedEvents";
import HappeningSoon from "@/components/homepage/HappeningSoon";
import TopEvents from "@/components/homepage/TopEvents";
import { cityCoordinates } from "@/constant/coordinates";
import { getEvents, tmNow, tmPlusDays } from "@/lib/tmClient";

export const revalidate = 0;

export default async function Home() {
  const melb = cityCoordinates["Melbourne"];
  const syd = cityCoordinates["Sydney"];

  // ① Featured — Melbourne (local, next 90d)
  const featuredMelbourne = await getEvents({
    size: "12",
    sort: "date,asc",
    lat: String(melb.lat),
    lng: String(melb.lng),
    radius: "50",
    unit: "km",
    startDateTime: tmNow(),
    endDateTime: tmPlusDays(90),
    source: "ticketmaster", // optional: keep results consistent
  });

  // ② Top Events — Worldwide (rank-ish via relevance)
  const topWorldwide = await getEvents({
    size: "12",
    sort: "relevance,desc",
    countryCode: "AU",
    startDateTime: tmNow(),
    endDateTime: tmPlusDays(60),
    source: "ticketmaster",
  });

  // ③ Upcoming — Australia (national, next 45d)
  const upcomingAU = await getEvents({
    size: "12",
    sort: "date,asc",
    countryCode: "AU",
    startDateTime: tmNow(),
    endDateTime: tmPlusDays(45),
    source: "ticketmaster",
  });

  // Optional: simple de-dup so the same event doesn't appear twice
  const seen = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dedupe = (arr: any[]) =>
    arr.filter((e) => (seen.has(e.id) ? false : (seen.add(e.id), true)));
  const featuredDeduped = dedupe(featuredMelbourne);
  const worldwideDeduped = dedupe(topWorldwide);
  const upcomingAUDeduped = dedupe(upcomingAU);

  return (
    // {/* Local first */}
    <section className="max-w-7xl mx-auto px-4 py-8">
      <FeaturedEvents
        title="Featured Events in Melbourne"
        events={featuredDeduped}
      />

      {/* Global reach */}

      <TopEvents title="Top Events in Australia" events={worldwideDeduped} />

      {/* Country scope */}

      <FeaturedEvents
        title="Upcoming in Australia"
        events={upcomingAUDeduped}
      />
      {/* Next sections you’ll add */}
      {/* <CategoriesRow /> */}
      <CategoriesSection />
      <HappeningSoon lat={syd.lat} lng={syd.lng} radiusKm="30" />
      {/* <FeaturedSoonNearYou /> */}
      {/* <NewsletterCapture /> */}
    </section>
  );
}
