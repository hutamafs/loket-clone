import Image from "next/image";

type Cat = {
  label: string; // English label
  tmClassification: string;
  img: string;
};

export const categoryImages: Record<string, string> = {
  Music: "/images/categories/music.png",
  Sports: "/images/categories/sports.png",
  "Arts & Theatre": "/images/categories/theatre.png",
  Film: "/images/categories/film.png",
  "Festival, Fair, Bazaar": "/images/categories/festival.png",
  "Exhibition, Expo": "/images/categories/expo.png",
  Conference: "/images/categories/conference.png",
  Workshop: "/images/categories/workshop.png",
  Family: "/images/categories/family.png",
  "Theme Park": "/images/categories/themepark.png",
};

export const CATS: Cat[] = [
  {
    label: "Music",
    tmClassification: "KZFzniwnSyZfZ7v7nJ",
    img: "music",
  },
  {
    label: "Sport",
    tmClassification: "KZFzniwnSyZfZ7v7nE",
    img: "sport",
  },
  {
    label: "Arts & Theatre",
    tmClassification: "KZFzniwnSyZfZ7v7na",
    img: "art",
  },
  {
    label: "Film",
    tmClassification: "KZFzniwnSyZfZ7v7nn",
    img: "film",
  },
  {
    label: "Venue Based",
    tmClassification: "KZAyXgnZfZ7v7n1",
    img: "festival",
  },
  {
    label: "Group",
    tmClassification: "KZAyXgnZfZ7v7l1",
    img: "family",
  },
  {
    label: "Individual",
    tmClassification: "KZAyXgnZfZ7v7la",
    img: "workshop",
  },
  {
    label: "NonTicket",
    tmClassification: "KZAyXgnZfZ7v7l6",
    img: "theme-park",
  },
];

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-2xl border bg-white shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-semibold">
            Event Categories
          </h3>
        </div>

        {/* Top image tiles */}
        <div className="mt-5 flex gap-4 overflow-x-auto md:overflow-hidden no-scrollbar snap-x">
          {CATS.map((c) => (
            <a
              key={c.label}
              href={`/events?classificationId=${encodeURIComponent(
                c.tmClassification
              )}`}
              className="shrink-0 snap-start"
            >
              <div className="h-[112px] w-[112px] md:h-[120px] md:w-[120px] rounded-2xl overflow-hidden ring-1 ring-black/5 bg-gray-100 relative">
                <Image
                  src={`/images/categories/${c.img}.png`}
                  alt={c.label}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="mt-2 text-center text-[12px] md:text-sm font-medium line-clamp-2 w-[112px] md:w-[132px]">
                {c.label}
              </div>
            </a>
          ))}
        </div>

        {/* Pill row with icons */}
        <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
          {CATS.map((c) => (
            <a
              key={`${c.label}-pill`}
              href={`/events?classificationName=${encodeURIComponent(
                c.tmClassification
              )}`}
              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {/* <c.Icon size={16} className="text-blue-500" /> */}
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
