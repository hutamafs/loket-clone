import FeaturedEvents from "@/components/homepage/FeaturedEvents";
import { getEvents, tmNow, tmPlusDays } from "@/lib/tmClient";

type Props = {
  title?: string;
  lat: number | string;
  lng: number | string;
  radiusKm?: string; // default 30km
};

export default async function HappeningSoon({
  title = "Happening Soon Near Sydney",
  lat,
  lng,
  radiusKm = "30",
}: Props) {
  const events = await getEvents({
    size: "12",
    sort: "date,asc",
    lat: String(lat),
    lng: String(lng),
    radius: radiusKm,
    unit: "km",
    startDateTime: tmNow(),
    endDateTime: tmPlusDays(7),
    source: "ticketmaster",
  });

  if (!events.length) return null;

  return (
    <section className="max-w-7xl mx-auto">
      <FeaturedEvents title={title} events={events} />
    </section>
  );
}
