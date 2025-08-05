import { EventMap } from "@/components/maps/EventMap";

export default function EventMapPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Events Near You</h2>
      <EventMap />
    </div>
  );
}
