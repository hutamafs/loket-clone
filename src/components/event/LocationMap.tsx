export default function LocationMap({
  lat,
  lng,
  name,
}: {
  lat: number | null;
  lng: number | null;
  name: string;
}) {
  if (!lat || !lng) {
    return (
      <div className="rounded-xl border p-4 text-gray-600">
        Map unavailable.
      </div>
    );
  }

  const href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.01
  }%2C${lat - 0.01}%2C${lng + 0.01}%2C${
    lat + 0.01
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="rounded-xl overflow-hidden border">
      <iframe
        className="w-full h-[300px]"
        src={src}
        title={`Map for ${name}`}
        loading="lazy"
      />
      <div className="p-2 bg-gray-50 text-sm">
        <a href={href} target="_blank" className="text-blue-600 underline">
          View larger map
        </a>
      </div>
    </div>
  );
}
