export async function fetchNearbyEvents(lat: number, lng: number) {
  const res = await fetch(
    `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lng}&location.within=25km&expand=venue,logo&sort_by=date`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_EVENTBRITE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Eventbrite API error");
  return res.json();
}
